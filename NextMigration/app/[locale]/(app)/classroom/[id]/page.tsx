import {Metadata} from "next";

const classroom = {
    id: "2a2 engels"
}
export const metadata:Metadata = {
    title:`${classroom.id} | Studo`
}

export default function Page() {
    return (<div className={"w-full h-full"}></div>);
}