import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            <Link href="/" className="transition-colors hover:text-primary text-foreground/80">
              Designs
            </Link>
             <Link href="/upload" className="transition-colors hover:text-primary text-foreground/80">
              Upload
            </Link>
          </nav>
        </div>
        <nav className="flex items-center">
          <Button asChild className="hidden md:flex">
            <Link href="/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Design
            </Link>
          </Button>
          <Button variant="ghost" asChild className="ml-2">
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="outline" asChild className="ml-2">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
