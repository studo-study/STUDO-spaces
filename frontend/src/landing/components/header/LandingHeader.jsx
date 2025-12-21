import TriggerMethods from "./dropdownmethods/TriggerMethods.jsx";
import TriggerTools from "./dropdowntools/TriggerTools.jsx";
import { Link } from "react-router-dom";
import { t } from "i18next";
import { useState } from "react";
import { Menu, X } from "react-feather";

export default function LandingHeader() {
  const [MethodsOpen, setMethodsOpen] = useState(false);
  const [ToolsOpen, setToolsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className="w-screen h-20 md:h-25 fixed top-0 left-0 right-0 z-[999]
      bg-white dark:bg-[#182536] border-b border-solid border-studogrey/20
      flex items-center justify-between px-4 sm:px-8 lg:px-20"
    >
      <div className="flex items-center justify-start gap-6 md:gap-10 flex-1">
        <Link to={"/welcome"}
              className="font-akira text-emerald-400 dark:text-white text-3xl md:text-4xl whitespace-nowrap">
          STUDO
        </Link>

        <nav className="hidden md:flex flex-row gap-10 items-center">
          <TriggerMethods MethodsOpen={MethodsOpen} setMethodsOpen={setMethodsOpen} />
          <TriggerTools ToolsOpen={ToolsOpen} setToolsOpen={setToolsOpen} />
        </nav>
      </div>

      <div className="flex items-center justify-end gap-4 md:gap-5 flex-1">
        <div className="hidden md:flex items-center gap-5">
          <Link
            to={"/login"}
            className="inline-flex font-semibold text-white
            flex-row gap-2 justify-center items-center p-2 pl-7 pr-7 rounded-4xl cursor-pointer
            active:scale-105 transition-transform z-[2]
            border-[0.5px] border-solid border-[#8181812f]
            shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
            dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
            bg-emerald-400 dark:bg-white dark:text-studodarkblue"
          >
            {t("Log In")}
          </Link>
          <Link
            to={"/register"}
            className="font-semibold text-studodarkblue dark:text-white hover:underline"
          >
            {t("Create Account")}
          </Link>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-studodarkblue dark:text-white p-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 top-20 z-50 bg-white dark:bg-[#182536] md:hidden flex flex-col">

          <div className="px-6 pt-10 pb-8 flex flex-col gap-4">
            <Link
              to={"/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex font-semibold text-white justify-center items-center py-4 rounded-4xl cursor-pointer
              active:scale-105 transition-transform
              border-[0.5px] border-solid border-[#8181812f]
              shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
              dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
              bg-emerald-400 dark:bg-white dark:text-studodarkblue"
            >
              {t("Log In")}
            </Link>
            <Link
              to={"/register"}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center font-semibold text-studodarkblue dark:text-white py-4 hover:underline"
            >
              {t("Create Account")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}