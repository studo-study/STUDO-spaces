import { Metadata } from "next";
import UserSearch from "@/components/ui/app/admin/UserSearch";

export const metadata: Metadata = {
  title: "Admin Dashboard | Studo",
};

export default function UsersPage() {
  return (
    <div className={"w-full h-full flex flex-col gap-5"}>
      <UserSearch />
    </div>
  );
}
