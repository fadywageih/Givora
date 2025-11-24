import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Truck, CreditCard, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { paymentAPI, ordersAPI } from '@/lib/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ total, shippingMethod, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, user, getDiscountRate, clearCart } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
    address: user?.address || '',
    city: '',
    state: '',
    zip: ''
  });

  const handleInputChange = (e) => {
    setBillingDetails({ ...billingDetails, [e.target.name]: e.target.value });
  };

  const isWholesale = user?.accountType === 'wholesale' && user?.approved;
  const volumeDiscount = getDiscountRate();

  const calculateItemPrice = (item) => {
    const product = item.product;
    let price = isWholesale ? product.wholesalePrice : product.retailPrice;
    if (isWholesale && volumeDiscount > 0) price = price * (1 - volumeDiscount);
    return price;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast({
        title: "Payment System Loading",
        description: "Please wait for the payment system to load.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Create payment intent
      const clientSecret = await paymentAPI.createIntent(
        Math.round(total * 100), // Convert to cents
        {
          userId: user.id,
          shippingMethod
        }
      );
      console.log(clientSecret.data.clientSecret);
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret.data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: billingDetails.name,
            address: {
              line1: billingDetails.address,
              city: billingDetails.city,
              state: billingDetails.state,
              postal_code: billingDetails.zip
            }
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Create order in database
        const subtotal = cart.reduce((sum, item) => sum + (calculateItemPrice(item) * item.quantity), 0);
        const shippingCost = shippingMethod === 'express' ? 10.00 : 7.00;
        const taxRate = 0.08;
        const taxAmount = subtotal * taxRate;

        await ordersAPI.create({
          shippingMethod,
          paymentMethod: 'stripe',
          stripePaymentId: paymentIntent.id,
          items: cart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: calculateItemPrice(item)
          }))
        });

        // Clear cart
        await clearCart();

        toast({
          title: "Payment Successful",
          description: "Your order has been placed successfully."
        });

        onSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
        <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
          <Lock className="w-3 h-3" /> Secure Stripe Transaction
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Card Details</label>
            <div className="p-3 border rounded bg-white min-h-[40px] flex items-center">
              {!stripe ? (
                <p className="text-sm text-gray-400">Loading payment form...</p>
              ) : (
                <div className="w-full">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                        invalid: {
                          color: '#9e2146',
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <h3 className="font-bold text-[#0A1F44] mb-2">Billing Address</h3>
      <div className="space-y-3">
        <input
          type="text"
          name="name"
          value={billingDetails.name}
          onChange={handleInputChange}
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="address"
          value={billingDetails.address}
          onChange={handleInputChange}
          placeholder="Address Line 1"
          className="w-full p-2 border rounded"
          required
        />
        <div className="grid grid-cols-3 gap-3">
          <input
            type="text"
            name="city"
            value={billingDetails.city}
            onChange={handleInputChange}
            placeholder="City"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="state"
            value={billingDetails.state}
            onChange={handleInputChange}
            placeholder="State"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="zip"
            value={billingDetails.zip}
            onChange={handleInputChange}
            placeholder="ZIP"
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div className="mt-6 space-y-2 pt-4 border-t">
        <div className="flex justify-between font-bold text-lg">
          <span>Total to Pay</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#0A1F44] text-white hover:bg-[#C9A227] transition-all duration-300"
        disabled={!stripe || loading}
      >
        {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </Button>
    </form>
  );
};

const Checkout = () => {
  const { cart, user, getDiscountRate } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('standard');

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const isWholesale = user?.accountType === 'wholesale' && user?.approved;
  const volumeDiscount = getDiscountRate();

  const calculateItemPrice = (item) => {
    const product = item.product;
    let price = isWholesale ? product.wholesalePrice : product.retailPrice;
    if (isWholesale && volumeDiscount > 0) price = price * (1 - volumeDiscount);
    return price;
  };

  const subtotal = cart.reduce((sum, item) => sum + (calculateItemPrice(item) * item.quantity), 0);
  const shippingCost = shippingMethod === 'express' ? 10.00 : 7.00;
  const taxRate = 0.08;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + shippingCost + taxAmount;

  const getDeliveryDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const renderShippingStep = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <h2 className="text-xl font-bold text-[#0A1F44] mb-4 flex items-center gap-2">
        <Truck className="w-5 h-5" /> Shipping Method
      </h2>
      <div className="space-y-4 mb-8">
        <div
          onClick={() => setShippingMethod('standard')}
          className={`p-4 border rounded-lg cursor-pointer transition-colors flex justify-between items-center ${shippingMethod === 'standard' ? 'border-[#0A1F44] bg-blue-50' : 'border-gray-200'}`}
        >
          <div>
            <p className="font-bold text-[#0A1F44]">Standard Delivery (4 Days)</p>
            <p className="text-sm text-gray-600">Estimated: {getDeliveryDate(4)}</p>
          </div>
          <span className="font-bold text-[#0A1F44]">$7.00</span>
        </div>
        <div
          onClick={() => setShippingMethod('express')}
          className={`p-4 border rounded-lg cursor-pointer transition-colors flex justify-between items-center ${shippingMethod === 'express' ? 'border-[#0A1F44] bg-blue-50' : 'border-gray-200'}`}
        >
          <div>
            <p className="font-bold text-[#0A1F44]">Express Delivery (2 Days)</p>
            <p className="text-sm text-gray-600">Estimated: {getDeliveryDate(2)}</p>
          </div>
          <span className="font-bold text-[#0A1F44]">$10.00</span>
        </div>
      </div>
      <Button
        onClick={() => setStep(2)}
        className="w-full bg-[#0A1F44] text-white hover:bg-[#C9A227] transition-all duration-300"
      >
        Continue to Payment
      </Button>
    </motion.div>
  );

  const renderPaymentStep = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <h2 className="text-xl font-bold text-[#0A1F44] mb-4 flex items-center gap-2">
        <CreditCard className="w-5 h-5" /> Payment Details
      </h2>

      <Elements stripe={stripePromise}>
        <CheckoutForm
          total={total}
          shippingMethod={shippingMethod}
          onSuccess={() => setStep(3)}
        />
      </Elements>

      <Button
        type="button"
        variant="outline"
        onClick={() => setStep(1)}
        className="w-full mt-4"
      >
        Back to Shipping
      </Button>
    </motion.div>
  );

  const renderSuccessStep = () => (
    <div className="text-center py-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle className="w-10 h-10" />
      </motion.div>
      <h2 className="text-3xl font-bold text-[#0A1F44] mb-2">Order Confirmed!</h2>
      <p className="text-gray-600 mb-8">Thank you for your purchase. Your order has been received.</p>
      <div className="flex justify-center gap-4">
        <Button onClick={() => navigate('/profile')} variant="outline">View Order History</Button>
        <Button onClick={() => navigate('/shop')} className="bg-[#0A1F44] text-white">Continue Shopping</Button>
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>Checkout - GIVORA</title></Helmet>

      <div className="bg-[#0A1F44] text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {step === 3 ? renderSuccessStep() : (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {step === 1 && renderShippingStep()}
              {step === 2 && renderPaymentStep()}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                <h3 className="font-bold text-[#0A1F44] mb-4 text-lg">Order Summary</h3>
                <div className="space-y-3 text-sm mb-4 max-h-60 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <img src={item.product.imageUrl} alt="" className="w-8 h-8 object-cover rounded" />
                        <span>{item.quantity}x {item.product.name}</span>
                      </div>
                      <span className="font-medium">${(calculateItemPrice(item) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>${shippingCost.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Tax (8%)</span><span>${taxAmount.toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold text-lg text-[#0A1F44] border-t pt-2 mt-2">
                    <span>Total</span><span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Checkout;