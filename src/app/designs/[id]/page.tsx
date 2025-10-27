
import { getDesigns, type Design } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { DesignDetailPageClient } from "@/components/design-detail-page";

export default async function DesignPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  // In a Server Component, we fetch all data sources.
  // We can't access localStorage here, so we rely on mock data.
  // The client component will handle localStorage.
  const mockDesigns = await getDesigns();
  const design = mockDesigns.find((d) => d.id === id);

  // We pass the initially found design (or nothing) to the client component.
  // The client component will then have its own logic to check localStorage.
  return <DesignDetailPageClient initialDesign={design} id={id} />;
}
