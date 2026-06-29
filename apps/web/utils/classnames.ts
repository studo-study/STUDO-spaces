import { twMerge } from "tailwind-merge";
import { ClassValue, clsx } from "clsx";

export function classNames(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default classNames;
