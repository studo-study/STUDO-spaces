import AdminUserDetail from "@/components/ui/app/admin/AdminUserDetail";

export default async function AdminUserPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="w-full h-full flex flex-col gap-5">
      <AdminUserDetail userId={id} />
    </div>
  );
}
