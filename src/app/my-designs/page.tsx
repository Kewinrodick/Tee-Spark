
'use client';

import { DesignCard } from '@/components/design-card';
import { type Design } from '@/lib/mock-data';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Paintbrush } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function MyDesignsPage() {
  const [userDesigns, setUserDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setIsLoading(true);
    // Fetch designs from localStorage
    const storedDesigns = JSON.parse(localStorage.getItem('userDesigns') || '[]');
    const allMockDesigns = JSON.parse(localStorage.getItem('allDesigns') || '[]');

    // In a real app, you would fetch designs for the currently logged-in user from your API
    const userEmail = user?.email;
    const mockUserDesigns = allMockDesigns.filter((d: Design) => d.designer.id === userEmail).slice(0,4);
    
    if (user) {
        setUserDesigns([...mockUserDesigns, ...storedDesigns.filter((d:Design) => d.designer.id === user.email)]);
    } else {
        setUserDesigns([]);
    }
    
    setIsLoading(false);
  }, [user]);

  return (
    <div className="container py-8 md:py-12">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">My Designs</h1>
        <p className="text-muted-foreground">
          Here are the masterpieces you've shared with the world.
        </p>
      </div>
      {isLoading ? (
        <p>Loading your designs...</p>
      ) : userDesigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {userDesigns.map((design) => (
            <DesignCard key={design.id} design={design} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center">
            <Paintbrush className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">No designs yet!</h2>
          <p className="text-muted-foreground mt-2">{user ? "Looks like you haven't uploaded any designs. Start creating!" : "Log in to see your designs."}</p>
          {user && (
            <Button asChild className="mt-6">
              <Link href="/upload">Upload Your First Design</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
