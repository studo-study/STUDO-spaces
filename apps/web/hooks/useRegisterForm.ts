"use client";
import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { registerUser } from "@/lib/api/auth";
import { RegisterFormData, registerSchema } from "@/lib/validations/auth";
import { useToast } from "@/components/providers/ToastProvider";

export function useRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const language = useLocale();
  const locale = useLocale();
  const t = useTranslations("register");
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || `/${locale}/home`;

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const form = useForm<RegisterFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(registerSchema as any) as Resolver<RegisterFormData>,
    defaultValues: { role: "student" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      const { confirmPassword: _, ...registerData } = data;
      await registerUser(registerData);

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
        router.push("/login?registered=true");
        return;
      }

      toast.success("Succesfully registered");
      router.push(callbackUrl);
    } catch (error: unknown) {
      setServerError(
        error instanceof Error ? error.message : "Registratie mislukt",
      );
    }
  };

  const loginGoogle = useCallback(() => signIn("google"), []);
  const loginMicrosoft = useCallback(() => signIn("microsoft-entra-id"), []);
  const loginSmartschool = useCallback(() => {
    window.location.href = "http://localhost:3000/api/sessions/smartschool";
  }, []);

  return {
    form,
    t,
    language,
    showPassword,
    toggleShowPassword,
    serverError,
    onSubmit: form.handleSubmit(onSubmit),
    loginGoogle,
    loginMicrosoft,
    loginSmartschool,
  };
}
