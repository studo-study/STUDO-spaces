import {getTranslations} from "next-intl/server";
import {auth} from "@/auth";
import ProfileHeader from "@/components/public/profile/ProfileHeader";

interface viewProps {
    id: string;
}
export default async function ProfileView({ id }: viewProps) {
    const t = await getTranslations("studoset");
    const session = await auth();
    console.log(id);
    const token = session?.accessToken;
    const data = await fetch(
        `${process.env.AUTH_API_URL}/profiles/${id}`,
        {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 60 },
        }
    ).then(res => res.json());

    console.log(data);
    return (<div className={'w-full pt-20 h-full flex flex-col items-center justify-baseline'}>
                <div className={'sm:w-11/12 md:w-4/5 lg:w-3/5 max-w-[700px] flex-col items-center justify-center gap-3 sm:gap-5 w-full h-full'}>
                    <ProfileHeader user={data?.profile}/>
                </div>
         </div>)
}