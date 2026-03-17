import {Metadata} from "next";
import CreateStudosetForm from "@/components/app/create-studoset/CreateStudoset";

export const metadata:Metadata = {
    title:"Create Studoset | Studo"
}


export default function CreateStudoset() {

    return (
        <CreateStudosetForm/>
    );
}