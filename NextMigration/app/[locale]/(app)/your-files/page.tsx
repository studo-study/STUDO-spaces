import App from "next/app";
import {redirect} from "next/navigation";
import {useLocale} from "next-intl";

export default function YourFilesPage(app: App) {
    const locale = useLocale();
    redirect(`/${locale}/your-files/sets`);
}