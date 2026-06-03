import EditStudosetForm from "@/components/ui/shared/studoset/edit/EditStudosetForm";

export default async function EditSetPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  return <EditStudosetForm id={id} />;
}
