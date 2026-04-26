import { useTranslation } from "react-i18next";
import Save from "../../assets/icons/save.svg";
import Saved from "../../assets/icons/saved.svg";
import Classroom from "../../assets/icons/classroom.svg";
import Share from "../../assets/icons/share.svg";
import Settings from "../../assets/icons/settings.svg";
import Love from "../../assets/icons/love.svg";
import Loved from "../../assets/icons/loved.svg";
import Pin from "../../assets/icons/point.svg";
import Identify from "../../assets/icons/pin-icon.svg";
import Folder from "../../assets/icons/folder.svg";
import "animate.css";
import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { Link, useParams } from "react-router-dom";
import Progress from "../studyset/progress/Progress.jsx";
import SavePopUp from "../studyset/save/SavePopUp.jsx";
import ClassroomPopup from "../studyset/classroom/ClassroomPopup.jsx";
import SharePopUp from "./share/SharePopUp.jsx";
import SettingsPopup from "./settings/SettingsPopup.jsx";
import ImageComponent from "./image/Image.jsx";
import PinItem from "./pinitem/PinItem.jsx";
import { save, del, put } from "../../api/index.js";
import { useAuth } from "../../contexts/auth.js";
import { PiStudent } from "react-icons/pi";

export default function Visualset() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();

  const {
    data: visualset = {},
    isLoading,
    error
  } = useSWR(`visualsets/${id}`);


  const {
    data: foldersData = { folders: [] },
    isLoading: foldersLoading
  } = useSWR("folders/me");

  const { trigger: triggerLike } = useSWRMutation(`visualsets/${id}/likes`, save);
  const { trigger: triggerUpdateFolder } = useSWRMutation(`visualsets/${id}/folder`, put);

  const [saved, setSaved] = useState(false);
  const [popUpToggle, setPopUpToggle] = useState(false);
  const [loved, setLoved] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [loveCounter, setLoveCounter] = useState(0);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedClassrooms, setSelectedClassrooms] = useState([]);
  const [currentFolderName, setCurrentFolderName] = useState("");
  const [shownPins, setShownPins] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [classroomPopupToggle, setClassroomPopupToggle] = useState(false);
  const [settingsPopupToggle, setSettingsPopupToggle] = useState(false);
  const [sharePopupToggle, setSharePopupToggle] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const getAllPins = () => {
    if (!visualset?.images) return [];
    return visualset.images.flatMap((img, imgIndex) =>
      (img.pins?.pins || img.pins || []).map(pin => ({
        ...pin,
        imageIndex: imgIndex,
        imageUrl: img.url,
        imageTitle: img.title
      }))
    );
  };

  const pins = getAllPins();

  const getSessionPinData = (pinId) => {
    if (!visualset?.session?.pins) return null;
    return visualset.session.pins.find(sp => sp.pin_id === pinId);
  };

  useEffect(() => {
    if (!isLoading && visualset && visualset.likes && user) {
      const userHasLiked = visualset.likes.some
        ? visualset.likes.some((like) => user.id === like.user_id)
        : (visualset.likes.likes || []).some((like) => user.id === like.user_id);
      setLoved(userHasLiked);
      const likesArray = visualset.likes.likes || visualset.likes || [];
      setLoveCounter(Array.isArray(likesArray) ? likesArray.length : 0);
    }
  }, [visualset, isLoading, user]);

  useEffect(() => {
    if (visualset) {
      setShownPins(pins);
    }
    if (visualset?.folder_id) {
      setSelectedFolder(visualset.folder_id);
      setSaved(true);
    }
    if (visualset?.classrooms) {
      const classroomIds = visualset.classrooms
        ? visualset.classrooms.map(c => c.id).filter(Boolean)
        : [];
      setSelectedClassrooms(classroomIds);
    }
  }, [visualset]);

  useEffect(() => {
    if (!foldersLoading && foldersData.folders && selectedFolder) {
      const folder = foldersData.folders.find((f) => f.id === selectedFolder);
      if (folder) {
        setCurrentFolderName(folder.name || folder.title);
      }
    }
  }, [foldersData, foldersLoading, selectedFolder]);

  const isOwner = user && visualset && user.id === visualset.user_id;

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

  if (!visualset || !visualset.images) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-xl">{t("Set not found")}</div>
      </div>
    );
  }

  const toggleSaveFolder = async (folderId) => {
    try {
      await triggerUpdateFolder({
        user_id: user.id,
        set_id: visualset.id,
        destinationFolder_id: folderId
      });
      setSelectedFolder(folderId);
      setSaved(true);
      const folder = foldersData.folders.find((f) => f.id === folderId);
      if (folder) {
        setCurrentFolderName(folder.name);
      }
      mutate(`visualsets/${id}`);
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
      mutate(`visualsets/${id}`);
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
        await del(`visualsets/${id}/likes`, {});
      }
      mutate(`visualsets/${id}`);
    } catch (error) {
      setLoved((prev) => !prev);
      setLoveCounter((prev) => (loved ? prev + 1 : prev - 1));
    }
  };

  const toggleNotStudied = () => {
    if (activeFilter === "notStudied") {
      setShownPins(pins);
      setActiveFilter(null);
    } else {
      const filtered = pins.filter((pin) => {
        const sessionPin = getSessionPinData(pin.id);
        return !sessionPin || sessionPin.pin_viewcount === 0;
      });
      setShownPins(filtered);
      setActiveFilter("notStudied");
    }
  };

  const toggleReviewed = () => {
    if (activeFilter === "reviewed") {
      setShownPins(pins);
      setActiveFilter(null);
    } else {
      const filtered = pins.filter((pin) => {
        const sessionPin = getSessionPinData(pin.id);
        return sessionPin && sessionPin.pin_viewcount === 1;
      });
      setShownPins(filtered);
      setActiveFilter("reviewed");
    }
  };

  const toggleStudied = () => {
    if (activeFilter === "studied") {
      setShownPins(pins);
      setActiveFilter(null);
    } else {
      const filtered = pins.filter((pin) => {
        const sessionPin = getSessionPinData(pin.id);
        return sessionPin && sessionPin.pin_viewcount >= 2;
      });
      setShownPins(filtered);
      setActiveFilter("studied");
    }
  };

  const togglePopUp = () => setPopUpToggle((prev) => !prev);
  const toggleClassroom = () => setClassroomPopupToggle((prev) => !prev);
  const toggleShare = () => setSharePopupToggle((prev) => !prev);
  const toggleSettings = () => setSettingsPopupToggle((prev) => !prev);


  const handlePinUpdate = async (pinId, definition) => {
    const updatedPins = pins.map((pin) =>
      pin.id === pinId ? { ...pin, definition } : pin
    );

    await put(`visualsets/${id}`, {
      arg: {
        pins: updatedPins.map(pin => ({
          id: pin.id,
          definition: pin.definition,
          number: pin.number,
          imageIndex: pin.imageIndex
        }))
      }
    });

    mutate(`visualsets/${id}`);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-baseline pt-35">
      <div className="flex w-full sm:w-1/2 md:w-5/12 lg:w-5/12 xl:w-2/5 2xl:w-2/5 max-w-[700px]
        flex-col items-center justify-center gap-3 px-4">

        <div className="w-full h-fit flex flex-row items-center justify-baseline gap-3 text-sm">
          {t("Created by")}
          <Link to={`/profile/${visualset.user_id}`} className="flex flex-row w-fit h-fit rounded-4xl
            gap-2 p-2 pl-4 pr-5 bg-studodark max-w-2/5
            dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
            border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
            shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
            dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
            dark:text-white">
            <div className="min-h-5 max-w-5 min-w-5 bg-amber-300 overflow-hidden rounded-full">
              {visualset.img_url === "default" ? <PiStudent size={10} color={"white"} /> :
                <img src={visualset.img_url} alt="pfp" className="w-full h-full object-cover" />}
            </div>
            <span className="opacity-50 text-sm inline-block truncate w-full hover:underline">
              @{visualset.displayName}
            </span>
          </Link>
        </div>

        <div className="w-full flex flex-row items-center justify-around">
          <span className="inline-block w-2/3 flex flex-row items-center justify-baseline
            text-4xl font-atrament font-semibold truncate">
            {visualset.title?.toUpperCase() || t("Untitled Set")}
          </span>
          <div className="w-1/3 flex h-full gap-3 flex-row items-center justify-end relative">
            {isOwner && (
              <div className="inline-flex flex-row items-center gap-[0.6em] min-h-10 min-w-10
                font-atrament font-normal text-[#2a3a42] justify-center
                rounded-[50px] bg-[#e7e7e747] cursor-pointer select-none
                dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
                border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
                shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
                dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                dark:text-white"
                   onClick={togglePopUp}>
                <img src={saved && selectedFolder ? Saved : Save} alt=""
                     className="h-5 dark:invert dark:brightness-0" />
              </div>
            )}

            <div className="inline-flex flex-row items-center gap-[0.6em] min-h-10 min-w-10
              font-normal text-[#2a3a42] justify-center rounded-[50px] bg-[#e7e7e747] cursor-pointer
              dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
              border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
              shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
              dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
              dark:text-white" onClick={toggleClassroom}>
              <img src={Classroom} alt="" className="h-5 dark:invert dark:brightness-0" />
            </div>

            <div className="inline-flex flex-row items-center gap-[0.6em] min-h-10 min-w-10
              font-atrament font-normal text-[#2a3a42] justify-center rounded-[50px] bg-[#e7e7e747] cursor-pointer
              dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
              border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
              shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
              dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
              dark:text-white" onClick={toggleShare}>
              <img src={Share} alt="" className="h-5 dark:invert dark:brightness-0" />
            </div>

            <div className="inline-flex flex-row items-center gap-[0.6em] min-h-10 min-w-10
              font-atrament font-normal text-[#2a3a42] justify-center rounded-[50px] bg-[#e7e7e747] cursor-pointer
              dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
              border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
              shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
              dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
              dark:text-white" onClick={toggleSettings}>
              <img src={Settings} alt="" className="h-5 dark:invert dark:brightness-0" />
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
            <SharePopUp
              toggled={sharePopupToggle}
              id={visualset.id}
              title={visualset.title}
              setPopUpToggle={setSharePopupToggle}
            />
            <SettingsPopup
              toggled={settingsPopupToggle}
              setPopUpToggle={setSettingsPopupToggle}
              isOwner={isOwner}
              isPublic={visualset.public_set}
              sessionId={visualset.session?.id}
              setId={id}
            />
          </div>
        </div>

        {isOwner && selectedFolder && currentFolderName && (
          <div className="w-full h-fit flex flex-row items-center gap-2 text-sm opacity-70">
            <img src={Folder} alt="" className="h-4 dark:invert dark:brightness-0" />
            <span>{t("Saved in")}: {currentFolderName}</span>
          </div>
        )}

        {visualset.classrooms && visualset.classrooms.length > 0 && (
          <div className="w-full h-fit flex flex-row items-center gap-2 text-sm opacity-70">
            <img src={Classroom} alt="" className="h-4 dark:invert dark:brightness-0" />
            <span>
              {t("Added to")}: {visualset.classrooms.map(c => c.name).join(", ")}
            </span>
          </div>
        )}

        {!isOwner ? (
          <div className="w-full h-15 gap-2 flex flex-row justify-baseline items-center">
            <div className="w-fit flex flex-row cursor-pointer gap-2 inline-flex" onClick={toggleLoved}>
              <img src={loved ? Loved : Love} alt="" className={`h-6 cursor-pointer dark:opacity-50 
                dark:invert dark:brightness-0 
                ${loved ? "" : "opacity-50"} 
                ${animate ? "animate__animated animate__rubberBand" : ""}`} />
              <span className="opacity-50 inline-block truncate select-none">
                {formatter(loveCounter)} {loveCounter === 1 ? t("person loved this set") : t("people loved this set")}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full h-10 gap-2 flex flex-row justify-baseline items-center">
            <img src={Love} alt="" className="h-5 opacity-50 dark:invert dark:brightness-0" />
            <span className="opacity-50 inline-block truncate select-none text-sm">
              {formatter(loveCounter)} {loveCounter === 1 ? t("like") : t("likes")}
            </span>
          </div>
        )}

        <div className="w-full h-fit flex flex-col gap-10 justify-center items-center">
          <div className="w-full inline-grid gap-5 grid-cols-2 grid-rows-1">
            <Link to={`/identify/${visualset.id}`}>
              <div className="inline-flex flex-row items-center gap-3 min-h-12 w-full
                font-normal text-[#2a3a42] justify-center
                rounded-2xl bg-[#e7e7e747] cursor-pointer
                dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
                border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
                shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
                dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                dark:text-white pl-8 pr-10 font-atrament text-xl">
                <img src={Identify} alt="" className="h-5 dark:invert dark:brightness-0" />
                {t("identify").toUpperCase()}
              </div>
            </Link>
            <Link to={`/point/${visualset.id}`}>
              <div className="inline-flex flex-row items-center gap-3 min-h-12 w-full
                font-normal text-[#2a3a42] justify-center
                rounded-2xl bg-[#e7e7e747] cursor-pointer
                dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
                border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
                shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
                dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                dark:text-white pl-8 pr-8 font-atrament text-xl">
                <img src={Pin} alt="" className="h-5 dark:invert dark:brightness-0" />
                {t("point").toUpperCase()}
              </div>
            </Link>
          </div>

          <ImageComponent
            images={visualset.images}
            activeImageIndex={activeImageIndex}
            onImageChange={setActiveImageIndex}
          />

          <hr className="w-full border-0.5 border-solid border-gray-500 mt-5 mb-2" />
          <span className="w-full h-fit mb-3 font-bold">{t("Your Progress:")}</span>

          <div className="w-full flex flex-row justify-between items-center gap-5">
            <Progress
              type={t("Not Studied")}
              percent={calcProgress(visualset.session?.pins || [], pins)[0]}
              onClick={toggleNotStudied}
              active={activeFilter === "notStudied"}
            />
            <Progress
              type={t("Reviewed")}
              percent={calcProgress(visualset.session?.pins || [], pins)[1]}
              onClick={toggleReviewed}
              active={activeFilter === "reviewed"}
            />
            <Progress
              type={t("Studied")}
              percent={calcProgress(visualset.session?.pins || [], pins)[2]}
              onClick={toggleStudied}
              active={activeFilter === "studied"}
            />
          </div>

          <hr className="w-full border-0.5 border-solid border-gray-500 mt-5 mb-5" />

          <div className="w-full h-fit flex flex-col gap-5 mb-10">
            {shownPins.map((pin, index) => (
              <PinItem
                pin={pin}
                key={pin.id || index}
                index={index}
                isOwner={isOwner}
                onUpdate={handlePinUpdate}
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

function calcProgress(sessionPins, allPins) {
  if (!allPins || allPins.length === 0) return [100, 0, 0];

  let nstud = 0;
  let rev = 0;
  let stud = 0;

  allPins.forEach((pin) => {
    const sessionPin = sessionPins.find(sp => sp.pin_id === pin.id);
    if (!sessionPin || sessionPin.pin_viewcount === 0) nstud++;
    else if (sessionPin.pin_viewcount === 1) rev++;
    else if (sessionPin.pin_viewcount >= 2) stud++;
  });

  const total = allPins.length;

  return [
    Math.round((nstud * 100) / total),
    Math.round((rev * 100) / total),
    Math.round((stud * 100) / total)
  ];
}