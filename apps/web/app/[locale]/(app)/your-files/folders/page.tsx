import { Metadata } from "next";
import FolderTopBar from "@/components/ui/app/private/your-files/folders/top-bar";
import FolderGrid from "@/components/ui/app/private/your-files/folders/foldergrid";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Folders | Studo",
};

export default async function Page() {
  const session = await auth();
  const token = session?.accessToken;
  const data = await fetch(`${process.env.AUTH_API_URL}/folders/me`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 60 },
  }).then((res) => res.json());

  console.log(data);
  return (
    <div className=" w-full flex flex-col gap-10 scroll-hidden">
      <section className={"w-full h-fit"}>
        <FolderTopBar />
        <FolderGrid />
      </section>
    </div>
  );
}
