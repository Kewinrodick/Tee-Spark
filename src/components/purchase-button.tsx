
'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Design } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';
import { useState, type ComponentProps, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type User = {
  name: string;
  email: string;
}

export function PurchaseButton({ design, className, children, ...props }: { design: Design, children: React.ReactNode } & ComponentProps<'button'>) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handlePurchase = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to purchase a design.",
      });
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
      // In a real app, you would call your backend to create a purchase record
      // and trigger the PDF generation and email.

      // For the prototype, we save the purchase to localStorage
      const existingPurchases = JSON.parse(localStorage.getItem('userPurchases') || '[]');
      if (!existingPurchases.includes(design.id)) {
        localStorage.setItem('userPurchases', JSON.stringify([...existingPurchases, design.id]));
      }

      toast({
        title: 'Purchase Successful!',
        description: `Proof of purchase for "${design.title}" will be sent to your email.`,
      });
      
      // Redirect to success page
      router.push('/purchase-success');

    } catch (error) {
      console.error('Failed to process purchase:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was a problem processing your purchase.',
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
      {isPurchasing && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
      {isPurchasing ? 'Processing...' : children}
    </Button>
  );
}
