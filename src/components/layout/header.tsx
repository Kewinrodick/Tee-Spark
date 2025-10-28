
'use client';

import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Upload, LogOut, User as UserIcon, LayoutGrid, Heart, ShoppingBag } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
import { useAuth } from '@/context/auth-context';

export function Header() {
  const { user, isLoading, logout } = useAuth();

  const handleSignOut = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
             <Link href="/" className="transition-colors hover:text-primary text-foreground/80">
              Home
            </Link>
            <Link href="/#trending-designs" className="transition-colors hover:text-primary text-foreground/80">
              Trending
            </Link>
            {user && user.role === 'Designer' && (
                 <Link href="/my-designs" className="transition-colors hover:text-primary text-foreground/80">
                    My Designs
                </Link>
            )}
            {user && user.role === 'Buyer' && (
                 <Link href="/browse-designs" className="transition-colors hover:text-primary text-foreground/80">
                    Browse Designs
                </Link>
            )}
          </nav>
        </div>
        <nav className="flex items-center gap-2">
          {isLoading ? (
             <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
          ) : user ? (
            <>
            {user.role === 'Designer' && (
              <Button asChild>
                  <Link href="/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                  </Link>
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.profileImageUrl || `https://i.pravatar.cc/150?u=${user.email}`} alt={user.username} />
                    <AvatarFallback>{user.username?.[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                {user.role === 'Designer' && (
                  <DropdownMenuItem asChild>
                    <Link href="/my-designs">
                      <LayoutGrid className="mr-2 h-4 w-4" />
                      <span>My Designs</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                {user.role === 'Buyer' && (
                  <DropdownMenuItem asChild>
                    <Link href="/purchases">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span>My Purchases</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                 <DropdownMenuItem asChild>
                  <Link href="/favorites">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Favorites</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
