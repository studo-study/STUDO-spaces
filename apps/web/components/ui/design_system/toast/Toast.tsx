"use client";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoWarning, IoInformationCircle } from "react-icons/io5";
import { ToastProps } from "@/components/ui/design_system/toast/Toast.types";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { CgDanger } from "react-icons/cg";
import { FaCheckCircle } from "react-icons/fa";

const variantStyles = {
  success: "bg-emerald-400/20 border-studoborder/30",
  error: "bg-rose-500/20 border-studoborder/30",
  warning: "bg-yellow-500/20 border-studoborder/30",
  info: "bg-blue-400/20 border-studoborder/30",
  ghost: "",
};

const variantIcons = {
  success: <FaCheckCircle className={"text-emerald-400"} size={18} />,
  error: <CgDanger className={"text-rose-500"} size={18} />,
  warning: <IoWarning className={"text-yellow-600"} size={18} />,
  info: <IoInformationCircle className={"text-blue-600"} size={18} />,
};

const Toast = (props: ToastProps) => {
  const { message, variant, duration = 4000, onClose, open = true } = props;
  const [visible, setVisible] = useState<boolean>(open);

  useEffect(() => {
    setVisible(open);
  }, [open]);

  useEffect(() => {
    if (!visible || duration <= 0) return;
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <div
      role={"status"}
      aria-live={"polite"}
      className={`border bg-studogrey/30 backdrop-blur-2xl
                      rounded-4xl border-studoborder/30 shadow-3xl
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
          "flex-1 text-sm text-studodarkblue dark:text-white truncate, overflow-hidden"
        }
      >
        {message}
      </span>
      <BaseButton
        size={"icon"}
        variant={"ghost"}
        icon={<IoClose size={15} />}
        onClick={handleClose}
      />
    </div>
  );
};

Toast.displayName = "Toast";
export default Toast;
