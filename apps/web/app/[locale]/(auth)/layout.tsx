import { ReactNode } from "react";
import LinkButton from "@/components/ui/design_system/button/LinkButton";
import { ArrowLeft } from "lucide-react";
import BottomCredits from "@/components/ui/design_system/bottom_credits/BottomCredits";
import Image from "next/image";
import { headers } from "next/headers";
export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = (await headers()).get("x-pathname-clean") ?? "/";
  const isLogin = pathname === "/login";
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
              "min-h-0 lg:max-w-150 flex-1 h-full min-w-0 flex flex-col gap-5 "
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
              "min-h-0 flex-1 max-h-full hidden lg:flex h-full w-full overflow-hidden rounded-3xl bg-bg-dark relative flex-col gap-5"
            }
          >
            <Image
              src={
                isLogin
                  ? "/images/boektoren_upscaled.jpg"
                  : "/images/koepelzaal_upscaled.jpg"
              }
              fill
              sizes={"(min-width: 768px) 50vw, 0px"}
              alt={"login-img"}
              className={"object-cover opacity-75 object-bottom"}
              loading={"eager"}
            />
            <div
              className={
                "absolute right-10 top-5 z-10 flex flex-row items-center"
              }
            >
              <Image
                src={"/logo/hat.svg"}
                alt={"hat"}
                height={0}
                width={0}
                className={"w-15"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
