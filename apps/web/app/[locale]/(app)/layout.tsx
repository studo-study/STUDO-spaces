import { ReactNode } from "react";
import AppLayoutClient from "@/components/ui/app/private/AppLayoutClient";
import PageContainer from "@studo/ui/design_system/page/PageContainer";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AppLayoutClient>
      <PageContainer>{children}</PageContainer>
    </AppLayoutClient>
  );
}
