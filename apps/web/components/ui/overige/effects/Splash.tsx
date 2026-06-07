import { useEffect, useState } from "react";

const Splash = ({ isOpen }: { isOpen: boolean }) => {
  const beta = true;
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`h-screen dark:bg-bg-dark bg-bg-white w-screen flex items-center justify-center z-[9999999] fixed top-0 left-0 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className={"flex flex-col gap-1"}>
        <div className={"w-fit flex flex-row gap-1"}>
          <span
            className={`font-georgia text-4xl font-bold truncate bg-gradient-to-r from-emerald-500 to-emerald-400 dark:from-white dark:to-blue-200 bg-clip-text text-transparent transition-all duration-300`}
          >
            Studo
          </span>
          {beta && (
            <span
              className={
                "text-emerald-800 dark:text-blue-400 text-sm font-georgia"
              }
            >
              beta
            </span>
          )}
        </div>
        <div></div>
      </div>
    </div>
  );
};

Splash.displayName = "Splash";
export default Splash;
