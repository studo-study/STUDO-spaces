import { auth } from "@/auth";
import LearnController from "@/app/[locale]/(shared)/(modes)/learn/[id]/learncontroller";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  const token = session?.accessToken;
  const data = await fetch(`${process.env.AUTH_API_URL}/studysets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 60 },
  }).then((res) => res.json());

  return (
    <div className="w-full h-full flex flex-col dark:text-white items-center justify-center gap-10 scroll-hidden">
      <LearnController data={data} />
    </div>
  );
}
