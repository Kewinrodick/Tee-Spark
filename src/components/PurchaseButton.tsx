// Example in a component like "PurchaseButton.tsx"
import { useAuth } from '@/context/auth-context';

declare global {
    interface Window {
        Razorpay: any;
    }
}

const PurchaseButton = ({ design }) => {
  const { user } = useAuth(); // Get the logged-in user

  const handlePurchase = async () => {
    try {
      // Step 1: Create an order on your backend
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: design.price }),
      });
      const orderData = await orderRes.json();

      // Step 2: Configure and open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use a public key for the frontend
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'TeeSpark',
        description: `Purchase of ${design.name}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          // Step 3: Send verification data to your backend
          const verifyRes = await fetch('/api/payment/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              buyerId: user._id, // Pass user and design info
              designId: design._id,
              amount: orderData.amount / 100,
              currency: orderData.currency,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.status === 'success') {
            alert('Payment successful!');
            // Redirect to a success page or downloads page
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Purchase failed', error);
      alert('An error occurred. Please try again.');
    }
  };

  return <button onClick={handlePurchase}>Purchase for ${design.price}</button>;
};

export default PurchaseButton;
