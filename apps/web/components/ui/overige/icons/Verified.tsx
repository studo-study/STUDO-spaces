import { useId } from "react";
import type { SVGProps } from "react";

type VerifiedProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  variant?: "blue" | "gold";
};

const STOPS = {
  blue: [
    { offset: "0", color: "#2c7fff" },
    { offset: "1", color: "#2c4bff" },
  ],
  gold: [
    { offset: "0", color: "#dfb400" },
    { offset: ".52", color: "#ffd500" },
    { offset: "1", color: "#dfb400" },
  ],
} as const;

const Verified = ({ size = 40, variant = "blue", ...props }: VerifiedProps) => {
  const gradientId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 800"
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="65.68"
          y1="400"
          x2="734.32"
          y2="400"
          gradientUnits="userSpaceOnUse"
        >
          {STOPS[variant].map((stop) => (
            <stop
              key={stop.offset}
              offset={stop.offset}
              stopColor={stop.color}
            />
          ))}
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradientId})`}
        d="M350.71,87.46c26.45-29.04,72.13-29.04,98.58,0l34.01,37.34c13.36,14.68,32.57,22.63,52.4,21.71l50.45-2.36c39.23-1.83,71.54,30.47,69.71,69.71l-2.36,50.45c-.93,19.83,7.03,39.04,21.71,52.4l37.34,34.01c29.04,26.45,29.04,72.13,0,98.58l-37.34,34.01c-14.68,13.36-22.63,32.57-21.71,52.4l2.36,50.45c1.83,39.23-30.48,71.54-69.71,69.71l-50.45-2.36c-19.83-.93-39.04,7.03-52.4,21.71l-34.01,37.34c-26.45,29.04-72.13,29.04-98.58,0l-34.01-37.34c-13.37-14.68-32.57-22.63-52.4-21.71l-50.45,2.36c-39.23,1.83-71.54-30.48-69.71-69.71l2.36-50.45c.93-19.83-7.03-39.04-21.71-52.4l-37.34-34.01c-29.04-26.45-29.04-72.13,0-98.58l37.34-34.01c14.68-13.37,22.63-32.57,21.71-52.4l-2.36-50.45c-1.83-39.23,30.47-71.54,69.71-69.71l50.45,2.36c19.83.93,39.04-7.03,52.4-21.71l34.01-37.34Z"
      />
      <path
        d="M300,400l66.67,66.67,133.33-133.33"
        fill="none"
        stroke={variant === "blue" ? "#fff" : "#5c5c5c"}
        strokeWidth="52"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

Verified.displayName = "Verified";
export default Verified;
