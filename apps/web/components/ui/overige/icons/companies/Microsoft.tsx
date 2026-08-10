import { IconProps } from "@/components/ui/overige/icons/flags/Dutch";

const MicrosoftIcon = ({ size = 40, ...props }: IconProps) => (
  <svg
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    viewBox="0 0 32 32"
    fill="none"
    width={size}
    height={size}
    {...props}
  >
    <rect x="17" y="17" width="10" height="10" fill="#FEBA08" />
    <rect x="5" y="17" width="10" height="10" fill="#05A6F0" />
    <rect x="17" y="5" width="10" height="10" fill="#80BC06" />
    <rect x="5" y="5" width="10" height="10" fill="#F25325" />
  </svg>
);
export default MicrosoftIcon;
