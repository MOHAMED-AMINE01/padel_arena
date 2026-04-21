import { Request, Response } from 'express';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from '../models/Booking';
import User from '../models/User';
import Subscription from '../models/Subscription';
import Course from '../models/Course';
import Tournament from '../models/Tournament';
import Transaction from '../models/Transaction';
import Pricing from '../models/Pricing';
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
 * @desc    Create a Stripe Checkout Session for Wallet recharge
 * @route   POST /api/payments/create-wallet-session
 */
export const createWalletCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { planId, successUrl, cancelUrl } = req.body;
    const userId = (req as any).user?._id;

    if (!planId || !userId) {
      return res.status(400).json({ success: false, message: 'Plan ou utilisateur manquant.' });
    }

    // Récupérer les détails du pack en DB
    const pricing = await Pricing.findById(planId);
    if (!pricing) {
        return res.status(404).json({ success: false, message: 'Pack introuvable.' });
    }

    const price = parseFloat(pricing.price || '0');
    // Le montant à créditer est Valeur de Base + Bonus
    // Si creditAmount n'est pas défini, on prend le prix comme base
    const baseCredit = pricing.creditAmount || price;
    const bonus = pricing.bonusAmount || 0;
    const totalCredit = baseCredit + bonus;

    if (price <= 0) {
        return res.status(400).json({ success: false, message: 'Prix invalide.' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Rechargement Portefeuille - ${pricing.title}`,
              description: `Crédit total de ${totalCredit}€ (dont ${bonus}€ offerts)`,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${process.env.CLIENT_URL}/wallet?success=true`,
      cancel_url: cancelUrl || `${process.env.CLIENT_URL}/wallet`,
      metadata: {
        userId: userId.toString(),
        rechargeAmount: totalCredit.toString(), // Important: C'est ce montant qui sera ajouté au solde
        type: 'WALLET_RECHARGE'
      },
    });

    res.status(200).json({ success: true, url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe Wallet Session Error:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la création de la session de rechargement.' });
  }
};

/**
 * @desc    Stripe Webhook handler
 * @route   POST /api/payments/webhook
 */
export const handleWebhook = async (req: Request, res: Response) => {
  console.log('📡 [WEBHOOK] Appel reçu sur /api/payments/webhook');
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const payload = (req as any).rawBody || req.body;
    event = stripe.webhooks.constructEvent(payload, sig as string, process.env.STRIPE_WEBHOOK_SECRET as string);
    console.log('⚡ EVENT REÇU DE STRIPE:', event.type);
  } catch (err: any) {
    console.error(`⚠️ Webhook Signature Warning: ${err.message}`);
    // En mode développement, si la signature échoue, on essaye quand même de lire le body
    if (process.env.NODE_ENV !== 'production') {
        console.log('🧪 MODE TEST: Traitement du body sans signature...');
        event = req.body;
    } else {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  // Support pour Stripe Event ou Body direct (Test Mode)
  const eventType = event.type || (event as any).type;
  const session = (event.data?.object || event) as Stripe.Checkout.Session;

  if (eventType === 'checkout.session.completed') {
    const metadata = session.metadata || {};
    const bookingId = metadata.bookingId;
    const type = metadata.type;
    const userId = metadata.userId;
    const rechargeAmount = metadata.rechargeAmount;
    
    console.log('--- NOUVEL EVENT STRIPE RECU ---');
    console.log('📦 METADATA:', metadata);
    console.log('🔑 SESSION_ID:', session.id);
    console.log('🏷️ TYPE:', type, '| 👤 USER:', userId, '| 💵 MONTANT:', rechargeAmount);

    // 1. COURT / SPECIAL RESERVATION (Standard Flow)
    if (bookingId) {
      console.log(`✅ Tentative de validation pour réservation: ${bookingId}`);
      try {
        const booking = await Booking.findById(bookingId).populate('court user course tournament');

        if (booking && booking.paymentStatus !== 'PAID') {
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

          // Subscription Activation
          if (booking.bookingType === 'SUBSCRIPTION' && booking.subscription && booking.user) {
            const plan = await Subscription.findById(booking.subscription);
            const currentUser = await User.findById(booking.user);
            if (plan && currentUser) {
                let newExpiryDate = new Date();
                if (currentUser.subscriptionExpiresAt && currentUser.subscriptionExpiresAt > newExpiryDate) {
                  newExpiryDate = new Date(currentUser.subscriptionExpiresAt);
                }
                newExpiryDate.setMonth(newExpiryDate.getMonth() + plan.durationInMonths);
                await User.findByIdAndUpdate(booking.user, {
                  subscription: booking.subscription,
                  subscriptionExpiresAt: newExpiryDate
                });
            }
          }

          // Course / Tournament setup
          if (isAcademy && booking.course) {
            await Course.findByIdAndUpdate(booking.course, { $addToSet: { participants: booking.user }, $inc: { currentParticipants: 1 } });
          }
          if (isTournament && booking.tournament) {
            await Tournament.findByIdAndUpdate(booking.tournament, { $addToSet: { participants: booking.user }, $inc: { currentTeams: 0.5 } });
          }

          // Date formatting for emails
          const bookingDateObj = new Date(booking.startTime);
          let dateStr = booking.dateStr || `${bookingDateObj.getUTCDate()}/${bookingDateObj.getUTCMonth() + 1}/${bookingDateObj.getUTCFullYear()}`;
          let timeStr = booking.timeStr || `${bookingDateObj.getUTCHours()}:${bookingDateObj.getUTCMinutes().toString().padStart(2, '0')}`;

          const emailTitle = (isSpecial || isAcademy || isTournament) ? "Confirmation d'Achat" : "Réservation Confirmée";
          let emailBody = isSpecial ? `Votre achat pour **${itemName}** est validé.` : `Votre réservation pour **${itemName}** le ${dateStr} à ${timeStr} est confirmée.`;

          await sendEmail({
            to: clientEmail,
            subject: `🎾 ${emailTitle} - ${itemName}`,
            text: emailBody,
            html: getEmailTemplate(emailTitle, emailBody)
          });

          // Sync Transaction
          await Transaction.create({
            type: 'INCOME',
            amount: booking.totalPrice,
            description: `${isSpecial ? 'Achat' : 'Réservation'} ${itemName}`,
            method: 'STRIPE',
            status: 'COMPLETED',
            customerName: clientName,
            booking: bookingId,
            category: booking.bookingType || 'General'
          });
        }
      } catch (err) {
        console.error('Error processing booking payment:', err);
      }
    }

    // 2. WALLET RECHARGE (Flexible detection)
    if (type === 'WALLET_RECHARGE' || (userId && rechargeAmount && !bookingId)) {
      console.log('💰 TRAITEMENT RECHARGE PORTFOLIO (Détection flexible)');
      console.log('👤 USER ID:', userId);
      console.log('💵 MONTANT:', rechargeAmount);

      if (userId && rechargeAmount) {
        try {
          const user = await User.findById(userId);
          if (user) {
            const amountValue = parseFloat(rechargeAmount);
            user.balance = (user.balance || 0) + amountValue;
            await user.save();
            console.log(`✅ SOLDE MIS À JOUR : ${user.balance}€`);

            // Create Transaction
            await Transaction.create({
              type: 'INCOME',
              amount: amountValue,
              description: `Rechargement Portefeuille (Pack ${amountValue}€)`,
              method: 'STRIPE',
              status: 'COMPLETED',
              customerName: user.name,
              managedBy: user._id,
              category: 'Wallet'
            });

            // Send confirmation email
            await sendEmail({
              to: user.email,
              subject: `💰 Rechargement Portefeuille Validé - Padel Arena`,
              text: `Bonjour ${user.name}, votre portefeuille a été rechargé de ${amountValue}€. Votre nouveau solde est de ${user.balance}€.`,
              html: getEmailTemplate('Portefeuille Rechargé', 
                `Votre rechargement de **${amountValue}€** a été validé avec succès.<br><br>` +
                `Nouveau solde : **${user.balance}€**<br><br>` +
                `Bon match à l'Arène !`
              )
            });
          }
        } catch (err) {
          console.error('Error processing wallet recharge:', err);
        }
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
