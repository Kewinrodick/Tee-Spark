'use client';

import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import type { Design } from '@/lib/mock-data';
import { generateAndEmailProof } from '@/lib/proof';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function PurchaseButton({ design, className, ...props }: { design: Design } & ComponentProps<'button'>) {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setIsPurchasing(true);
    toast({
      title: 'Processing Purchase...',
      description: 'Please wait while we process your transaction.',
    });

    // Mock Stripe payment
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const transactionId = `txn_${Date.now()}`;
      // Generate and email proof
      await generateAndEmailProof(design, user, transactionId);

      toast({
        title: 'Purchase Successful!',
        description: `Proof of purchase for "${design.title}" has been sent to your email.`,
      });
      
      // Redirect to success page
      router.push('/purchase-success');

    } catch (error) {
      console.error('Failed to generate or email proof:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was a problem generating your proof of purchase.',
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <Button
      size="lg"
      className={cn("w-full text-base py-3", className)}
      onClick={handlePurchase}
      disabled={isPurchasing}
      {...props}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      {isPurchasing ? 'Processing...' : `Purchase - $${design.price}`}
    </Button>
  );
}
