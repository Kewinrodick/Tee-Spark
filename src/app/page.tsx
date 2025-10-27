import { DesignCard } from '@/components/design-card';
import { getDesigns } from '@/lib/mock-data';
import { Hero } from '@/components/layout/hero';
import { Faq } from '@/components/layout/faq';
import { Footer } from '@/components/layout/footer';

export default async function Home() {
  const designs = await getDesigns();

  return (
    <>
      <Hero />
      <div className="container py-8 md:py-12" id="trending-designs">
        <h2 className="text-3xl font-bold tracking-tighter md:text-5xl mb-8 font-headline text-center">Trending Designs</h2>
        {designs && designs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {designs.map((design) => (
              <DesignCard key={design.id} design={design} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-muted rounded-lg">
            <h2 className="text-xl font-semibold">Could not load designs</h2>
            <p className="text-muted-foreground mt-2">
              Please make sure your backend server is running and accessible.
            </p>
          </div>
        )}
      </div>
      <Faq />
      <Footer />
    </>
  );
}
