import { SignupForm } from "@/components/auth/signup-form";
import { ClientOnly } from "@/components/client-only";

export default function SignupPage() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <ClientOnly>
                <SignupForm />
            </ClientOnly>
        </div>
    );
}
