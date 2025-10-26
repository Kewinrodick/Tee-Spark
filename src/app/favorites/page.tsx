
import { DesignCard } from '@/components/design-card';
import { getDesigns } from '@/lib/mock-data';
import { Heart } from 'lucide-react';

export default async function FavoritesPage() {
  // In a real app, you would fetch designs for the currently logged-in user.
  const allDesigns = await getDesigns();
  const userFavorites: any[] = []; // Mock: no favorites yet

  return (
    <div className="container py-8 md:py-12">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">My Favorites</h1>
        <p className="text-muted-foreground">
          The designs you love, all in one place.
        </p>
      </div>
      {userFavorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {userFavorites.map((design) => (
            <DesignCard key={design.id} design={design} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center">
          <Heart className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">No favorites yet!</h2>
          <p className="text-muted-foreground mt-2">Click the heart on a design to save it to your favorites.</p>
        </div>
      )}
    </div>
  );
}
