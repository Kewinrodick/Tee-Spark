
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type User = {
  name: string;
  email: string;
  role: string;
};

export default function ProfilePage() {
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [name, setName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setName(parsedUser.name || '');
        }
        setIsLoading(false);
    }, []);

    const handleSave = () => {
        if (!user) return;
        setIsSaving(true);
        
        const updatedUser = { ...user, name };
        
        // Simulate API call
        setTimeout(() => {
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            
            // Dispatch a storage event to notify other components like the header
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'user',
                newValue: JSON.stringify(updatedUser)
            }));
            
            setIsSaving(false);
            toast({
                title: "Profile Updated",
                description: "Your changes have been saved successfully.",
            });
        }, 1000);
    };

    if (isLoading) {
        return (
             <div className="container max-w-2xl py-8 md:py-12">
                <div className="space-y-2 mb-8">
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="h-6 w-3/4" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-5 w-2/3" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                           <Skeleton className="h-5 w-24" />
                           <Skeleton className="h-10 w-full" />
                        </div>
                         <div className="space-y-2">
                           <Skeleton className="h-5 w-24" />
                           <Skeleton className="h-10 w-full" />
                        </div>
                         <div className="space-y-2">
                           <Skeleton className="h-5 w-24" />
                           <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-11 w-32" />
                    </CardContent>
                </Card>
            </div>
        )
    }

  if (!user) {
    return (
        <div className="container max-w-2xl py-8 md:py-12 text-center">
             <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">My Profile</h1>
             <p className="text-muted-foreground mt-4">Please log in to view your profile.</p>
        </div>
    )
  }

  return (
    <div className="container max-w-2xl py-8 md:py-12">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">My Profile</h1>
        <p className="text-muted-foreground">
          View and manage your account details.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Update your personal details here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user.email} disabled />
          </div>
           <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={user.role || 'Buyer'} disabled />
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save Changes"}
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
