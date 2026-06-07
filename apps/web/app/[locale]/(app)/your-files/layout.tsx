import { ReactNode } from "react";
import FileHeader from "@/components/ui/app/private/your-files/header";
import NoResult from "@/components/ui/app/public/marketing/search/noresult";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <section className="relative w-full flex-1 flex flex-col overflow-hidden">
      <div className={"w-full h-fit flex-shrink-0"}>
        <FileHeader />
      </div>
      <div className="relative flex-1 min-h-0 overflow-hidden">{children}</div>
    </section>
  );
}
