import { auth } from "@/auth";
import LandingHeader from "@/components/ui/app/public/landing_header/header";
import LandingFooter from "@/components/ui/app/public/landing_footer/footer";
import AppLayoutClient from "@/components/ui/app/private/AppLayoutClient";
import { ReactNode } from "react";
import PrivateClassroomHeader from "@/components/ui/app/private/classroom/PrivateClassroomHeader";
import PublicClassroomHeader from "@/components/ui/app/private/classroom/PublicClassroomHeader";
import PageContainer from "@studo/ui/design_system/page/PageContainer";

export default async function ClassroomLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (session) {
    return (
      <AppLayoutClient>
        <PageContainer>
          <PrivateClassroomHeader />
          <div className="w-full flex-1 overflow-hidden">{children}</div>
        </PageContainer>
      </AppLayoutClient>
    );
  }

  return (
    <div className="scroll-hidden">
      <LandingHeader />
      <main className={"w-screen h-screen flex items-center justify-center"}>
        <div className="mt-30 w-1/2 h-full py-15 flex flex-col overflow-hidden">
          <PublicClassroomHeader />
          <div className="w-full flex-1 overflow-hidden">{children}</div>
        </div>
      </main>
      <div className="absolute z-[999999] w-full h-fit">
        <LandingFooter />
      </div>
    </div>
  );
}
