
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";

export default function ProfilePage() {
    const { toast } = useToast();
    const { user, isLoading, updateUser } = useAuth();
    const [name, setName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.username || '');
        }
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        
        try {
          // In a real app, you'd call an API to update the user profile
          // await fetch('/api/users/me', { method: 'PUT', body: JSON.stringify({ username: name }) });
          
          // For now, we simulate the update and update the context
          const updatedUserData = { ...user, username: name };
          
          // This is a mock update. In a real app, the backend would handle this
          // and the AuthContext would refetch the user.
          await updateUser(updatedUserData);

          toast({
              title: "Profile Updated",
              description: "Your changes have been saved successfully.",
          });
        } catch (error) {
           toast({
              variant: "destructive",
              title: "Update Failed",
              description: "Could not save your changes.",
            });
        } finally {
          setIsSaving(false);
        }
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
