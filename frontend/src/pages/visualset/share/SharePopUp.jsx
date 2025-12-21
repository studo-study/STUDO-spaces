import { useEffect, useRef, useState } from "react";
import Copy from "../../../../public/assets/icons/copy.svg";
import { useTranslation } from "react-i18next";
import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function SharePopUp({ toggled, id, title, setPopUpToggle }) {
  const { t } = useTranslation();
  const popupRef = useRef(null);
  const inputLink = useRef(null);
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://studo.study/visualset/${id}`;

  useEffect(() => {
    if (inputLink.current && shareUrl) {
      inputLink.current.value = shareUrl;
    }
  }, [shareUrl]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopUpToggle(false);
      }
    };

    if (toggled) {
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [toggled, setPopUpToggle]);

  useEffect(() => {
    if (!toggled) {
      setCopied(false);
    }
  }, [toggled]);

  const handlePopupClick = (e) => {
    e.stopPropagation();
  };

  const toggleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      if (inputLink.current) {
        inputLink.current.select();
        inputLink.current.setSelectionRange(0, 99999);
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const shareText = title
    ? t("Check out this visualset: {{title}}", { title })
    : t("Check out this visualset!");

  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
  };

  const openShareWindow = (url, name) => {
    if (name === "email") {
      window.location.href = url;
      return;
    }
    window.open(url, name, "width=600,height=400,menubar=no,toolbar=no");
  };

  return (
    <div
      ref={popupRef}
      onClick={handlePopupClick}
      className={`${toggled ? "opacity-100" : "opacity-0 pointer-events-none"}
        absolute w-[340px] h-fit rounded-4xl z-[99999] mt-107 mr-13
        flex flex-col justify-baseline items-center p-5
        shadow-[8px_8px_16px_#bebebe,_-8px_-8px_16px_rgba(255,255,255,0.5)]
        bg-[rgba(224,224,224,0.2)] backdrop-blur-md
        dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
        transition-all duration-300 gap-3
      `}
    >
      <span className="text-2xl font-atrament font-semibold dark:text-white">
        {t("Share Visualset").toUpperCase()}
      </span>

      {/* Copy link section */}
      <div className="w-full flex flex-col gap-2">
        <span className="text-sm font-medium dark:text-white">{t("Copy link")}</span>
        <div className="w-full flex flex-row justify-between items-center p-4
            bg-studowhite rounded-2xl border-2 border-studowhite shadow-sm">
          <div className="w-full h-fit flex flex-row gap-3 justify-between items-center">
            <input
              type="text"
              ref={inputLink}
              readOnly
              defaultValue={shareUrl}
              className="px-[2vh] h-12 rounded-[50px] text-sm border-0
                bg-gray-300/50 w-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0 text-studodarkblue
                dark:text-white"
              onClick={(e) => e.target.select()}
            />
            <button
              onClick={toggleCopy}
              className={"min-w-12 min-h-12 bg-studoblue rounded-full flex items-center justify-center " +
                "cursor-pointer active:scale-105 transition-transform select-none " +
                "border-2 border-solid border-[#8181812f] border-t-blue-300 border-l-blue-300"}
            >
              {copied ? (
                <span className="text-white text-lg">✓</span>
              ) : (
                <img src={Copy} className="w-5 dark:invert dark:brightness-0" alt="Copy" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full flex items-center gap-3">
        <span className="text-sm font-medium dark:text-white">{t("Or share via:")}</span>
      </div>

      {/* Social share buttons */}
      <div className="w-full flex flex-row justify-between items-center p-4
            bg-studowhite rounded-2xl border-2 border-studowhite shadow-sm">
        <button
          onClick={() => openShareWindow(socialLinks.facebook, "facebook")}
          className="flex items-center justify-center w-12 h-12 rounded-full
            bg-[#1877F2] hover:bg-[#166FE5] text-white cursor-pointer
            shadow-md transition-all duration-300"
          title={t("Share on Facebook")}
        >
          <FaFacebook size={20} />
        </button>

        <button
          onClick={() => openShareWindow(socialLinks.twitter, "twitter")}
          className="flex items-center justify-center w-12 h-12 rounded-full
            bg-[#1DA1F2] hover:bg-[#1A91DA] text-white cursor-pointer
            shadow-md transition-all duration-300"
          title={t("Share on X (Twitter)")}
        >
          <FaTwitter size={20} />
        </button>

        <button
          onClick={() => openShareWindow(socialLinks.whatsapp, "whatsapp")}
          className="flex items-center justify-center w-12 h-12 rounded-full
            bg-[#25D366] hover:bg-[#22C55E] text-white cursor-pointer
            shadow-md transition-all duration-300"
          title={t("Share on WhatsApp")}
        >
          <FaWhatsapp size={20} />
        </button>

        <button
          onClick={() => openShareWindow(socialLinks.linkedin, "linkedin")}
          className="flex items-center justify-center w-12 h-12 rounded-full
            bg-[#0A66C2] hover:bg-[#0958A8] text-white cursor-pointer
            shadow-md transition-all duration-300"
          title={t("Share on LinkedIn")}
        >
          <FaLinkedin size={20} />
        </button>

        <button
          onClick={() => openShareWindow(socialLinks.email, "email")}
          className="flex items-center justify-center w-12 h-12 rounded-full
            bg-gray-500 hover:bg-gray-600 text-white cursor-pointer
            shadow-md transition-all duration-300"
          title={t("Share via Email")}
        >
          <FaEnvelope size={20} />
        </button>
      </div>

      {/* Native share button (mobile) */}
      {navigator.share && (
        <button
          onClick={async () => {
            try {
              await navigator.share({
                title: shareText,
                url: shareUrl
              });
            } catch (error) {
              if (error.name !== "AbortError") {
              }
            }
          }}
          className="w-full p-3 mt-2 text-sm font-medium
            bg-studogrey hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500
            rounded-xl shadow-md transition-all duration-300
            dark:text-white"
        >
          {t("More sharing options...")}
        </button>
      )}
    </div>
  );
}