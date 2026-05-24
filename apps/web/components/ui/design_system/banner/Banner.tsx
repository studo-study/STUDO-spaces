import Image from "next/image";

interface BannerProps {
  children: React.ReactNode;
  banner: string;
}
const Banner = ({ children, banner }: BannerProps) => {
  return (
    <div
      className={
        "w-full pointer-events-none h-60 sm:h-72 md:h-80 relative overflow-hidden rounded-4xl"
      }
    >
      <div
        className={
          "relative min-w-full min-h-full rounded-4xl overflow-hidden h-full"
        }
      >
        {children}
        <Image
          src={banner}
          alt="banner"
          fill
          className="object-cover rounded-3xl"
        />
      </div>
    </div>
  );
};

Banner.displayName = "Banner";
export default Banner;
