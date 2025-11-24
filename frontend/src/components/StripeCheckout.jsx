import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { paymentAPI } from '@/lib/api';

// This will be loaded from backend
let stripePromise = null;

const CheckoutForm = ({ amount, onSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setErrorMessage('');

        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/order-confirmation`,
                },
                redirect: 'if_required'
            });

            if (error) {
                setErrorMessage(error.message);
                onError?.(error);
            } else {
                onSuccess?.();
            }
        } catch (err) {
            setErrorMessage('Payment failed. Please try again.');
            onError?.(err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />

            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {errorMessage}
                </div>
            )}

            <Button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white"
            >
                {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
            </Button>
        </form>
    );
};

const StripeCheckout = ({ amount, metadata, onSuccess, onError }) => {
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const initializeStripe = async () => {
            try {
                // Get Stripe publishable key from backend
                const { data } = await paymentAPI.getConfig();

                if (!data.publishableKey) {
                    throw new Error('Stripe is not configured');
                }

                // Initialize Stripe
                stripePromise = loadStripe(data.publishableKey);

                // Create payment intent
                const intentResponse = await paymentAPI.createIntent(amount, metadata);
                setClientSecret(intentResponse.data.clientSecret);
            } catch (err) {
                console.error('Stripe initialization error:', err);
                setError(err.message || 'Failed to initialize payment');
            } finally {
                setLoading(false);
            }
        };

        initializeStripe();
    }, [amount, metadata]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A1F44]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                <p className="font-semibold">Payment Error</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    if (!clientSecret || !stripePromise) {
        return null;
    }

    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#0A1F44',
                colorBackground: '#ffffff',
                colorText: '#0A1F44',
                colorDanger: '#df1b41',
                fontFamily: 'system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '8px'
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-[#0A1F44] mb-6">Payment Information</h3>
            <Elements stripe={stripePromise} options={options}>
                <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
            </Elements>
        </div>
    );
};

export default StripeCheckout;
