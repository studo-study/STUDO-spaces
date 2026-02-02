import {redirect} from "next/navigation";
import {useLocale} from "next-intl";

export default function YourFilesPage() {
    const locale = useLocale();
    redirect(`/${locale}/your-files/sets`);
}