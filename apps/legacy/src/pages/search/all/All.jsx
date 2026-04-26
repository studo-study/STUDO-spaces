import { t } from "i18next";
import SearchResultItem from "./Item.jsx";
import BestResult from "./best/BestResult.jsx";

export default function ALlPage({ query, result }) {
  const sortedResults = [...result.data].sort((a, b) => b.data.length - a.data.length);

  let direct = vindDirecte(query, sortedResults);
  if (direct.length === 0) direct = null;

  const names = [
    { key: "set", value: t("Sets") },
    { key: "profile", value: t("Users") },
    { key: "classroom", value: t("Classrooms") }
  ];

  return (
    <div className="w-full h-fit flex flex-col gap-4 sm:gap-5">
      {direct && (
        <div className="gap-3 sm:gap-5 flex flex-col">
          <div className="w-full flex flex-row h-10 items-center justify-between">
            <span className="text-sm sm:text-base font-semibold">{t("Best Result")}:</span>
          </div>
          <div className="w-full">
            <BestResult item={direct[0]} />
          </div>
        </div>
      )}

      {sortedResults.map((section) => {
        if (section.data.length === 0) {
          return null;
        }
        return (
          <div key={section.type} className="w-full flex flex-col gap-2 sm:gap-3">
            <div className="w-full flex flex-row h-10 items-center justify-between flex-wrap gap-2">
              <span className="text-sm sm:text-base font-semibold">
                {names.find((item) => item.key === section.type)?.value}:
              </span>
              <span className="font-bold text-emerald-400 cursor-pointer hover:text-emerald-300 text-xs sm:text-sm">
                {t("show all {{type}}s", { type: section.type })}
              </span>
            </div>
            {pageBuilder(section)}
          </div>
        );
      })}
    </div>
  );
}

function pageBuilder(item) {
  if (!item || !item.data || item.data.length === 0) {
    return null;
  }

  return (
    <div className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
      ${item.data.length < 4 ? "sm:grid-rows-1" : "sm:grid-rows-2"} 
      gap-3 sm:gap-4`}>
      {item.data.slice(0, 6).map((dataItem, index) => (
        <SearchResultItem item={dataItem} key={dataItem.id || index} />
      ))}
    </div>
  );
}

function vindDirecte(query, data) {
  const q = query.toLowerCase();

  return data.flatMap((group) => {
    const key =
      group.type === "set" ? "title" :
        group.type === "profile" ? "displayName" :
          group.type === "classroom" ? "name" : null;

    if (!key) return [];
    return group.data.filter((item) => item[key]?.toLowerCase() === q);
  });
}