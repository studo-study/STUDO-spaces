import { Metadata } from "next";
import Grid from "@/components/ui/app/your-files/sets/grid";

export const metadata: Metadata = {
  title: "Sets | Studo",
};

export default async function SetsPage() {
  return (
    <div className="w-full h-full ">
      <Grid />
    </div>
  );
}
