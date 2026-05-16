import { Metadata } from "next";
import CreateVisualsetForm from "@/components/ui/app/create-visualset/CreateVisualset";

export const metadata: Metadata = {
  title: "Create Visualset | Studo",
};

export default function CreateVisualsetPage() {
  return (
    <>
      <CreateVisualsetForm />
    </>
  );
}
