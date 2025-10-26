import type { Design } from "@/lib/mock-data";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PurchaseButton } from "./purchase-button";

interface DesignCardProps {
  design: Design;
  className?: string;
}

export function DesignCard({ design, className }: DesignCardProps) {
  return (
      <Card className={cn("overflow-hidden h-full flex flex-col transition-all duration-300 hover:border-primary/50 group border-transparent", className)}>
        <Link href={`/designs/${design.id}`} className="block flex flex-col flex-grow">
          <CardHeader className="p-0">
            <div className="aspect-[3/4] overflow-hidden">
              <Image
                src={design.image.imageUrl}
                alt={design.title}
                width={600}
                height={800}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={design.image.imageHint}
              />
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-grow">
            <CardTitle className="text-lg font-bold leading-tight tracking-tight mb-2 truncate group-hover:text-primary">
              {design.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="h-6 w-6">
                <AvatarImage src={design.designer.avatarUrl} alt={design.designer.name} />
                <AvatarFallback>{design.designer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{design.designer.name}</span>
            </div>
             <div className="flex gap-4 text-muted-foreground mt-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Heart className="h-4 w-4" />
                <span>{design.likes}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4" />
                <span>{design.commentsCount}</span>
              </div>
            </div>
          </CardContent>
        </Link>
        <CardFooter className="p-4 pt-0">
            <PurchaseButton design={design} />
        </CardFooter>
      </Card>
  );
}
