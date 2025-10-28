
'use client';

import { type Design } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Send, ShoppingCart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { formatDistanceToNow } from 'date-fns';

type Comment = {
  id: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  text: string;
  date: string;
};

export function DesignDetailPageClient({ initialDesign, id }: { initialDesign: Design | undefined, id: string }) {
  const [design, setDesign] = useState<Design | null | undefined>(initialDesign);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  const [animateHeart, setAnimateHeart] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchDesignAndComments() {
        // On the client, we can now check localStorage
        const storedDesigns = JSON.parse(localStorage.getItem('userDesigns') || '[]');
        let foundDesign = storedDesigns.find((d: Design) => d.id === id);

        if (foundDesign) {
            setDesign(foundDesign);
        } else if(initialDesign) {
            setDesign(initialDesign);
        }

        // Load comments from localStorage
        const storedComments = JSON.parse(localStorage.getItem(`comments_${id}`) || '[]');
        setComments(storedComments);

        // Update initial comment count if it differs from localStorage
        if (design && storedComments.length !== design.commentsCount) {
          setDesign(d => d ? { ...d, commentsCount: storedComments.length } : null);
        }
    }

    if (design === undefined) {
      fetchDesignAndComments();
    }
    
    // Check for favorite status in localStorage
    const favorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
    setIsFavorite(favorites.includes(id));

  }, [id, initialDesign, design]);

  const handleFavoriteToggle = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Please log in",
        description: "You need to be logged in to favorite a design.",
      });
      router.push('/login');
      return;
    }
    
    setAnimateHeart(true);

    const favorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((favId: string) => favId !== id);
      toast({ title: "Removed from favorites." });
      setDesign(prev => prev ? { ...prev, likes: prev.likes - 1 } : null);
    } else {
      newFavorites = [...favorites, id];
      toast({ title: "Added to favorites!" });
      setDesign(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    }

    localStorage.setItem('userFavorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Please log in',
        description: 'You need to be logged in to comment.',
      });
      router.push('/login');
      return;
    }
    if (newComment.trim() === '') return;

    setIsSubmittingComment(true);

    const comment: Comment = {
      id: `comment_${Date.now()}`,
      user: {
        id: user.email,
        name: user.username,
        avatarUrl: user.profileImageUrl || `https://i.pravatar.cc/150?u=${user.email}`,
      },
      text: newComment,
      date: new Date().toISOString(),
    };

    // Simulate network delay
    await new Promise(res => setTimeout(res, 500));

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments));
    
    setDesign(prev => prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : null);
    setNewComment('');
    setIsSubmittingComment(false);
  };


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
             <button className="flex items-center gap-2 group/like" onClick={handleFavoriteToggle}>
              <Heart 
                onAnimationEnd={() => setAnimateHeart(false)}
                className={cn(
                  "h-5 w-5 transition-colors group-hover/like:text-primary", 
                  isFavorite && "fill-primary text-primary",
                  animateHeart && "animate-pop"
                )} 
              />
              <span className="font-medium group-hover/like:text-foreground">{design.likes.toLocaleString()} likes</span>
            </button>
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

       {/* Comments Section */}
      <div className="mt-12 md:mt-16">
        <Card>
            <CardHeader>
                <CardTitle>{design.commentsCount.toLocaleString()} Comments</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleCommentSubmit} className="flex flex-col sm:flex-row items-start gap-4 mb-8">
                    <Avatar>
                        <AvatarImage src={user?.profileImageUrl || `https://i.pravatar.cc/150?u=${user?.email}`} />
                        <AvatarFallback>{user?.username?.charAt(0) ?? '?'}</AvatarFallback>
                    </Avatar>
                    <div className="w-full relative">
                        <Textarea
                        placeholder={user ? "Write a comment..." : "Please log in to leave a comment"}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={!user || isSubmittingComment}
                        className="pr-16"
                        />
                        <Button 
                            type="submit" 
                            size="icon" 
                            className="absolute right-3 top-3 h-8 w-8"
                            disabled={!user || !newComment.trim() || isSubmittingComment}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </form>

                <div className="space-y-6">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex items-start gap-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={comment.user.avatarUrl} alt={comment.user.name} />
                                    <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-baseline gap-2">
                                        <p className="font-semibold">{comment.user.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <p className="text-sm text-foreground/90 mt-1">{comment.text}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground py-8">Be the first to comment!</p>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

    