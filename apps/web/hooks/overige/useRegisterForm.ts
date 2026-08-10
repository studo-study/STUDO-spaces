"use client";
import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { registerUser } from "@/lib/api/auth";
import { RegisterFormData, registerSchema } from "@/lib/validations/auth";
import { useToast } from "@/components/providers/app/ToastProvider";

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
      const { ...registerData } = data;
      await registerUser(registerData);

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      // Account is aangemaakt; enkel de auto-login faalde. Geen foutmelding met
      // een rauwe next-auth-code tonen — meld succes en laat manueel inloggen.
      if (result?.error) {
        toast.success(t("success"));
        router.push("/login?registered=true");
        return;
      }

      toast.success(t("success"));
      router.push(callbackUrl);
    } catch (error: unknown) {
      // registerUser gooit de ruwe response-body ({ message, code }) door, geen
      // Error-instance. Lees code/message eruit en toon een gerichte melding.
      const body = (error && typeof error === "object" ? error : {}) as {
        message?: string;
        code?: string;
      };

      // Veld-fouten renderen via t(errors.<field>.message) in het formulier,
      // dus zetten we de translation-key als message. De toast krijgt de
      // vertaalde tekst.
      if (body.code === "EMAIL_TAKEN") {
        form.setError("email", { message: "email_taken" });
        toast.error(t("email_taken"));
      } else if (body.code === "DISPLAY_NAME_TAKEN") {
        form.setError("displayName", { message: "name_taken" });
        toast.error(t("name_taken"));
      } else {
        toast.error(body.message ?? t("failed"));
      }

      setServerError(body.message ?? t("failed"));
    }
  };

  // Validatiefouten → toast de eerste veld-fout (message is een translation-key).
  const onInvalid = (fieldErrors: typeof form.formState.errors) => {
    const first = Object.values(fieldErrors)[0];
    if (first?.message) toast.error(t(first.message as string));
  };

  const loginGoogle = useCallback(() => signIn("google"), []);
  const loginMicrosoft = useCallback(() => signIn("microsoft-entra-id"), []);
  const loginSmartschool = useCallback(() => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/sessions/smartschool`;
  }, []);

  return {
    form,
    t,
    language,
    showPassword,
    toggleShowPassword,
    serverError,
    onSubmit: form.handleSubmit(onSubmit, onInvalid),
    loginGoogle,
    loginMicrosoft,
    loginSmartschool,
  };
}
