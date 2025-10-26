import { PlaceHolderImages, type ImagePlaceholder } from './placeholder-images';

export type Designer = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type Design = {
  id: string;
  title: string;
  description: string;
  image: ImagePlaceholder;
  price: number;
  designer: Designer;
  likes: number;
  commentsCount: number;
};

const mockDesigners: Designer[] = [
  { id: 'designer-1', name: 'PixelPioneer', avatarUrl: 'https://i.pravatar.cc/150?u=designer-1' },
  { id: 'designer-2', name: 'ArtVibes', avatarUrl: 'https://i.pravatar.cc/150?u=designer-2' },
  { id: 'designer-3', name: 'VectorVortex', avatarUrl: 'https://i.pravatar.cc/150?u=designer-3' },
  { id: 'designer-4', name: 'GlowGraphix', avatarUrl: 'https://i.pravatar.cc/150?u=designer-4' },
];

const mockDesigns: Design[] = PlaceHolderImages.map((image, index) => ({
  id: image.id,
  title: image.description,
  description: `A stunning design titled "${image.description}" by ${mockDesigners[index % mockDesigners.length].name}. This high-quality artwork is perfect for printing on T-shirts, bringing a unique and modern style. The design features ${image.imageHint}, making it a standout piece for any wardrobe.`,
  image: image,
  price: Math.floor(Math.random() * (50 - 15 + 1) + 15),
  designer: mockDesigners[index % mockDesigners.length],
  likes: Math.floor(Math.random() * 2000),
  commentsCount: Math.floor(Math.random() * 200),
}));

export async function getDesigns(): Promise<Design[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockDesigns;
}

export async function getDesignById(id: string): Promise<Design | undefined> {
    // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockDesigns.find(d => d.id === id);
}
