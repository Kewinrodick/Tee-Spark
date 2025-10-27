import type { Design } from './mock-data';

const API_URL = 'http://localhost:5000';

export async function getDesigns(): Promise<Design[]> {
  try {
    const response = await fetch(`${API_URL}/designs`);
    if (!response.ok) {
      console.error('Failed to fetch designs, returning mock data.');
      return []; // In a real app, you might want to throw an error or handle it differently
    }
    const designs = await response.json();
    // The backend returns designs that might not match the frontend's Design type exactly.
    // We need to map them to the expected structure.
    return designs.map((design: any) => ({
      id: design._id, // MongoDB uses _id
      title: design.title,
      description: design.description,
      image: {
        id: design._id,
        imageUrl: design.imageUrl,
        description: design.title,
        imageHint: design.tags.slice(0, 2).join(' '),
      },
      price: design.price,
      designer: {
        id: design.designerId,
        name: 'Designer', // Placeholder, you would fetch this from your users API
        avatarUrl: `https://i.pravatar.cc/150?u=${design.designerId}`,
      },
      likes: Math.floor(Math.random() * 2000), // Placeholder
      commentsCount: Math.floor(Math.random() * 200), // placeholder
    }));
  } catch (error) {
    console.error("Error fetching designs:", error);
    return []; // Return empty array on error
  }
}

export async function getDesignById(id: string): Promise<Design | undefined> {
    try {
        const response = await fetch(`${API_URL}/designs/${id}`);
        if (!response.ok) {
            return undefined;
        }
        const design = await response.json();
        return {
            id: design._id,
            title: design.title,
            description: design.description,
            image: {
              id: design._id,
              imageUrl: design.imageUrl,
              description: design.title,
              imageHint: design.tags.slice(0, 2).join(' '),
            },
            price: design.price,
            designer: {
              id: design.designerId,
              name: 'Designer', // Placeholder
              avatarUrl: `https://i.pravatar.cc/150?u=${design.designerId}`,
            },
            likes: Math.floor(Math.random() * 2000),
            commentsCount: Math.floor(Math.random() * 200),
        };
    } catch (error) {
        console.error(`Error fetching design ${id}:`, error);
        return undefined;
    }
}
