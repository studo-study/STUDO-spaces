import { Metadata } from "next";
import Grid from "@/components/ui/app/private/library/sets/grid";

export const metadata: Metadata = {
  title: "Sets | Studo",
};

export default async function SetsPage() {
  return (
    <div className="w-full flex-1 overflow-y-scroll scroll-hidden">
      <Grid />
    </div>
  );
}
