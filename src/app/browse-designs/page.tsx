
'use client';

import { DesignCard } from '@/components/design-card';
import { getDesigns, type Design } from '@/lib/mock-data';
import { useEffect, useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search, SearchX } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function BrowseDesignsPage() {
  const [allDesigns, setAllDesigns] = useState<Design[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDesigns() {
      setIsLoading(true);
      const mockDesigns = await getDesigns();
      const storedDesigns = JSON.parse(localStorage.getItem('userDesigns') || '[]');
      setAllDesigns([...mockDesigns, ...storedDesigns]);
      setIsLoading(false);
    }
    loadDesigns();
  }, []);

  const filteredDesigns = useMemo(() => {
    if (!searchTerm) {
      return allDesigns;
    }
    return allDesigns.filter(design => {
      const term = searchTerm.toLowerCase();
      // In a real app, tags would be an array on the design object
      const tags = design.image.imageHint.split(' ');
      return (
        design.title.toLowerCase().includes(term) ||
        design.description.toLowerCase().includes(term) ||
        design.designer.name.toLowerCase().includes(term) ||
        tags.some(tag => tag.toLowerCase().includes(term))
      );
    });
  }, [searchTerm, allDesigns]);

  return (
    <div className="container py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-center items-center md:justify-between mb-8 gap-4">
             <h1 className="text-3xl font-bold tracking-tighter md:text-5xl font-headline text-center">
                Browse All Designs
            </h1>
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search designs, tags, artists..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
        
        {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-4">
                        <Skeleton className="aspect-[3/4] w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                    </div>
                ))}
            </div>
        ) : filteredDesigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredDesigns.map((design) => (
              <DesignCard key={design.id} design={design} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center">
            <SearchX className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">No designs found</h2>
            <p className="text-muted-foreground mt-2">
              Try a different search term. We couldn't find anything for "{searchTerm}".
            </p>
          </div>
        )}
      </div>
  );
}
