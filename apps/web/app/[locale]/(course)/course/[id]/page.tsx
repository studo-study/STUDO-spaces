import { redirect } from "@/i18n/routing";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  redirect({ href: `/course/${id}/overview`, locale });
}
