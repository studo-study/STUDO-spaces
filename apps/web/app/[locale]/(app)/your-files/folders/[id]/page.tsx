import FolderSets from "@/components/ui/app/your-files/folders/page/FolderSets";

export default async function FolderPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <FolderSets id={id} />
    </>
  );
}
