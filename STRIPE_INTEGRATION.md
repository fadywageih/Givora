# Stripe Payment Integration Guide

## Overview
Stripe payment has been integrated into the Givora checkout process, providing secure credit card processing.

## Backend Setup

### 1. Get Stripe API Keys

1. Sign up at [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Get your API keys from [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

### 2. Configure Environment Variables

Add to `backend/.env`:

```env
# Stripe Payment Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 3. Restart Backend Server

```bash
cd backend
# The server will automatically reload if using npm run dev
# Or restart manually:
npm run dev
```

## Frontend Setup

### 1. Stripe Packages Installed

The following packages have been installed:
- `@stripe/stripe-js` - Stripe.js loader
- `@stripe/react-stripe-js` - React components for Stripe

### 2. Components Created

**StripeCheckout Component** (`frontend/src/components/StripeCheckout.jsx`)
- Handles payment intent creation
- Renders Stripe Payment Element
- Processes payments securely
- Handles errors and loading states

## How It Works

### Payment Flow

1. **User goes to checkout**
   - Cart items are displayed
   - Shipping method selected
   - Total calculated

2. **Payment step**
   - Frontend requests Stripe publishable key from backend
   - Frontend creates payment intent with total amount
   - Backend creates Stripe PaymentIntent and returns client secret
   - Stripe Payment Element is rendered

3. **User enters card details**
   - Card information entered directly into Stripe's secure form
   - Card details never touch your servers (PCI compliant)

4. **Payment processing**
   - User clicks "Pay"
   - Stripe processes the payment
   - Payment confirmed or error shown

5. **Order creation**
   - On successful payment, order is created in database
   - Cart is cleared
   - User sees confirmation

### API Endpoints

**GET `/api/payment/config`**
- Returns Stripe publishable key
- Public endpoint

**POST `/api/payment/create-intent`**
- Creates Stripe PaymentIntent
- Requires authentication
- Body: `{ amount, metadata }`
- Returns: `{ clientSecret, paymentIntentId }`

**POST `/api/payment/confirm`**
- Confirms payment status
- Requires authentication
- Body: `{ paymentIntentId }`

**POST `/api/payment/webhook`**
- Handles Stripe webhooks
- Verifies webhook signature
- Updates order status based on payment events

## Testing

### Test Card Numbers

Use these test cards in development:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)

**Declined Payment:**
- Card: `4000 0000 0000 0002`
- Expiry: Any future date
- CVC: Any 3 digits

**Requires Authentication (3D Secure):**
- Card: `4000 0025 0000 3155`
- Expiry: Any future date
- CVC: Any 3 digits

More test cards: [https://stripe.com/docs/testing](https://stripe.com/docs/testing)

## Security Features

1. **PCI Compliance**
   - Card details handled entirely by Stripe
   - Never stored on your servers
   - Stripe Elements are PCI-DSS compliant

2. **Payment Intent API**
   - Prevents duplicate charges
   - Handles authentication (3D Secure)
   - Automatic retry logic

3. **Webhook Verification**
   - Signature verification for webhooks
   - Prevents unauthorized requests

## Customization

### Styling

The Stripe Payment Element is styled to match your brand:

```javascript
appearance: {
  theme: 'stripe',
  variables: {
    colorPrimary: '#0A1F44',  // Your brand color
    colorBackground: '#ffffff',
    colorText: '#0A1F44',
    colorDanger: '#df1b41',
    fontFamily: 'system-ui, sans-serif',
    spacingUnit: '4px',
    borderRadius: '8px'
  }
}
```

Modify in `frontend/src/components/StripeCheckout.jsx`

### Metadata

Add custom metadata to payments:

```javascript
const metadata = {
  orderId: 'order_123',
  customerEmail: user.email,
  // Add any custom fields
};

await paymentAPI.createIntent(amount, metadata);
```

## Webhooks Setup (Production)

### 1. Create Webhook Endpoint

In Stripe Dashboard:
1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/payment/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

### 2. Get Webhook Secret

Copy the webhook signing secret and add to `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Test Webhooks

Use Stripe CLI for local testing:

```bash
stripe listen --forward-to localhost:5000/api/payment/webhook
```

## Production Checklist

- [ ] Switch to live API keys (pk_live_... and sk_live_...)
- [ ] Set up webhook endpoint
- [ ] Add webhook secret to production .env
- [ ] Test with real card (small amount)
- [ ] Enable 3D Secure authentication
- [ ] Set up email notifications for payments
- [ ] Monitor Stripe Dashboard for transactions

## Troubleshooting

### "Stripe is not configured"
- Check that STRIPE_SECRET_KEY is set in backend/.env
- Restart backend server

### Payment fails immediately
- Check Stripe Dashboard for error details
- Verify API keys are correct
- Check card number is valid test card

### Webhook not receiving events
- Verify webhook URL is publicly accessible
- Check webhook secret matches
- Use Stripe CLI to test locally

## Support

- Stripe Documentation: [https://stripe.com/docs](https://stripe.com/docs)
- Stripe Support: [https://support.stripe.com](https://support.stripe.com)
- Test your integration: [https://stripe.com/docs/testing](https://stripe.com/docs/testing)
