const express = require('express')
const router = express.Router()
const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

// Create a Stripe checkout session for an invoice
router.post('/create-checkout-session', async (req, res) => {
  const { invoiceId, amount, invoiceNumber, successUrl, cancelUrl } = req.body

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Invoice ${invoiceNumber}`,
            },
            unit_amount: Math.round(amount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&invoice_id=${invoiceId}`,
      cancel_url: cancelUrl,
      metadata: { invoiceId },
    })

    res.json({ url: session.url })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router