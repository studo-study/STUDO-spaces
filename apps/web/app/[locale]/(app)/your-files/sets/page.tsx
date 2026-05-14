import {Metadata} from "next";
import Grid from "@/components/ui/app/your-files/sets/grid";
import {auth} from "@/auth";

export const metadata:Metadata = {
    title:"Sets | Studo"
}

export default async function SetsPage() {
    const session = await auth();
    const token = session?.accessToken;
    const data = await fetch(
        `${process.env.AUTH_API_URL}/users/me/studosets`,
        {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 60 },
        }
    ).then(res => res.json());
    return(
        <div className="w-full h-full ">
            <Grid data={data}/>
        </div>);
}