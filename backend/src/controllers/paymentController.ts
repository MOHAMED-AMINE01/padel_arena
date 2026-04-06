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
            unit_amount: Math.round(amount * 100),
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

    res.status(200).json({ success: true, url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe Session Error:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la création de la session de paiement.', error: error.message });
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
    const payload = (req as any).rawBody || req.body;
    event = stripe.webhooks.constructEvent(payload, sig as string, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err: any) {
    console.error(`Webhook Signature Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      console.log(`✅ Payment success for booking: ${bookingId}`);

      try {
        const booking = await Booking.findById(bookingId).populate('court user course tournament');

        if (!booking) {
          console.log(`❌ Booking ${bookingId} not found`);
          return res.json({ received: true });
        }

        // ⚠️ Prevent duplicate emails if webhook fires twice
        if (booking.paymentStatus === 'PAID') {
          console.log(`⚠️ Payment already processed for booking: ${bookingId}`);
          return res.json({ received: true });
        }

        booking.paymentStatus = 'PAID';
        booking.status = 'CONFIRMED';
        booking.stripePaymentIntentId = session.payment_intent as string;
        await booking.save();

        const clientEmail = (booking.user as any)?.email || booking.guestEmail;
        const clientName = (booking.user as any)?.name || booking.guestName || 'Client';
        const isSpecial = booking.bookingType === 'PACK' || booking.bookingType === 'SUBSCRIPTION';
        const isAcademy = booking.bookingType === 'COURSE';
        const isTournament = booking.bookingType === 'TOURNAMENT';

        let itemName = (booking.court as any)?.name || 'Terrain Padel';
        if (isSpecial) itemName = `${booking.bookingType === 'PACK' ? 'Pack' : 'Abonnement'} : ${booking.packName}`;
        if (isAcademy) itemName = `Académie : ${(booking.course as any)?.title || 'Cours'}`;
        if (isTournament) itemName = `Tournoi : ${(booking.tournament as any)?.name || 'Compétition'}`;

        // Course / Tournament participant registration
        if (isAcademy && booking.course) {
          await Course.findByIdAndUpdate(booking.course, {
            $addToSet: { participants: booking.user },
            $inc: { currentParticipants: 1 }
          });
        }
        if (isTournament && booking.tournament) {
          await Tournament.findByIdAndUpdate(booking.tournament, {
            $addToSet: { participants: booking.user },
            $inc: { currentTeams: 0.5 }
          });
        }

        // ✅ Timezone-independent: read raw UTC values (frontend sends local time without offset)
        const _d = new Date(booking.startTime);
        const _day = _d.getUTCDate().toString().padStart(2, '0');
        const _month = (_d.getUTCMonth() + 1).toString().padStart(2, '0');
        const _year = _d.getUTCFullYear();
        const _hours = _d.getUTCHours().toString().padStart(2, '0');
        const _minutes = _d.getUTCMinutes().toString().padStart(2, '0');
        const dateStr = `${_day}/${_month}/${_year}`;
        const timeStr = `${_hours}:${_minutes}`;

        const emailTitle = (isSpecial || isAcademy || isTournament) ? "Confirmation d'Achat" : "Réservation Confirmée";

        let emailBody = '';
        if (isSpecial) {
          emailBody = `Félicitations ${clientName} !<br><br>` +
            `Votre achat pour <strong>${itemName}</strong> a été validé avec succès.<br>` +
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
            `Votre court est réservé avec succès :<br><br>` +
            `<strong>Terrain :</strong> ${itemName}<br>` +
            `<strong>Date :</strong> ${dateStr}<br>` +
            `<strong>Heure :</strong> ${timeStr}<br><br>` +
            `À très vite sur les pistes !`;
        }

        const adminEmail = process.env.SMTP_EMAIL || 'admin@padelarena.fr';
        const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD always safe for invoice date

        // 1. Client — Confirmation de réservation
        await sendEmail({
          to: clientEmail,
          subject: `🎾 ${emailTitle} - ${itemName}`,
          text: `Bonjour ${clientName}, votre ${isSpecial ? 'achat' : 'réservation'} est confirmé pour ${itemName}.`,
          html: getEmailTemplate(emailTitle, emailBody)
        });

        // 2. Client — Facture
        await sendEmail({
          to: clientEmail,
          subject: `📄 Facture - Padel Arena - #${bookingId.toString().slice(-6).toUpperCase()}`,
          text: `Bonjour ${clientName}, voici votre facture pour ${itemName}.`,
          html: getEmailTemplate('Votre Facture',
            `Merci pour votre paiement !<br><br>` +
            `<strong>Produit :</strong> ${itemName}<br>` +
            `<strong>Montant :</strong> ${booking.totalPrice}€<br>` +
            `<strong>Date du paiement :</strong> ${todayStr}<br>` +
            `<strong>Mode de paiement :</strong> Carte Bancaire via Stripe<br><br>` +
            `Padel Arena vous remercie pour votre confiance.`
          )
        });

        // 3. Admin — Nouvelle réservation
        await sendEmail({
          to: adminEmail,
          subject: `🏃 NOUVELLE RÉSERVATION : ${itemName}`,
          text: `Nouvelle réservation par ${clientName}.\nTerrain: ${itemName}\nDate: ${dateStr}\nHeure: ${timeStr}`,
          html: getEmailTemplate('Nouvelle Réservation Confirmée',
            `Une nouvelle réservation vient d'être validée !<br><br>` +
            `<strong>Client :</strong> ${clientName} (${clientEmail})<br>` +
            `<strong>Terrain :</strong> ${itemName}<br>` +
            `<strong>Date :</strong> ${dateStr}<br>` +
            `<strong>Heure :</strong> ${timeStr}<br><br>` +
            `Préparez le terrain ⚡`
          )
        });

        // 4. Admin — Paiement reçu (facture)
        await sendEmail({
          to: adminEmail,
          subject: `💰 PAIEMENT REÇU : ${itemName}`,
          text: `Un paiement de ${booking.totalPrice}€ a été reçu.\nClient: ${clientName} (${clientEmail})`,
          html: getEmailTemplate('Nouveau Paiement Stripe',
            `Un nouveau paiement vient d'être validé !<br><br>` +
            `<strong>Produit :</strong> ${itemName}<br>` +
            `<strong>Montant :</strong> ${booking.totalPrice}€<br>` +
            `<strong>Client :</strong> ${clientName} (${clientEmail})<br>` +
            `<strong>Réf :</strong> #${bookingId.toString().slice(-6)}<br><br>` +
            `La facture a été envoyée automatiquement au client.`
          )
        });

        // Transaction for Admin dashboard
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

      } catch (dbErr) {
        console.error('Error in post-payment processing:', dbErr);
      }
    }
  }

  res.json({ received: true });
};

/**
 * @desc    Refund a Stripe payment
 */
export const refundPayment = async (paymentIntentId: string, amount?: number) => {
  try {
    const refund = await stripe.refunds.create({ payment_intent: paymentIntentId, amount });
    return { success: true, refund };
  } catch (error: any) {
    console.error('Stripe Refund Error:', error);
    return { success: false, error: error.message };
  }
};
