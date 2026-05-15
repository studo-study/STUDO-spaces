import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-screen h-screen flex flex-col gap-3 justify-center items-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="block w-90 h-90 backface-visibility-hidden border-none outline-none dark:hue-rotate-60"
      >
        <source src="/animations/Error.webm" type="video/webm" />
      </video>
      <span className="font-atrament dark:text-white  text-2xl">
        {"404".toUpperCase()}
      </span>
      <Link href="/welcome">
        <div
          className="inline-flex flex-row gap-2 justify-center
                     items-center p-2 pl-7 pr-7 font-semibold bg-emerald-400 dark:bg-studoblue dark:text-studodarkblue text-white font-atrament rounded-4xl cursor-pointer"
        >
          {"return".toUpperCase()}
        </div>
      </Link>
    </div>
  );
}
