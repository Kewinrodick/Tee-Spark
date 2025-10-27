
'use server';

import { suggestTags as suggestTagsAI, type SuggestTagsInput } from '@/ai/flows/ai-tag-suggestions';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

const API_URL = 'http://localhost:5000';

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
  
  const { title, description, price, tags, image } = validatedFields.data;

  try {
    const newDesign = {
      title,
      description,
      price,
      tags,
      designerId: userId,
      imageUrl: image, 
    };

    const response = await fetch(`${API_URL}/designs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDesign),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create design');
    }
    
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
    const result = await suggestTagsAI(input);
    return { tags: result.tags };
  } catch (error) {
    console.error('AI Tag Suggestion Error:', error);
    return { error: 'Failed to get AI suggestions due to a server error.' };
  }
}
