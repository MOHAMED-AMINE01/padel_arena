import { Request, Response } from 'express';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from '../models/Booking';
import Course from '../models/Course';
import Tournament from '../models/Tournament';
import { sendEmail, getEmailTemplate } from '../services/mailService';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/**
 * @desc    Create a Stripe Checkout Session for a court reservation
 * @route   POST /api/payments/create-checkout-session
 */
interface PaymentRequestBody {
  bookingId: string;
  courtName?: string;
  amount: number;
  successUrl?: string;
  cancelUrl?: string;
  customerEmail?: string;
}

export const createCheckoutSession = async (req: Request, res: Response) => {
  console.log('Backend: Create Checkout Session request received', req.body);
  try {
    const { 
      bookingId, 
      courtName, 
      amount, 
      successUrl, 
      cancelUrl,
      customerEmail 
    } = req.body as PaymentRequestBody;

    if (!amount || !bookingId) {
      return res.status(400).json({ success: false, message: 'Informations de paiement manquantes.' });
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Réservation : ${courtName || 'Terrain de Padel'}`,
              description: `Référence réservation : #${bookingId.toString().slice(-6).toUpperCase()}`,
            },
            unit_amount: Math.round(amount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${process.env.CLIENT_URL}/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.CLIENT_URL}/reservation`,
      customer_email: customerEmail,
      metadata: {
        bookingId: bookingId.toString(),
        type: 'COURT_RESERVATION'
      },
    });

    res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id
    });
  } catch (error: any) {
    console.error('Stripe Session Error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la session de paiement.',
      error: error.message
    });
  }
};

/**
 * @desc    Stripe Webhook handler
 * @route   POST /api/payments/webhook
 */
export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Verify webhook signature (CRITICAL: Needs RAW body)
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig as string, 
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error(`Webhook Signature Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Successful payment!
    const bookingId = session.metadata?.bookingId;
    
    if (bookingId) {
      console.log(`✅ Payment success for booking: ${bookingId}`);
      
      try {
        const booking = await Booking.findByIdAndUpdate(bookingId, {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
          stripePaymentIntentId: session.payment_intent as string
        }).populate('court user');

        if (booking) {
          const clientEmail = (booking.user as any)?.email || booking.guestEmail;
          const clientName = (booking.user as any)?.name || booking.guestName || 'Client';
          const isSpecial = booking.bookingType === 'PACK' || booking.bookingType === 'SUBSCRIPTION';
          const isAcademy = booking.bookingType === 'COURSE';
          const isTournament = booking.bookingType === 'TOURNAMENT';

          let itemName = (booking.court as any)?.name || 'Terrain Padel';
          if (isSpecial) itemName = `${booking.bookingType === 'PACK' ? 'Pack' : 'Abonnement'} : ${booking.packName}`;
          if (isAcademy) itemName = `Académie : ${(booking.course as any)?.title || 'Cours'}`;
          if (isTournament) itemName = `Tournoi : ${(booking.tournament as any)?.name || 'Compétition'}`;

          // Specific Logic for Course/Tournament Registration
          if (isAcademy && booking.course) {
            await Course.findByIdAndUpdate(booking.course, {
              $addToSet: { participants: booking.user },
              $inc: { currentParticipants: 1 }
            });
          }
          if (isTournament && booking.tournament) {
            await Tournament.findByIdAndUpdate(booking.tournament, {
              $addToSet: { participants: booking.user },
              $inc: { currentTeams: 0.5 } // Simple logic: 2 players = 1 team
            });
          }

          const dateStr = new Date(booking.startTime).toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
          const timeStr = new Date(booking.startTime).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          });

          const emailTitle = (isSpecial || isAcademy || isTournament) ? "Confirmation d'Achat" : "Réservation Confirmée";
          
          let emailBody = "";
          if (isSpecial) {
             emailBody = `Félicitations ${clientName} !<br><br>` +
             `Votre paiement pour <strong>${itemName}</strong> a été validé avec succès.<br>` +
             `Nos équipes vont activer vos avantages sur votre compte sous peu.<br><br>` +
             `À très vite sur les pistes !`;
          } else if (isAcademy || isTournament) {
             emailBody = `Félicitations ${clientName} !<br><br>` +
             `Votre inscription à <strong>${itemName}</strong> est confirmée !<br>` +
             `Nous avons bien reçu votre paiement de ${booking.totalPrice}€.<br><br>` +
             `Rendez-vous le <strong>${dateStr}</strong> à <strong>${timeStr}</strong> pour l'événement.<br><br>` +
             `À très vite sur les pistes !`;
          } else {
             emailBody = `Félicitations ${clientName} !<br><br>` +
             `Votre paiement a été validé avec succès. Votre court est réservé :<br><br>` +
             `<strong>Terrain:</strong> ${itemName}<br>` +
             `<strong>Date:</strong> ${dateStr}<br>` +
             `<strong>Heure:</strong> ${timeStr}<br><br>` +
             `À très vite sur les pistes !`;
          }

          await sendEmail({
            to: clientEmail,
            subject: `🎾 ${emailTitle} - ${itemName}`,
            text: `Bonjour ${clientName}, votre ${isSpecial ? 'achat' : 'réservation'} est confirmé pour ${itemName}.`,
            html: getEmailTemplate(emailTitle, emailBody)
          });

          // Notify Admin of successful payment
          const adminEmail = process.env.SMTP_EMAIL || 'admin@padelarena.fr';
          await sendEmail({
            to: adminEmail,
            subject: `💰 PAIEMENT REÇU : ${itemName}`,
            text: `Un paiement de ${booking.totalPrice}€ a été reçu pour ${itemName}.\nClient: ${clientName} (${clientEmail})`,
            html: getEmailTemplate(
              "Nouveau Paiement Stripe",
              `Un nouveau paiement vient d'être validé !<br><br>` +
              `<strong>Produit:</strong> ${itemName}<br>` +
              `<strong>Montant:</strong> ${booking.totalPrice}€<br>` +
              `<strong>Client:</strong> ${clientName} (${clientEmail})<br>` +
              `<strong>Réf:</strong> #${bookingId.toString().slice(-6)}<br><br>` +
              `Retrouvez tous les détails dans votre panel Admin.`
            )
          });

          // Create a Transaction record for the Admin dashboard
          const Transaction = mongoose.model('Transaction');
          await Transaction.create({
            type: 'INCOME',
            amount: booking.totalPrice,
            description: `${isSpecial ? 'Achat' : 'Réservation'} ${itemName} (ID: ${bookingId.toString().slice(-4)})`,
            method: 'STRIPE',
            status: 'COMPLETED',
            customerName: clientName,
            booking: bookingId,
            category: booking.bookingType || 'General'
          });
        }
      } catch (dbErr) {
        console.error('Error in post-payment processing:', dbErr);
      }
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};


/**
 * @desc    Refund a Stripe payment
 * @param   paymentIntentId The ID of the payment to refund
 * @param   amount Optional amount to refund (in cents)
 */
export const refundPayment = async (paymentIntentId: string, amount?: number) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount // If undefined, refunds full amount
    });
    return { success: true, refund };
  } catch (error: any) {
    console.error('Stripe Refund Error:', error);
    return { success: false, error: error.message };
  }
};
