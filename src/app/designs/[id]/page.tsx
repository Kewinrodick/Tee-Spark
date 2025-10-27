
'use client';

import { getDesignById, type Design } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, ShoppingCart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DesignPage({ params }: { params: { id: string } }) {
  const [design, setDesign] = useState<Design | null | undefined>(undefined);

  useEffect(() => {
    async function fetchDesign() {
      // First, try to find the design in localStorage (for user-uploaded designs)
      const storedDesigns = JSON.parse(localStorage.getItem('userDesigns') || '[]');
      const allMockDesigns = JSON.parse(localStorage.getItem('allDesigns') || '[]');
      const allDesigns = [...allMockDesigns, ...storedDesigns];
      let foundDesign = allDesigns.find((d: Design) => d.id === params.id);

      // If not found in localStorage, fetch from mock data API
      if (!foundDesign) {
        foundDesign = await getDesignById(params.id);
      }
      
      setDesign(foundDesign);
    }

    fetchDesign();
  }, [params.id]);

  if (design === undefined) {
    // Loading state
    return (
        <div className="container py-8 md:py-12">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <Skeleton className="aspect-[3/4] w-full rounded-lg"/>
                <div className="flex flex-col gap-6">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-20 w-full" />
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-8 w-full" />
                </div>
            </div>
        </div>
    )
  }

  if (!design) {
    notFound();
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="group overflow-hidden rounded-lg border border-border">
           <Image
            src={design.image.imageUrl}
            alt={design.title}
            width={1200}
            height={1600}
            className="object-cover w-full h-full transition-transform duration-300 ease-in-out md:group-hover:scale-110"
            data-ai-hint={design.image.imageHint}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter mb-2">{design.title}</h1>
            <div className="flex items-center gap-2 text-lg text-muted-foreground">
              <span>by</span>
              <Avatar className="h-8 w-8">
                <AvatarImage src={design.designer.avatarUrl} alt={design.designer.name} />
                <AvatarFallback>{design.designer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">{design.designer.name}</span>
            </div>
          </div>
          
          <p className="text-muted-foreground leading-relaxed">{design.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {/* In a real app, these tags would come from the design object */}
            <Badge variant="secondary">Abstract</Badge>
            <Badge variant="secondary">Minimalist</Badge>
            <Badge variant="secondary">Modern</Badge>
            <Badge variant="secondary">Geometric</Badge>
          </div>
          
          <div className="flex items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              <span className="font-medium">{design.likes.toLocaleString()} likes</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">{design.commentsCount.toLocaleString()} comments</span>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
             <Button asChild size="lg" className="w-full sm:w-auto text-lg py-6 px-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
                <Link href={`/checkout/${design.id}`}>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Purchase - ${design.price}
                </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
