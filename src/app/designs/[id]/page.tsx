
import { getDesignById } from "@/lib/mock-data";
import { DesignDetailPageClient } from "@/components/design-detail-page";

// This is a new dynamic route page to display a single design.

export default async function DesignPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // We fetch the initial design data on the server.
  // The client component will handle checking localStorage for user-uploaded designs.
  const design = await getDesignById(id);

  return <DesignDetailPageClient initialDesign={design} id={id} />;
}
