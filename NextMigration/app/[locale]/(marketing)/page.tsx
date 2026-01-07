import { redirect } from "next/navigation";
import WelcomePage from "@/app/[locale]/(marketing)/(landing_info)/welcome/page";

export default function MarketingPage() {
   return (<WelcomePage />);
}