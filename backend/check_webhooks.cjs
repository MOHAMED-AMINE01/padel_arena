require('dotenv').config({path: './.env'});
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
async function checkDeliveries() {
  try {
    const events = await stripe.events.list({
      type: 'checkout.session.completed',
      limit: 1,
    });
    const latestEvent = events.data[0];
    console.log(`Latest event ID: ${latestEvent.id}`);
    const deliveries = await stripe.webhookEndpoints.list();
    console.log(`Configured webhooks: ${deliveries.data.length}`);
    deliveries.data.forEach(h => console.log(h.url, 'status:', h.status));
    
    // Attempting to retrieve delivery attempts is not directly exposed as .list() on events in Node API easily,
    // so let's just see the current webhooks
  } catch(e) {
    console.error(e);
  }
}
checkDeliveries();
