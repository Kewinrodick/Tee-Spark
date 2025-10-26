import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative bg-background text-foreground">
      <div className="container mx-auto px-4 py-24 text-center md:py-32 lg:py-48">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute left-0 top-0 -z-10 h-2/3 w-full bg-gradient-to-b from-primary/5 via-primary/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 -z-10 h-1/2 w-full bg-gradient-to-t from-background via-background to-transparent"></div>

        <h1 className="text-5xl font-extrabold tracking-tighter md:text-7xl lg:text-8xl font-headline">
          Design. <span className="text-primary">Sell.</span> Scale.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground md:text-xl">
          The ultimate marketplace for unique T-shirt designs. Unleash your creativity and start earning today.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="text-lg">
            <Link href="/upload">
              Start Selling
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg">
            <Link href="#designs">Browse Designs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
