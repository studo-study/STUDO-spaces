import { t } from "i18next";
import { useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ALlPage from "./all/All.jsx";
import SkeletonSearch from "../../components/skeletons/search/SkeletonSearch.jsx";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export default function Search() {
  const id = import.meta.env.VITE_USER_ID;
  const { t } = useTranslation();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  let searchResult = location.state?.results || null;

  const { data: searchData, isLoading: isSearchLoading } = useSWR(
    query && !searchResult ? `search/${id}/${query}` : null
  );

  if (!searchResult && searchData) {
    searchResult = searchData;
  }

  const [all, setAll] = useState(true);
  const [loading, setLoading] = useState(!searchResult);
  const [sets, setSets] = useState(false);
  const [users, setUsers] = useState(false);
  const [classrooms, setClassrooms] = useState(false);

  useEffect(() => {
    if (searchResult) {
      setLoading(false);
    }
  }, [searchResult]);

  const toggleAll = () => {
    setAll(true);
    setSets(false);
    setUsers(false);
    setClassrooms(false);
  };

  return (
    <div
      className="w-full flex flex-col items-center justify-center pt-20 mt-10 md:mt-0 sm:pt-25 md:pt-35 px-4 sm:px-6 lg:px-8">
      <div className="flex w-full sm:w-11/12 md:w-4/5 lg:w-3/5 flex-col items-center justify-center gap-3">
        <span className="w-full flex text-xs sm:text-sm flex-baseline mb-3 sm:mb-5 gap-1 flex-wrap">
          {t("results for")}
          <span className="text-emerald-400 italic cursor-pointer font-bold break-all">{query}</span>
        </span>
        <div className="w-full flex flex-col gap-2">
          <div className="w-full h-10 flex flex-row p-0">
            <div
              className={`w-full h-6 flex justify-baseline ${all ? "font-bold" : ""} 
                items-center text-studodarkblue text-sm sm:text-base
                transition-transform transition-colors duration-300 dark:text-white
                aria-[current=page]:font-bold cursor-pointer text-studoblue dark:text-green-300`}
              onClick={toggleAll}>
              {t("All Results")}
            </div>
          </div>
          <div className="w-full h-0.5 sm:h-1 bg-studogrey rounded-full mb-3 sm:mb-5"></div>
          <div className="w-full h-fit mb-20 sm:mb-30">
            {loading || isSearchLoading ? (
              <SkeletonSearch />
            ) : (
              <ALlPage query={query} result={searchResult} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}