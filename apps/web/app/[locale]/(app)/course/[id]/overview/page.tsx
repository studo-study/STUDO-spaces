import WigetGridLayout from "@/components/ui/app/private/course/overview/WigetGridLayout";

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WigetGridLayout courseId={id} />;
}
