import { useTranslation } from "react-i18next";
import Save from "../../assets/icons/save.svg";
import Saved from "../../assets/icons/saved.svg";
import Classroom from "../../assets/icons/classroom.svg";
import Share from "../../assets/icons/share.svg";
import Settings from "../../assets/icons/settings.svg";
import Love from "../../assets/icons/love.svg";
import Loved from "../../assets/icons/loved.svg";
import Pencil from "../../assets/icons/pencil.svg";
import Clock from "../../assets/icons/clock.svg";
import Card from "../../assets/icons/cards.svg";
import Folder from "../../assets/icons/folder.svg";
import "animate.css";
import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { Link, useParams } from "react-router-dom";
import Flashcard from "./flashcard/Flashcard.jsx";
import Progress from "./progress/Progress.jsx";
import SavePopUp from "./save/SavePopUp.jsx";
import CardItem from "./card/CardItem.jsx";
import ClassroomPopup from "./classroom/ClassroomPopup.jsx";
import SharePopup from "./share/SharePopup.jsx";
import SettingsPopup from "./settings/SettingsPopup.jsx";
import { save, del, put } from "../../api/index.js";
import { useAuth } from "../../contexts/auth.js";
import { PiStudent } from "react-icons/pi";

export default function Studyset() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();

  const { data: set = {}, isLoading, error } = useSWR(`studysets/${id}`);
  const { data: foldersData = { folders: [] }, isLoading: foldersLoading } = useSWR("folders");

  const { trigger: triggerLike } = useSWRMutation(`studysets/${id}/likes`, save);
  const { trigger: triggerUpdateFolder } = useSWRMutation(`studysets/${id}/folder`, put);

  const [saved, setSaved] = useState(false);
  const [popUpToggle, setPopUpToggle] = useState(false);
  const [loved, setLoved] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [loveCounter, setLoveCounter] = useState(0);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedClassrooms, setSelectedClassrooms] = useState([]);
  const [currentFolderName, setCurrentFolderName] = useState("");
  const [shownCards, setShownCards] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [classroomPopupToggle, setClassroomPopupToggle] = useState(false);
  const [settingsPopupToggle, setSettingsPopupToggle] = useState(false);
  const [sharePopupToggle, setSharePopupToggle] = useState(false);

  useEffect(() => {
    if (!isLoading && set && set.likes && user) {
      const userHasLiked = set.likes.some((like) => user.id === like.user_id);
      setLoved(userHasLiked);
      setLoveCounter(set.likes.length || 0);
    }
  }, [set, isLoading, user]);

  useEffect(() => {
    if (set && set.cards) {
      setShownCards(set.cards);
    }
    if (set && set.folder_id) {
      setSelectedFolder(set.folder_id);
      setSaved(true);
    }
    if (set && set.classrooms) {
      const classroomIds = Array.isArray(set.classrooms)
        ? set.classrooms.map(c => c.id).filter(Boolean)
        : [];
      setSelectedClassrooms(classroomIds);
    }
  }, [set]);

  useEffect(() => {
    if (!foldersLoading && foldersData.folders && selectedFolder) {
      const folder = foldersData.folders.find((f) => f.id === selectedFolder);
      if (folder) {
        setCurrentFolderName(folder.name || folder.title);
      }
    }
  }, [foldersData, foldersLoading, selectedFolder]);

  const isOwner = user && set && user.id === set.user_id;

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-xl">{t("Loading...")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">{t("Error loading set")}</div>
      </div>
    );
  }

  if (!set || !set.cards) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-xl">{t("Set not found")}</div>
      </div>
    );
  }

  const cards = set.cards;

  const toggleSaveFolder = async (folderId) => {
    try {
      await triggerUpdateFolder({
        user_id: user.id,
        set_id: set.id,
        destinationFolder_id: folderId
      });
      setSelectedFolder(folderId);
      setSaved(true);
      const folder = foldersData.folders.find((f) => f.id === folderId);
      if (folder) {
        setCurrentFolderName(folder.name);
      }
      mutate(`studysets/${id}`);
    } catch (error) {
    }
  };

  const toggleSaveClassroom = async (classroomId) => {
    const isCurrentlySelected = selectedClassrooms.includes(classroomId);

    try {
      if (isCurrentlySelected) {
        await del(`classrooms/${classroomId}/sets/${id}`, { arg: null });
        setSelectedClassrooms(prev => prev.filter(cId => cId !== classroomId));
      } else {
        await save(`classrooms/${classroomId}/sets/${id}`, { arg: {} });
        setSelectedClassrooms(prev => [...prev, classroomId]);
      }
      mutate(`studysets/${id}`);
    } catch (error) {
      if (isCurrentlySelected) {
        setSelectedClassrooms(prev => [...prev, classroomId]);
      } else {
        setSelectedClassrooms(prev => prev.filter(cId => cId !== classroomId));
      }
    }
  };

  const toggleLoved = async () => {
    try {
      if (!loved) {
        setAnimate(true);
        setTimeout(() => setAnimate(false), 700);
        setLoveCounter((prev) => prev + 1);
        setLoved(true);
        await triggerLike({});
      } else {
        setLoveCounter((prev) => prev - 1);
        setLoved(false);
        await del(`studysets/${id}/likes`, {});
      }
      mutate(`studysets/${id}`);
    } catch (error) {
      setLoved((prev) => !prev);
      setLoveCounter((prev) => (loved ? prev + 1 : prev - 1));
    }
  };

  const toggleNotStudied = () => {
    if (activeFilter === "notStudied") {
      setShownCards(cards);
      setActiveFilter(null);
    } else {
      const filtered = cards.filter((card) => {
        const sessionCard = set.session?.cards?.find((sc) => sc.card_id === card.id);
        return !sessionCard || sessionCard.card_viewcount === 0;
      });
      setShownCards(filtered);
      setActiveFilter("notStudied");
    }
  };

  const toggleReviewed = () => {
    if (activeFilter === "reviewed") {
      setShownCards(cards);
      setActiveFilter(null);
    } else {
      const filtered = cards.filter((card) => {
        const sessionCard = set.session?.cards?.find((sc) => sc.card_id === card.id);
        return sessionCard && sessionCard.card_viewcount === 1;
      });
      setShownCards(filtered);
      setActiveFilter("reviewed");
    }
  };

  const toggleStudied = () => {
    if (activeFilter === "studied") {
      setShownCards(cards);
      setActiveFilter(null);
    } else {
      const filtered = cards.filter((card) => {
        const sessionCard = set.session?.cards?.find((sc) => sc.card_id === card.id);
        return sessionCard && sessionCard.card_viewcount >= 2;
      });
      setShownCards(filtered);
      setActiveFilter("studied");
    }
  };

  const togglePopUp = () => setPopUpToggle((prev) => !prev);
  const toggleClassroom = () => setClassroomPopupToggle((prev) => !prev);
  const toggleShare = () => setSharePopupToggle((prev) => !prev);
  const toggleSettings = () => setSettingsPopupToggle((prev) => !prev);

  const handleCardUpdate = async (cardId, term, definition) => {
    try {
      const updatedCards = cards.map((card) => {
        if (card.id === cardId) {
          return { id: card.id, term: term, definition: definition, number: card.number };
        }
        return { id: card.id, term: card.term, definition: card.definition, number: card.number };
      });

      await put(`studysets/${id}`, { arg: { cards: updatedCards } });
      mutate(`studysets/${id}`);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div
      className="w-screen mt-10 md:mt-0 min-h-screen flex flex-col items-center justify-baseline pt-20 sm:pt-25 md:pt-35 px-4 sm:px-6 lg:px-8">
      <div className="flex w-full sm:w-11/12 md:w-4/5 lg:w-3/5 max-w-[700px]
        flex-col items-center justify-center gap-3 sm:gap-4">

        <div
          className="w-full h-fit flex flex-row items-center justify-baseline gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
          <span>{t("Created by")}</span>
          <Link to={`/profile/${set.user_id}`} className="flex flex-row w-fit h-fit rounded-full sm:rounded-4xl
            gap-1.5 sm:gap-2 p-1.5 sm:p-2 pl-3 sm:pl-4 pr-3 sm:pr-5 bg-studodark max-w-fit
            dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
            border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
            shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
            dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
            dark:text-white min-w-0">
            <div
              className="min-h-4 max-h-4 min-w-4 justify-center items-center flex max-w-4 sm:min-h-5 sm:max-h-5 sm:min-w-5 sm:max-w-5 bg-emerald-400 overflow-hidden rounded-full flex-shrink-0">
              {set.img_url === "default" ? <PiStudent size={10} color={"white"} /> :
                <img src={set.img_url} alt="pfp" className="w-full h-full object-cover" />}
            </div>
            <span className="opacity-50 text-xs sm:text-sm truncate hover:underline">
              @{set.displayName}
            </span>
          </Link>
        </div>

        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <span className="w-full sm:w-2/3 flex flex-row items-center justify-baseline
            text-2xl sm:text-3xl md:text-4xl font-atrament font-semibold truncate">
            {set.title || t("Untitled Set")}
          </span>
          <div
            className="w-full sm:w-1/3 flex h-full gap-2 sm:gap-3 flex-row items-center justify-start sm:justify-end flex-wrap">
            {isOwner && (
              <div className="inline-flex flex-row items-center gap-[0.6em] min-h-9 min-w-9 sm:min-h-10 sm:min-w-10
                font-atrament font-normal text-[#2a3a42] justify-center
                rounded-full bg-[#e7e7e747] cursor-pointer select-none
                dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
                border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
                shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
                dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                dark:text-white"
                   onClick={togglePopUp}>
                <img src={saved && selectedFolder ? Saved : Save} alt=""
                     className="h-4 sm:h-5 dark:invert dark:brightness-0" />
              </div>
            )}

            <div className="inline-flex flex-row items-center gap-[0.6em] min-h-9 min-w-9 sm:min-h-10 sm:min-w-10
              font-normal text-[#2a3a42] justify-center rounded-full bg-[#e7e7e747] cursor-pointer
              dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
              border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
              shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
              dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
              dark:text-white" onClick={toggleClassroom}>
              <img src={Classroom} alt="" className="h-4 sm:h-5 dark:invert dark:brightness-0" />
            </div>

            <div className="inline-flex flex-row items-center gap-[0.6em] min-h-9 min-w-9 sm:min-h-10 sm:min-w-10
              font-atrament font-normal text-[#2a3a42] justify-center rounded-full bg-[#e7e7e747] cursor-pointer
              dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
              border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
              shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
              dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
              dark:text-white" onClick={toggleShare}>
              <img src={Share} alt="" className="h-4 sm:h-5 dark:invert dark:brightness-0" />
            </div>

            <div className="inline-flex flex-row items-center gap-[0.6em] min-h-9 min-w-9 sm:min-h-10 sm:min-w-10
              font-atrament font-normal text-[#2a3a42] justify-center rounded-full bg-[#e7e7e747] cursor-pointer
              dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
              border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
              shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
              dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
              dark:text-white" onClick={toggleSettings}>
              <img src={Settings} alt="" className="h-4 sm:h-5 dark:invert dark:brightness-0" />
            </div>
          </div>
        </div>

        <SavePopUp
          toggled={popUpToggle}
          toggleSave={toggleSaveFolder}
          saved={saved}
          selectedFolder={selectedFolder}
          setPopUpToggle={setPopUpToggle}
        />
        <ClassroomPopup
          toggleSave={toggleSaveClassroom}
          selectedClassrooms={selectedClassrooms}
          toggled={classroomPopupToggle}
          setPopUpToggle={setClassroomPopupToggle}
        />
        <SharePopup
          toggled={sharePopupToggle}
          id={set.id}
          title={set.title}
          setPopUpToggle={setSharePopupToggle}
        />
        <SettingsPopup
          toggled={settingsPopupToggle}
          setPopUpToggle={setSettingsPopupToggle}
          isOwner={isOwner}
          isPublic={set.public_set}
          sessionId={set.session?.id}
          setId={id}
        />

        {isOwner && selectedFolder && currentFolderName && (
          <div className="w-full h-fit flex flex-row items-center gap-2 text-xs sm:text-sm opacity-70 flex-wrap">
            <img src={Folder} alt="" className="h-3 sm:h-4 dark:invert dark:brightness-0 flex-shrink-0" />
            <span className="truncate">{t("Saved in")}: {currentFolderName}</span>
          </div>
        )}

        {set.classrooms && set.classrooms.length > 0 && (
          <div className="w-full h-fit flex flex-row items-center gap-2 text-xs sm:text-sm opacity-70 flex-wrap">
            <img src={Classroom} alt="" className="h-3 sm:h-4 dark:invert dark:brightness-0 flex-shrink-0" />
            <span className="truncate">
              {t("Added to")}: {set.classrooms.map(c => c.name).join(", ")}
            </span>
          </div>
        )}

        {!isOwner ? (
          <div className="w-full h-fit gap-2 flex flex-row justify-baseline items-center flex-wrap">
            <div className="w-fit flex flex-row cursor-pointer gap-1.5 sm:gap-2 inline-flex items-center"
                 onClick={toggleLoved}>
              <img src={loved ? Loved : Love} alt="" className={`h-5 sm:h-6 cursor-pointer dark:opacity-50 
                dark:invert dark:brightness-0 flex-shrink-0
                ${loved ? "" : "opacity-50"} 
                ${animate ? "animate__animated animate__rubberBand" : ""}`} />
              <span className="opacity-50 truncate select-none text-xs sm:text-sm">
                {formatter(loveCounter)} {loveCounter === 1 ? t("person loved this set") : t("people loved this set")}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full h-fit gap-2 flex flex-row justify-baseline items-center flex-wrap">
            <img src={Love} alt="" className="h-4 sm:h-5 opacity-50 dark:invert dark:brightness-0 flex-shrink-0" />
            <span className="opacity-50 truncate select-none text-xs sm:text-sm">
              {formatter(loveCounter)} {loveCounter === 1 ? t("like") : t("likes")}
            </span>
          </div>
        )}

        <div className="w-full h-fit flex flex-col gap-6 sm:gap-8 md:gap-10 justify-center items-center">
          <div className="w-full grid gap-3 sm:gap-4 md:gap-5 grid-cols-1 sm:grid-cols-3">
            <Link to={`/learn/${set.id}`} className="w-full">
              <div className="inline-flex flex-row items-center gap-2 sm:gap-3 min-h-10 sm:min-h-12 w-full
                font-normal text-[#2a3a42] justify-center rounded-2xl bg-[#e7e7e747] cursor-pointer
                dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
                border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
                shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
                dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                dark:text-white px-4 sm:px-8 font-atrament text-base sm:text-lg md:text-xl">
                <img src={Pencil} alt="" className="h-4 sm:h-5 dark:invert dark:brightness-0 flex-shrink-0" />
                <span className="truncate">{t("learn").toUpperCase()}</span>
              </div>
            </Link>
            <Link to={`/speedy/${set.id}`} className="w-full">
              <div className="inline-flex flex-row items-center gap-2 sm:gap-3 min-h-10 sm:min-h-12 w-full
                font-normal text-[#2a3a42] justify-center rounded-2xl bg-[#e7e7e747] cursor-pointer
                dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
                border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
                shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
                dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                dark:text-white px-4 sm:px-8 font-atrament text-base sm:text-lg md:text-xl">
                <img src={Clock} alt="" className="h-4 sm:h-5 dark:invert dark:brightness-0 flex-shrink-0" />
                <span className="truncate">{t("speedy").toUpperCase()}</span>
              </div>
            </Link>
            <Link to={`/flashcards/${set.id}`} className="w-full">
              <div className="inline-flex flex-row items-center gap-2 sm:gap-3 min-h-10 sm:min-h-12 w-full
                font-normal text-[#2a3a42] justify-center rounded-2xl bg-[#e7e7e747] cursor-pointer
                dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
                border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
                shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
                dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                dark:text-white px-4 sm:px-8 font-atrament text-base sm:text-lg md:text-xl">
                <img src={Card} alt="" className="h-4 sm:h-5 dark:invert dark:brightness-0 flex-shrink-0" />
                <span className="truncate">{t("flashcards").toUpperCase()}</span>
              </div>
            </Link>
          </div>

          <Flashcard Cards={cards} />
          <hr className="w-full border-0.5 border-solid border-gray-500 mt-3 sm:mt-5 mb-1 sm:mb-2" />
          <span className="w-full h-fit mb-2 sm:mb-3 font-bold text-sm sm:text-base">{t("Your Progress:")}</span>

          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            <Progress
              type={t("Not Studied")}
              percent={calcProgress(set.session?.cards || [])[0]}
              onClick={toggleNotStudied}
              active={activeFilter === "notStudied"}
            />
            <Progress
              type={t("Reviewed")}
              percent={calcProgress(set.session?.cards || [])[1]}
              onClick={toggleReviewed}
              active={activeFilter === "reviewed"}
            />
            <Progress
              type={t("Studied")}
              percent={calcProgress(set.session?.cards || [])[2]}
              onClick={toggleStudied}
              active={activeFilter === "studied"}
            />
          </div>

          <hr className="w-full border-0.5 border-solid border-gray-500 mt-3 sm:mt-5 mb-3 sm:mb-5" />

          <div className="w-full h-fit flex flex-col gap-3 sm:gap-4 md:gap-5 mb-8 sm:mb-10">
            {shownCards.map((card, index) => (
              <CardItem
                card={card}
                key={card.id || index}
                index={index}
                isOwner={isOwner}
                onUpdate={handleCardUpdate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatter(likes) {
  if (likes >= 1000000) {
    return (likes / 1000000).toFixed(1) + "m";
  }
  if (likes >= 1000) {
    return (likes / 1000).toFixed(1) + "k";
  }
  return likes;
}

function calcProgress(sessionCards) {
  if (!sessionCards || sessionCards.length === 0) return [100, 0, 0];

  let nstud = 0;
  let rev = 0;
  let stud = 0;

  sessionCards.forEach((card) => {
    if (card.card_viewcount === 0) nstud++;
    else if (card.card_viewcount === 1) rev++;
    else if (card.card_viewcount >= 2) stud++;
  });

  const total = sessionCards.length;

  return [
    Math.round((nstud * 100) / total),
    Math.round((rev * 100) / total),
    Math.round((stud * 100) / total)
  ];
}