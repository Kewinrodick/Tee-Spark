import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("font-bold text-xl tracking-tighter flex items-center gap-2 font-headline", className)}>
      <Sparkles className="h-5 w-5 text-primary" />
      <span className="text-foreground">Tee</span>
      <span className="text-primary">Spark</span>
    </div>
  );
}
