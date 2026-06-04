import { ReactNode } from "react";
import FileHeader from "@/components/ui/app/your-files/header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <section className="w-full min-h-full flex flex-col scroll-hidden">
      <FileHeader />
      <div className="flex-1 h-full">{children}</div>
    </section>
  );
}
