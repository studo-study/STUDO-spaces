"use client";
import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";

export default function SettingsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/settings/account");
  }, [router]);
  return null;
}
