import Link from "next/link";

export default function DashboardHeader() {
    return (
        <div className={"w-75 px-5 py-20 flex flex-col gap-5 h-screen bg-gray-950/50"}>
            <Link
                href={"/home"}
                className={"w-full h-15 p-5 rounded-3xl"}>

            </Link>
    </div>)
}