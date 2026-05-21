const Stripe = require('stripe');

const PRICES = {
  mensual: 'price_1TZLjCABbyRlcRQKCOV1IHmB',
  anual:   'price_1TZLjkABbyRlcRQKaBEOHWf8',
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { tipo } = req.body;
  const priceId = PRICES[tipo];
  if (!priceId) return res.status(400).json({ error: 'Invalid plan type' });

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const appUrl = process.env.APP_URL || 'https://daycard-one.vercel.app';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/?pago=exitoso`,
      cancel_url: `${appUrl}/subscribe.html`,
      allow_promotion_codes: true,
    });
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
