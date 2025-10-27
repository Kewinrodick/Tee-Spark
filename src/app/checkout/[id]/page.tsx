
import { getDesigns, type Design } from "@/lib/mock-data";
import { CheckoutDetailPageClient } from "@/components/checkout-detail-page";

export default async function CheckoutPage({ params }: { params: { id:string } }) {
  const { id } = params;

  // Fetch initial data on the server
  const mockDesigns = await getDesigns();
  const design = mockDesigns.find((d) => d.id === id);

  return <CheckoutDetailPageClient initialDesign={design} id={id} />;
}
