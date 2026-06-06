import Image from "next/image";
import { StaticImageData } from "next/image";

interface BlogItemBannerProps {
  reverse?: boolean;
  afbeelding: StaticImageData;
  categorie: string;
  titel: string;
}

export default function BlogItemBanner({
  reverse,
  afbeelding,
  titel,
  categorie,
}: BlogItemBannerProps) {
  return (
    <div
      className={`border-2 rounded-4xl flex h-70 border-studoborder  overflow-hidden ${reverse ? "flex-row-reverse" : "flex-row"}`}
    >
      <div className="relative  w-5/7">
        <Image
          src={afbeelding}
          alt="Studo afbeelding"
          fill
          className={"object-cover"}
        />
      </div>

      <div className={"bg-white text-black w-2/7 flex-col font-bold"}>
        <div className={"text-inherit m-8 font-inherit uppercase"}>{titel}</div>
        <div
          className={
            "whitespace-normal align-center justify-center mx-8 break-normal text-wrap text-inherit font-inherit uppercase"
          }
        >
          {categorie}
        </div>
      </div>
    </div>
  );
}
