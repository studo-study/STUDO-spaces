"use client";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoInformationCircle } from "react-icons/io5";
import { ToastProps } from "@/components/ui/design_system/toast/Toast.types";
import IconButton from "@/components/ui/design_system/button/IconButton";
import { FaCircleCheck } from "react-icons/fa6";
import { MdDangerous } from "react-icons/md";
import { BiSolidErrorCircle } from "react-icons/bi";

const variantStyles = {
  success: "bg-green-500/20 border-green-400/30",
  error: "bg-rose-500/20 border-rose-400/30",
  warning: "bg-yellow-500/20 border-yellow-400/30",
  info: "bg-blue-500/20 border-blue-400/30",
  ghost: "",
};

const variantIcons = {
  success: <FaCircleCheck className={"text-emerald-400"} size={18} />,
  error: <BiSolidErrorCircle className={"text-rose-500"} size={18} />,
  warning: (
    <MdDangerous className={"dark:text-orange-400 text-orange-500"} size={18} />
  ),
  info: <IoInformationCircle className={"text-studoblue"} size={18} />,
};

const Toast = (props: ToastProps) => {
  const { message, variant, duration = 4000, onClose, open = true } = props;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!open) {
      // geen synchrone setState in de effect-body, in een microtask/raf zetten
      const raf = requestAnimationFrame(() => setVisible(false));
      return () => cancelAnimationFrame(raf);
    }
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  useEffect(() => {
    if (!visible || duration <= 0) return;
    const timer = setTimeout(() => handleClose(), duration);
    return () => clearTimeout(timer);
  }, [visible, duration]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  return (
    <div
      role={"status"}
      aria-live={"polite"}
      className={`border shadow-2xl bg-studogrey/50 backdrop-blur-2xl
                      rounded-full border-studoborder/30 text-white
                      min-w-64 max-w-sm h-fit
                      flex items-center gap-3 pl-4 pr-2 py-2
                      transition-all duration-300 ease-out
                      ${
                        visible
                          ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                          : "opacity-0 translate-x-4 scale-95 pointer-events-none"
                      }
                      ${variant ? variantStyles[variant] : ""}
                    `}
    >
      {variant && variantIcons[variant]}
      <span
        className={
          "flex-1 text-sm dark:text-white text-studodarkblue truncate, overflow-hidden"
        }
      >
        {message}
      </span>
      <IconButton icon={<IoClose size={15} />} onClick={handleClose} />
    </div>
  );
};

Toast.displayName = "Toast";
export default Toast;
