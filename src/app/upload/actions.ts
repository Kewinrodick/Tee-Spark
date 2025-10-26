'use server';

import { suggestTags as suggestTagsAI, type SuggestTagsInput } from '@/ai/flows/ai-tag-suggestions';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { getApps, initializeApp, getApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

const uploadSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  price: z.coerce.number().min(1, "Price must be at least $1."),
  tags: z.array(z.string()).min(1, "Please add at least one tag."),
  image: z.any().refine(file => file?.size > 0, "Design file is required."),
});

// Helper to initialize Firebase on the server
function initializeServerFirebase() {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
}

export async function uploadDesign(formData: FormData) {
  'use server';

  const userId = 'mock-user-id'; // Replace with real auth logic later

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
    const firebaseApp = initializeServerFirebase();
    const storage = getStorage(firebaseApp);
    const firestore = getFirestore(firebaseApp);
    
    const imageId = uuidv4();
    const storageRef = ref(storage, `designs/${userId}/${imageId}`);
    
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    await uploadBytes(storageRef, buffer, { contentType: image.type });
    const imageUrl = await getDownloadURL(storageRef);

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
  try {
    const result = await suggestTagsAI(input);
    return { tags: result.tags };
  } catch (error) {
    console.error('AI Tag Suggestion Error:', error);
    return { error: 'Failed to get AI suggestions due to a server error.' };
  }
}
