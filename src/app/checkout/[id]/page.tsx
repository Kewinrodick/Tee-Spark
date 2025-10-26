
import { getDesignById } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Lock } from "lucide-react";
import Link from "next/link";
import { PurchaseButton } from "@/components/purchase-button";

export default async function CheckoutPage({ params }: { params: { id: string } }) {
  const design = await getDesignById(params.id);

  if (!design) {
    notFound();
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter mb-8 text-center">Checkout</h1>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Order Summary */}
          <div className="bg-secondary/30 rounded-lg p-6 lg:p-8 flex flex-col">
            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
            <div className="flex gap-4">
              <div className="w-24 h-32 relative overflow-hidden rounded-md border border-border">
                <Image
                  src={design.image.imageUrl}
                  alt={design.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{design.title}</h3>
                <p className="text-sm text-muted-foreground">by {design.designer.name}</p>
                <p className="text-lg font-bold mt-2 text-primary">${design.price.toFixed(2)}</p>
              </div>
            </div>
            <Separator className="my-6" />
            <div className="space-y-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${design.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Taxes</span>
                <span>$0.00</span>
              </div>
            </div>
            <Separator className="my-6" />
            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>${design.price.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-6 w-6"/>
                <span>Pay with card</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card information</Label>
                  <div className="relative">
                    <Input id="card-number" placeholder="1234 1234 1234 1234" required />
                    <div className="absolute inset-y-0 right-3 flex items-center gap-2">
                      <img src="/visa.svg" alt="Visa" className="h-4"/>
                      <img src="/mastercard.svg" alt="Mastercard" className="h-4"/>
                      <img src="/amex.svg" alt="American Express" className="h-4"/>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="MM / YY" required />
                    <Input placeholder="CVC" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name on card</Label>
                  <Input id="name" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country or region</Label>
                  <Input id="country" placeholder="United States" required />
                </div>
                
                {/* This button will trigger the mocked payment flow */}
                <PurchaseButton design={design} className="w-full text-lg py-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
                   Pay ${design.price.toFixed(2)}
                </PurchaseButton>

                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                  <Lock className="h-3 w-3" />
                  Secure payment powered by Stripe.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
