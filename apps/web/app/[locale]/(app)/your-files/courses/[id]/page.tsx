import CourseSets from "@/components/ui/app/private/your-files/courses/page/CourseSets";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <CourseSets id={id} />
    </>
  );
}
