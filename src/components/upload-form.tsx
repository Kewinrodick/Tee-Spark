'use client';

import { useState, useTransition, type ComponentProps } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { uploadDesign, getTagSuggestions } from '@/app/upload/actions';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Wand2, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const uploadSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters to get AI suggestions.'),
  price: z.coerce.number().min(1, 'Price must be at least $1.'),
  tags: z.array(z.string()).min(1, 'Please add at least one tag.'),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

function SubmitButton(props: ComponentProps<typeof Button>) {
    const [pending, startTransition] = useTransition();
    return <Button type="submit" disabled={pending} {...props} />;
}

export function UploadForm() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 10,
      tags: [],
    },
  });

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        const newTags = [...tags, newTag];
        setTags(newTags);
        form.setValue('tags', newTags, { shouldValidate: true });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    form.setValue('tags', newTags, { shouldValidate: true });
  };
  
  const handleSuggestTags = async () => {
    const description = form.getValues('description');
    if (!description || description.length < 20) {
      form.setError('description', {
        type: 'manual',
        message: 'Please enter a description of at least 20 characters to get suggestions.',
      });
      return;
    }
    
    setIsSuggesting(true);
    try {
      const result = await getTagSuggestions({ designDescription: description });
      if (result.tags) {
        const newTags = [...new Set([...tags, ...result.tags])];
        setTags(newTags);
        form.setValue('tags', newTags, { shouldValidate: true });
      } else if (result.error) {
        toast({
            variant: "destructive",
            title: "AI Suggestion Failed",
            description: result.error,
        });
      }
    } finally {
      setIsSuggesting(false);
    }
  };

  async function onSubmit(values: UploadFormValues) {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('price', String(values.price));
    values.tags.forEach(tag => formData.append('tags[]', tag));
    // In a real app, you would append the file:
    // formData.append('image', imageFile);

    const result = await uploadDesign(formData);

    if (result?.success) {
      toast({
        title: "Design Uploaded!",
        description: "Your design is now live on the platform.",
      });
      router.push('/');
    } else if (result?.errors) {
        // Handle server-side validation errors
        // This is a basic implementation.
        Object.entries(result.errors).forEach(([field, messages]) => {
            form.setError(field as keyof UploadFormValues, {
                type: 'server',
                message: (messages as string[]).join(', '),
            });
        });
    }
  }


  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Design Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 'Cyberpunk Sunset'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your design. The more detail, the better the AI tag suggestions!"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Tags</FormLabel>
                    <Button type="button" variant="ghost" size="sm" onClick={handleSuggestTags} disabled={isSuggesting}>
                      {isSuggesting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="mr-2 h-4 w-4" />
                      )}
                      Suggest with AI
                    </Button>
                  </div>
                  <FormControl>
                    <div>
                      <Input
                        placeholder="Add tags and press Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                      />
                       <div className="mt-2 flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Add tags to help buyers discover your design. You can type them manually or use AI suggestions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                     <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">$</span>
                        <Input type="number" placeholder="25" className="pl-7" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Mock File Upload */}
            <FormItem>
              <FormLabel>Design File</FormLabel>
              <FormControl>
                <Input type="file" disabled />
              </FormControl>
              <FormDescription>
                File uploads are currently disabled. This is a UI demonstration.
              </FormDescription>
            </FormItem>

            <Button type="submit" size="lg" className="w-full">
              Upload Design
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
