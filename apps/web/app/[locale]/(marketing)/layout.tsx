import { ReactNode } from "react";
import LandingHeader from "@/components/ui/app/public/marketing/landing_header/header";
import LandingFooter from "@/components/ui/app/public/marketing/landing_footer/footer";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className={"scroll-hidden"}>
      <LandingHeader />
      <main>{children}</main>
      <div className={"absolute z-[999999] w-full h-fit scroll-hidden"}>
        <LandingFooter />
      </div>
    </div>
  );
}
