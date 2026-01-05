import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import made from "../../assets/icons/europe-big.svg";

export default function Footer() {
  const talen = {
    "en": "English",
    "nl": "Nederlands",
	  "fr":"Français",
	  "de":"Deutsch",
	  "es":"Español",
	  "pt":"Português",
	  "it":"Italiano",
	  "hi":"हिन्दी",
	  "bn":"বাংলা",
	  "ru":"Русский",
	  "ja":"日本語",
	  "zh":"中文",
	  "ko":"한국어",


  };

  const selLang = localStorage.getItem("i18nextLng");
  const { t, i18n } = useTranslation();
  return (<div className={"w-full  min-h-15 flex flex-row justify-center items-center"}>
    <div className="flex w-3/5 flex-row items-center justify-between gap-5">
      <div className={"flex flex-row gap-3 cursor-pointer"}>
        <Link to={"/privacy"}>{t("Privacy")}</Link><Link to={"/terms-of-service"}>{t("Terms of Service")}</Link>
      </div>
      <div className={"flex flex-row gap-7"}>
        <Link to={"https://european-union.europa.eu/"}> <img src={made} alt="europe"
                                                             className={"h-12 hidden"} /></Link>
        <select
          className={"flex flex-row gap-3 cursor-pointer"}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {Object.entries(talen).map(([key, value]) => (
            <option selected={selLang === key ? true : false} key={key} value={key}>
              {t(value)}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>);
}

function setLanguage(taal) {
  localStorage.setItem("i18nextLng", taal);
  window.location.reload();

}