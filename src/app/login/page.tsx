import { LoginForm } from "@/components/auth/login-form";
import { ClientOnly } from "@/components/client-only";

export default function LoginPage() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <ClientOnly>
                <LoginForm />
            </ClientOnly>
        </div>
    );
}
