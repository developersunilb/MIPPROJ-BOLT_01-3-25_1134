"use client";

import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useRouter } from 'next/navigation';
import { useProtectedRoute } from '../../hooks/use-protected-route';
import { Check, CreditCard, Calendar } from 'lucide-react';
import { Stripe, loadStripe } from '@stripe/stripe-js'; // Ensure Stripe is installed
import { useEffect } from 'react';
import toast from 'react-hot-toast'; // Import react-hot-toast

/**
 * PaymentPage component
 *
 * This component renders the payment page for the Pro Plan.
 */
export default function PaymentPage() {
  useProtectedRoute(); // Protect this route

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay'>('stripe'); // Default to Stripe

  const stripePromise = loadStripe('your-publishable-key-here'); // Load Stripe

  // Handle Stripe payment
  const handleStripePayment = async () => {
    setLoading(true);

    const stripe = await stripePromise; // Get Stripe instance
    if (!stripe) {
      toast.error('Stripe failed to initialize.');
      setLoading(false);
      return;
    }

    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: 'price_id_here', quantity: 1 }], // Replace with your price ID
      mode: 'payment',
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/cancel`,
    });

    if (error) {
      toast.error(error.message || 'An unknown error occurred');
    } else {
      router.push('/experts');
    }

    setLoading(false);
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    setLoading(true);

    const options = {
      key: 'your-razorpay-key-id', // Replace with your Razorpay Key ID
      amount: 9790 * 100, // Amount in paise (e.g., 9790 INR = 9790 * 100 paise)
      currency: 'INR',
      name: 'Your Company Name',
      description: 'Pro Plan Purchase',
      image: 'https://your-logo-url.com/logo.png', // Your company logo
      order_id: 'order_id_here', // Replace with your order ID (generated from your backend)
      handler: function (response: any) {
        toast.success('Payment successful!');
        router.push('/success');
      },
      prefill: {
        name: paymentInfo.cardName,
        email: 'user@example.com', // Replace with user's email
        contact: '9999999999', // Replace with user's phone number
      },
      notes: {
        address: 'User Address', // Replace with user's address
      },
      theme: {
        color: '#F37254', // Customize the payment modal theme
      },
    };

    // Load Razorpay script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    };
    document.body.appendChild(script);

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'stripe') {
      await handleStripePayment();
    } else if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Complete Your Purchase</h1>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Order Summary */}
          <Card className="p-6 md:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Pro Plan</span>
                <span className="font-medium">$89.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">$8.90</span>
              </div>
              <div className="border-t pt-4 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold">$97.90</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="font-medium">What is included:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">60-minute mock interview&apos;</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">Detailed feedback report&apos;</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">Interview recording&apos;</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">Written evaluation&apos;</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">Follow-up Q&A&apos;</span>
                </li>
              </ul>
            </div>
          </Card>

          {/* Payment Form */}
          <Card className="p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant={paymentMethod === 'stripe' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('stripe')}
                  >
                    Stripe (International)
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === 'razorpay' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('razorpay')}
                  >
                    Razorpay (India)
                  </Button>
                </div>
              </div>

              {/* Card Details (Only for Stripe) */}
              {paymentMethod === 'stripe' && (
                <>
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        className="pl-10"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card
                    </label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={paymentInfo.cardName}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          className="pl-10"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Processing...' : 'Pay $97.90'}
              </Button>

              <p className="text-xs text-center text-gray-500 mt-4">
                Your payment information is encrypted and secure. We do not store your credit card details.
              </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
