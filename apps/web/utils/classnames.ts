import { twMerge } from "tailwind-merge";
import { ClassValue, clsx } from "clsx";

function classNames(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default classNames;
