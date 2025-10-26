'use server';

import { suggestTags as suggestTagsAI, type SuggestTagsInput } from '@/ai/flows/ai-tag-suggestions';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const uploadSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  price: z.coerce.number().min(1, "Price must be at least $1."),
  tags: z.array(z.string()).min(1, "Please add at least one tag."),
});

export async function uploadDesign(formData: FormData) {
  // This is a mock action. In a real app, you would handle file upload and DB insertion.
  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    price: formData.get('price'),
    tags: formData.getAll('tags[]'),
  };

  const validatedFields = uploadSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  console.log('Design uploaded:', validatedFields.data);
  // Here you would upload to a service like S3, and save metadata to your database.
  
  revalidatePath('/');
  return { success: true };
}

export async function getTagSuggestions(input: SuggestTagsInput) {
  // Rate limiting and other security checks would be important here in a real app.
  try {
    const result = await suggestTagsAI(input);
    return { tags: result.tags };
  } catch (error) {
    console.error('AI Tag Suggestion Error:', error);
    return { error: 'Failed to get AI suggestions due to a server error.' };
  }
}
