import { useTranslation } from "react-i18next";
import Stats from "./stats/Stats.jsx";
import Studyset from "../../assets/icons/studyset.svg";
import Cards from "../../assets/icons/cards.svg";
import Time from "../../assets/icons/time.svg";
import Button from "./button/Button.jsx";
import Plus from "../../assets/icons/plus.svg";
import { Link } from "react-router-dom";
import LogOut from "../../assets/icons/logout.svg";
import Delete from "../../assets/icons/delete.svg";
import { useRef, useState } from "react";
import CreatePopUp from "./createpopup/CreatePopUp.jsx";
import SetItem from "./set/SetItem.jsx";
import ProfileHeader from "./header/ProfileHeader.jsx";
import ProfileHeaderSkeleton from "../../components/skeletons/account/ProfileHeaderSkeleton.jsx";
import StatSkeleton from "../../components/skeletons/account/StatSkeleton.jsx";
import SetItemSkeleton from "../../components/skeletons/account/SetItemSkeleton.jsx";
import useSWR from "swr";
import DeleteAccount from "../../components/DeleteAccount.jsx";
import Footer from "../../components/footer/Footer.jsx";

export default function Account() {
  const DeleteBtn = useRef(null);
  const LogOutBtn = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const toggleOpen = () => setIsOpen((isOpen) => !isOpen);
  const closePopup = () => setIsOpen(false);
  const toggleDelete = () => setDeleteOpen((prevState) => !prevState);
  const closeDelete = () => setDeleteOpen(false);

  const { data: user = {}, isLoading, error } = useSWR("users/me");

  const { t, i18n } = useTranslation();

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-baseline pt-20 sm:pt-25 md:pt-35 px-4 sm:px-6 lg:px-8">
      <div
        className="flex w-full sm:w-11/12 md:w-4/5 lg:w-3/5 flex-col items-center justify-center gap-3 sm:gap-4 md:gap-5">
        {
          isLoading ? <ProfileHeaderSkeleton /> : <ProfileHeader user={user} />
        }

        <div className="w-full h-fit flex flex-col gap-3 sm:gap-4 md:gap-5 mb-3 sm:mb-4 md:mb-5">
          <span className="text-xl sm:text-2xl font-bold font-sfpro text-studodarkblue dark:text-white">
            {t("My Stats")}:
          </span>
          {
            isLoading ?
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-between items-stretch">
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
              </div>
              :
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-between items-stretch">
                <Stats svg={Studyset} waarde={user.stats?.totalsets} title={t("Studysets")} />
                <Stats svg={Cards} waarde={user.stats?.cardsLearned} title={t("Cards Studied")} />
                <Stats svg={Time} waarde={user.stats?.timeLearned} title={t("Time Studied")} />
              </div>
          }
        </div>

        <div className="w-full h-fit flex flex-col gap-3 sm:gap-4 md:gap-5">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center relative">
            <span className="text-xl sm:text-2xl font-bold font-sfpro text-studodarkblue dark:text-white">
              {t("My Sets")}:
            </span>

            <div className="relative self-start sm:self-auto">
              <Button onClick={toggleOpen} color="blue" icon={Plus} text={t("New Set")} />
              <CreatePopUp isOpen={isOpen} onClose={closePopup} />
            </div>
          </div>

          {isLoading ?
            <div className="w-full min-h-120 h-fit flex-col flex gap-3 sm:gap-4 md:gap-5">
              <SetItemSkeleton />
              <SetItemSkeleton />
              <SetItemSkeleton />
              <SetItemSkeleton />
              <SetItemSkeleton />
            </div>
            :
            <div className="w-full h-fit max-h-120 h-fit flex-col flex gap-3 sm:gap-4 md:gap-5">
              {user?.lastTen?.slice(0, 5).map((item) => (
                <SetItem key={item.set_id} set={item} />
              ))}
            </div>
          }

          <div className="w-full h-10 flex flex-row justify-end items-center">
            <Link className="text-studodarkblue dark:text-white text-sm sm:text-base" to="/studysets">
              {t("more sets")}
            </Link>
          </div>
        </div>

        <div
          className="w-full h-fit sm:h-20 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between items-stretch sm:items-center mb-6">
          <Link to={"/logout"} className="w-full sm:w-auto">
            <Button to={"/logout"} color={"green"} ref={LogOutBtn} icon={LogOut} text={t("Log Out")} />
          </Link>
          <Button color={"white"} ref={DeleteBtn} icon={Delete} onClick={toggleDelete} text={t("Delete Account")} />
        </div>
        {deleteOpen ? <DeleteAccount deleteOpen={deleteOpen} onClose={closeDelete} /> : ""}
      </div>
      <Footer />
    </div>
  );
}