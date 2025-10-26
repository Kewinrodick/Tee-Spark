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
      <div className="container py-8 md:py-12">
        <h2 className="text-3xl font-bold tracking-tighter md:text-5xl mb-8 font-headline text-center">Trending Designs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {designs.map((design) => (
            <DesignCard key={design.id} design={design} />
          ))}
        </div>
      </div>
      <Faq />
      <Footer />
    </>
  );
}
