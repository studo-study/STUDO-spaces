// app/[locale]/(app)/layout.tsx
import { ReactNode } from "react";
import AppLayoutClient from "@/components/ui/app/AppLayoutClient";
import PageContainer from "@/components/ui/design_system/page/PageContainer";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AppLayoutClient>
      <PageContainer>{children}</PageContainer>
    </AppLayoutClient>
  );
}
