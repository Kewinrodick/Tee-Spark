
'use server';

import { suggestTags as suggestTagsAI, type SuggestTagsInput } from '@/ai/flows/ai-tag-suggestions';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import type { Design } from '@/lib/mock-data';

const uploadSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  price: z.coerce.number().min(1, 'Price must be at least $1.'),
  tags: z.array(z.string()).min(1, 'Please add at least one tag.'),
  image: z.string().min(1, 'Design file is required.'),
});

// This function will now be responsible for adding the new design to a client-side store (localStorage)
// This is a client-side action despite the 'use server' directive, as it is called from a client component and interacts with localStorage.
// The actual storage happens in the component that calls this.
export async function uploadDesign(values: z.infer<typeof uploadSchema>, userEmail: string) {
  'use server';

  if (!userEmail) {
     return {
      errors: {
        _form: ['You must be logged in to upload a design.'],
      },
    };
  }

  const validatedFields = uploadSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const newDesign: Design = {
        id: uuidv4(),
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        image: {
            id: uuidv4(),
            imageUrl: validatedFields.data.image,
            description: validatedFields.data.title,
            imageHint: validatedFields.data.tags.slice(0,2).join(' '),
        },
        price: validatedFields.data.price,
        designer: {
            id: userEmail,
            name: userEmail.split('@')[0], // Mock designer name from email
            avatarUrl: `https://i.pravatar.cc/150?u=${userEmail}`,
        },
        likes: 0,
        commentsCount: 0,
    }
    
    // The component calling this action will handle localStorage persistence.
    // We just return the created design object.
    
    revalidatePath('/');
    revalidatePath('/my-designs');

    return { success: true, design: newDesign };
  } catch (error: any) {
    console.error('Error creating design object:', error);
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
    return result;
  } catch (error) {
    console.error('AI Tag Suggestion Error:', error);
    return { error: 'Failed to get AI suggestions due to a server error.' };
  }
}
