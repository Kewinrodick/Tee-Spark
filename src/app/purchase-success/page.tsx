
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PurchaseSuccessPage() {
  return (
    <div className="container flex min-h-[calc(100vh-10rem)] items-center justify-center py-12 text-center">
      <div className="max-w-lg">
        <CheckCircle2 className="mx-auto h-20 w-20 text-primary" />
        <h1 className="mt-6 text-4xl font-bold tracking-tighter font-headline md:text-5xl">
          Purchase Successful!
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Thank you for your order. A confirmation receipt and a proof of purchase have been sent to your email address.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">Continue Shopping</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/purchases">View My Purchases</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
