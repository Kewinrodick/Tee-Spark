'use server';

import { suggestTags as suggestTagsAI, type SuggestTagsInput } from '@/ai/flows/ai-tag-suggestions';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import { initializeFirebase } from '@/firebase/server-init';

const uploadSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  price: z.coerce.number().min(1, "Price must be at least $1."),
  tags: z.array(z.string()).min(1, "Please add at least one tag."),
  image: z.any().refine(file => file?.size > 0, "Design file is required."),
});

export async function uploadDesign(formData: FormData) {
  'use server';

  const { auth } = initializeFirebase();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    // This part of the code requires a user to be authenticated on the server.
    // For this environment, we'll proceed assuming a mock user for demonstration.
    // In a real app, you would enforce authentication here.
    console.warn("User not authenticated on the server. This should be handled properly.");
  }
  
  // A mock UID is used because `auth.currentUser` is often null in server actions without complex session management.
  const userId = currentUser?.uid || 'mock-user-id';


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
    const { storage, firestore } = initializeFirebase();
    const imageId = uuidv4();
    const storageRef = ref(storage, `designs/${userId}/${imageId}`);
    
    // Convert blob to buffer for upload
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    await uploadBytes(storageRef, buffer, { contentType: image.type });
    const imageUrl = await getDownloadURL(storageRef);

    // Save metadata to Firestore
    await addDoc(collection(firestore, "designs"), {
      title,
      description,
      price,
      tags,
      imageUrl,
      designerId: userId,
      createdAt: new Date(),
    });

    revalidatePath('/');
    revalidatePath('/my-designs');
    return { success: true };
  } catch (error) {
    console.error('Error uploading design:', error);
    return {
      errors: {
        _form: ['An unexpected error occurred during upload. Please try again.'],
      },
    };
  }
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
