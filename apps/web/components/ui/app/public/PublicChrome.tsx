import { ReactNode } from "react";
import LandingHeader from "@/components/ui/app/public/landing_header/header";
import LandingFooter from "@/components/ui/app/public/landing_footer/footer";

// Publieke chrome (landing header + footer) voor uitgelogde bezoekers van
// gedeelde pagina's (studoset, profiel, track, groep). Voorheen de
// (marketing)/layout, die nu in de losse marketing-app leeft.
export default function PublicChrome({ children }: { children: ReactNode }) {
  return (
    <div className={"scroll-hidden"}>
      <LandingHeader />
      <main>{children}</main>
      <div className={"absolute z-999999 w-full h-fit scroll-hidden"}>
        <LandingFooter />
      </div>
    </div>
  );
}
