import { DesignCard } from '@/components/design-card';
import { getDesigns } from '@/lib/mock-data';

export default async function MyDesignsPage() {
  // In a real app, you would fetch designs for the currently logged-in user.
  const allDesigns = await getDesigns();
  const userDesigns = allDesigns.slice(0, 4); // Mock: show first 4 designs as "user's"

  return (
    <div className="container py-8 md:py-12">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">My Designs</h1>
        <p className="text-muted-foreground">
          Here are the masterpieces you've shared with the world.
        </p>
      </div>
      {userDesigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {userDesigns.map((design) => (
            <DesignCard key={design.id} design={design} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-muted rounded-lg">
          <h2 className="text-xl font-semibold">No designs yet!</h2>
          <p className="text-muted-foreground mt-2">Looks like you haven't uploaded any designs. Start creating!</p>
        </div>
      )}
    </div>
  );
}
