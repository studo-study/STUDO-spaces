import { ReactNode } from "react";
import LinkButton from "@/components/ui/design_system/button/LinkButton";
import { ArrowLeft } from "lucide-react";
import BottomCredits from "@/components/ui/design_system/bottom_credits/BottomCredits";
import Image from "next/image";
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={
        "dark:text-white text-studodarkblue relative min-w-0 min-h-full flex-1 flex"
      }
    >
      <div
        className={
          "z-30 flex flex-col gap-5 min-w-0 min-h-0 flex-1 p-5 bg-white dark:bg-bg-dark"
        }
      >
        <div
          className={
            "min-w-0 min-h-0 flex-1 flex flex-row gap-5 justify-center items-center"
          }
        >
          <div
            className={
              "min-h-0 max-w-150 flex-1 h-full min-w-0 flex flex-col gap-5 "
            }
          >
            <div className={"max-w-fit"}>
              <LinkButton
                href={"/welcome"}
                icon={<ArrowLeft />}
                variant={"hover"}
              />
            </div>
            <div
              className={
                "min-w-0 min-h-0 flex-1 flex justify-center items-center"
              }
            >
              {children}
            </div>
            <BottomCredits />
          </div>
          <div
            className={
              "min-h-0 flex-1 h-full w-full overflow-hidden rounded-3xl bg-bg-dark relative flex flex-col gap-5"
            }
          >
            <div
              className={"absolute right-10 top-5 flex flex-row items-center"}
            >
              <Image
                src={"/logo/hat.svg"}
                alt={"hat"}
                height={0}
                width={0}
                className={"w-15"}
              />
            </div>
            <Image
              src={"/images/aula.jpg"}
              height={4000}
              width={4000}
              alt={"login-img"}
              className={"h-full dark:opacity-50"}
              loading={"eager"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
