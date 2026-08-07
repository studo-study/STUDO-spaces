import AdminUserDetail from "@/components/ui/app/admin/AdminUserDetail";

export default async function AdminUserPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="min-w-0 min-h-0 flex-1 overflow-y-scroll scroll-hidden flex flex-col gap-5">
      <AdminUserDetail userId={id} />
    </div>
  );
}
