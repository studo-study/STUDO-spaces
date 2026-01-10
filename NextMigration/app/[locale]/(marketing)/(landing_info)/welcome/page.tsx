import Hero from "@/components/landing_welcome/hero";
import Info from "@/components/landing_welcome/info";
import Stats from "@/components/landing_welcome/stats";

export default function WelcomePage() {
    return(<div className={"flex flex-col gap-10"}>
            <Hero/>
            <Stats/>
            <Info/>
    </div>
    )
}