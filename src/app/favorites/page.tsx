
'use client';

import { DesignCard } from '@/components/design-card';
import { getDesigns, type Design } from '@/lib/mock-data';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';

export default function FavoritesPage() {
  const [userFavorites, setUserFavorites] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      if (!user) {
        setUserFavorites([]);
        setIsLoading(false);
        return;
      }
      
      const favoriteIds = JSON.parse(localStorage.getItem('userFavorites') || '[]');
      if (favoriteIds.length === 0) {
        setUserFavorites([]);
        setIsLoading(false);
        return;
      }
      
      const allDesigns = await getDesigns();
      const storedDesigns = JSON.parse(localStorage.getItem('userDesigns') || '[]');
      const combinedDesigns = [...allDesigns, ...storedDesigns];
      
      const favoriteDesigns = combinedDesigns.filter(design => favoriteIds.includes(design.id));
      setUserFavorites(favoriteDesigns);
      setIsLoading(false);
    };

    fetchFavorites();
  }, [user]);

  return (
    <div className="container py-8 md:py-12">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">My Favorites</h1>
        <p className="text-muted-foreground">
          The designs you love, all in one place.
        </p>
      </div>
      {isLoading ? (
         <p>Loading your favorites...</p>
      ) : userFavorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {userFavorites.map((design) => (
            <DesignCard key={design.id} design={design} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center">
          <Heart className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">{user ? "No favorites yet!" : "Please log in"}</h2>
          <p className="text-muted-foreground mt-2">
            {user ? "Click the heart on a design to save it to your favorites." : "Log in to see your favorite designs."}
          </p>
        </div>
      )}
    </div>
  );
}
