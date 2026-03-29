
import {Metadata} from "next";
import {BsGridFill} from "react-icons/bs";
import {HiOutlineViewList} from "react-icons/hi";
import Grid from "@/components/app/your-files/sets/grid";
import {auth} from "@/auth";

export const metadata:Metadata = {
    title:"Sets | Studo"
}

export default async function SetsPage({params}: {
    params: Promise<{ locale: string; id: string }>
}) {
    const { locale, id } = await params;
    const session = await auth();
    const token = session?.accessToken;
    const data = await fetch(
        `${process.env.AUTH_API_URL}/users/me/studosets`,
        {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 60 },
        }
    ).then(res => res.json());

    console.log(data);
    return(
        <div className="w-full h-full ">
            <Grid data={data}/>
        </div>);
}