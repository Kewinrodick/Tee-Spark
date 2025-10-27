
'use server';

import { suggestTags as suggestTagsAI, type SuggestTagsInput } from '@/ai/flows/ai-tag-suggestions';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { getDesigns } from '@/lib/mock-data';

const uploadSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  price: z.coerce.number().min(1, 'Price must be at least $1.'),
  tags: z.array(z.string()).min(1, 'Please add at least one tag.'),
  image: z.string().min(1, 'Design file is required.'),
});

export async function uploadDesign(formData: FormData, userId: string) {
  'use server';

  if (!userId) {
     return {
      errors: {
        _form: ['You must be logged in to upload a design.'],
      },
    };
  }

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    price: formData.get('price'),
    tags: formData.getAll('tags[]'),
    image: formData.get('image'),
  };

  const validatedFields = uploadSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    // Mock the API call by using the mock-data function
    await getDesigns(); 
    
    revalidatePath('/');
    revalidatePath('/my-designs');
    return { success: true };
  } catch (error: any) {
    console.error('Error uploading design:', error);
    return {
      errors: {
        _form: [`An unexpected error occurred during upload: ${error.message}`],
      },
    };
  }
}

export async function getTagSuggestions(input: SuggestTagsInput) {
  try {
    // Mock the AI call to prevent network errors
    const mockTags = ['cartoon', 'retro', 'hero', 'vintage', 'graphic'];
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return { tags: mockTags };
  } catch (error) {
    console.error('AI Tag Suggestion Error:', error);
    return { error: 'Failed to get AI suggestions due to a server error.' };
  }
}
