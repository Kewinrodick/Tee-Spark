import Link from "next/link";
import { Logo } from "@/components/logo";
import { Github, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <Logo className="justify-center md:justify-start mb-4" />
            <p className="text-muted-foreground text-sm">
              The premier marketplace for digital T-shirt designs.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-2">
            <div>
              <h4 className="font-semibold mb-3">Explore</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-muted-foreground hover:text-primary">Designs</Link></li>
                <li><Link href="/upload" className="text-muted-foreground hover:text-primary">Upload</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Designers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">About</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Careers</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Press</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Contact</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TeeSpark. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="#" className="hover:text-primary"><Twitter className="h-5 w-5" /></Link>
            <Link href="#" className="hover:text-primary"><Github className="h-5 w-5" /></Link>
            <Link href="#" className="hover:text-primary"><Facebook className="h-5 w-5" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
