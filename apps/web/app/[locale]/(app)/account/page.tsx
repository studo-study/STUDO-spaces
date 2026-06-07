import { Metadata } from "next";
import AccountHeader from "@/components/ui/app/private/account/AccountHeader";
import Stats from "@/components/ui/app/private/account/AccountStats";
import AccountGrid from "@/components/ui/app/private/account/AccountGrid";

export const metadata: Metadata = {
  title: "Account | Studo",
};

export default function Page() {
  return (
    <>
      <AccountHeader />
      <Stats />
      <AccountGrid />
    </>
  );
}
