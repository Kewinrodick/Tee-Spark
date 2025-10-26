'use client';

import { DesignCard } from '@/components/design-card';
import { getDesigns, type Design } from '@/lib/mock-data';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MyPurchasesPage() {
  const [userPurchases, setUserPurchases] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      setIsLoading(true);
      // In a real app, you'd fetch this from a secure backend.
      // For this prototype, we use localStorage.
      const purchasedIds = JSON.parse(localStorage.getItem('userPurchases') || '[]');
      const allDesigns = await getDesigns();
      const purchasedDesigns = allDesigns.filter(design => purchasedIds.includes(design.id));
      setUserPurchases(purchasedDesigns);
      setIsLoading(false);
    };

    fetchPurchases();
  }, []);

  return (
    <div className="container py-8 md:py-12">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">My Purchases</h1>
        <p className="text-muted-foreground">
          Designs you've purchased. Thank you for supporting the creators!
        </p>
      </div>
      {isLoading ? (
        <p>Loading your purchases...</p>
      ) : userPurchases.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {userPurchases.map((design) => (
            <DesignCard key={design.id} design={design} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">No purchases yet!</h2>
          <p className="text-muted-foreground mt-2">Your purchased designs will appear here once you've made a purchase.</p>
        </div>
      )}
    </div>
  );
}
