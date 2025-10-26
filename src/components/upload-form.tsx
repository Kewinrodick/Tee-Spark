'use client';

import {
  useState,
  useTransition,
  useRef,
  useEffect,
  type ComponentProps,
} from 'react';
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
import { Loader2, Wand2, X, Image as ImageIcon } from 'lucide-react';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@/firebase';

const uploadSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters to get AI suggestions.'),
  price: z.coerce.number().min(1, 'Price must be at least $1.'),
  tags: z.array(z.string()).min(1, 'Please add at least one tag.'),
  image: z
    .any()
    .refine((file) => file instanceof File && file.size > 0, 'Design file is required.'),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

export function UploadForm() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSubmitting, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 10,
      tags: [],
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

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
    const newTags = tags.filter((tag) => tag !== tagToRemove);
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
          variant: 'destructive',
          title: 'AI Suggestion Failed',
          description: result.error,
        });
      }
    } finally {
      setIsSuggesting(false);
    }
  };

  async function onSubmit(values: UploadFormValues) {
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'You must be logged in to upload a design.',
        });
        return;
    }

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('price', String(values.price));
    values.tags.forEach((tag) => formData.append('tags[]', tag));
    formData.append('image', values.image);

    startTransition(async () => {
      const result = await uploadDesign(formData);

      if (result?.success) {
        toast({
          title: 'Design Uploaded!',
          description: 'Your design is now live on the platform.',
        });
        router.push('/my-designs');
      } else if (result?.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          if (field === '_form') {
            toast({
              variant: 'destructive',
              title: 'Upload Failed',
              description: (messages as string[]).join(', '),
            });
          } else {
            form.setError(field as keyof UploadFormValues, {
              type: 'server',
              message: (messages as string[]).join(', '),
            });
          }
        });
      }
    });
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('image', file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue('image', undefined, { shouldValidate: true });
      setImagePreview(null);
    }
  };

  if (!mounted) return null;

  if (!user) {
    return (
        <Card>
            <CardContent className="p-6 text-center">
                <p>Please <a href="/login" className="underline text-primary">log in</a> to upload a design.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Upload Section */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Design File</FormLabel>
                  <FormControl>
                    <div
                      className="relative flex justify-center items-center h-64 w-full border-2 border-dashed border-muted rounded-lg cursor-pointer hover:border-primary transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/webp"
                      />
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Design preview"
                          fill
                          className="object-contain rounded-lg"
                        />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <ImageIcon className="mx-auto h-12 w-12" />
                          <p className="mt-2">Click or drag file to this area to upload</p>
                          <p className="text-xs">PNG, JPG, WEBP up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
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

            {/* Description */}
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

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Tags</FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleSuggestTags}
                      disabled={isSuggesting}
                    >
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
                      <div className="mt-2 flex flex-wrap gap-2 min-h-[24px]">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Add tags to help buyers discover your design. You can type them manually or
                    use AI suggestions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                        $
                      </span>
                      <Input type="number" placeholder="25" className="pl-7" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Uploading...' : 'Upload Design'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
