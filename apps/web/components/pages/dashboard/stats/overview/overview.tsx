interface QuickstatsProps {
    t: any;
}

export default function Overview({t}: QuickstatsProps) {
    const users = [
        {link: "user1", date: new Date().toISOString(), name: "user1", img:"https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"},
        {link: "user1", date: new Date().toISOString(), name: "user1", img:"https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"},
        {link: "user1", date: new Date().toISOString(), name: "user1", img:"https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"},
        {link: "user1", date: new Date().toISOString(), name: "user1", img:"https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"},
        {link: "user1", date: new Date().toISOString(), name: "user1", img:"https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"}
    ];
    return (<div className={"w-full h-full grid grid-rows-2 grid-cols-3 gap-5"}>
            <div className={"col-span-2 row-span-1 w-full h-full rounded-4xl dark:bg-studogrey/10 bg-studogrey border border-studoborder/30 p-7 flex flex-col gap-1"}>
                <span className={"w-full font-bold dark:text-white/50 text-studodarkblue/50 items-baseline flex gap-2 flex-row"}>{t("graphs")}:</span>
                <div className={"w-full h-full"}>

                </div>
            </div>
            <div className={"col-start-3 row-span-2 w-full h-full rounded-4xl dark:bg-studogrey/10 bg-studogrey border border-studoborder/30 p-7 flex flex-col gap-1"}>
                <span className={"w-full font-bold dark:text-white/50 text-studodarkblue/50 items-baseline flex gap-2 flex-row"}>{t("recently_usrs")}:</span>
                <div className={"w-full h-full flex flex-col gap-5 py-5 overflow-y-scroll"}>
                    {users.map((user) => (recently_usrs(user.name, user.link, user.img, user.date)))}
                </div>
            </div>
            <div className={"col-start-1 row-start-2 w-full h-full rounded-4xl dark:bg-studogrey/10 bg-studogrey border  border-studoborder/30 p-7 flex flex-col gap-1"}>
                <span className={"w-full font-bold dark:text-white/50 text-studodarkblue/50 items-baseline flex gap-2 flex-row"}>{t("most_pp_set")}:</span>
            </div>
             <div className={"col-start-2 row-start-2 w-full h-full rounded-4xl dark:bg-studogrey/10 bg-studogrey border border-studoborder/30 p-7 flex flex-col gap-1"}>
                 <span className={"w-full font-bold dark:text-white/50 text-studodarkblue/50 items-baseline flex gap-2 flex-row"}>{t("activity")}:</span>
             </div>
    </div>)
}

function recently_usrs(name: string, url: string, img: string, date: string) {
    return (<div className={"w-full rounded-full h-15 bg-studogrey/10 border shadow-2xl border-studoborder/50"}></div>)

}