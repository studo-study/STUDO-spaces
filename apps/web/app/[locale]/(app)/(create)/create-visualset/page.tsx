import {Metadata} from "next";
import VsHeader from "@/components/ui/app/create-visualset/Vsheader";
import CreateVisualSetForm from "@/components/ui/app/create-visualset/CreateVisualset";

export const metadata:Metadata = {
    title:"Create Visualset | Studo"
}

export default function CreateVisualset() {
    const folders = ['folder1', 'folder2', 'folder3'];
    return (<div>
        <CreateVisualSetForm/>
    </div>);
}