require('dotenv').config({path: './.env'});
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
async function checkEvents() {
  try {
    const events = await stripe.events.list({
      type: 'checkout.session.completed',
      limit: 3,
    });
    console.log(`Found ${events.data.length} recent events\n`);
    events.data.forEach(e => {
      console.log('Event Date:', new Date(e.created * 1000).toLocaleString());
      if (e.data.object.metadata) {
          console.log('Booking Type:', e.data.object.metadata.type);
          console.log('Booking ID:', e.data.object.metadata.bookingId);
      } else {
          console.log('Metadata is completely missing/empty!');
      }
      console.log('Session ID:', e.data.object.id);
      console.log('---\n');
    });
  } catch(e) {
    console.error(e);
  }
}
checkEvents();
