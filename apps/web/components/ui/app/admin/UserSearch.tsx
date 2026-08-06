"use client";
import { useAdminUser } from "@/hooks/app/admin/useAdminUser";
import { useState } from "react";
import UserCard from "@/components/ui/app/admin/UserCard";
import { useCourseNav } from "@/hooks/app/courses/useCourseNav";

const UserSearch = () => {
  const [credential, setCredential] = useState("");
  const [search, setSearch] = useState("");
  const userQuery = useAdminUser(search);
  useCourseNav([
    {
      title: "admin",
      href: `/admin`,
      isLast: false,
      translate: true,
    },
    {
      title: "users",
      href: `/admin/users`,
      isLast: true,
      translate: true,
    },
  ]);

  return (
    <div className={"w-full h-full flex flex-1 flex-col gap-5"}>
      <div
        className={`min-w-1/3 lg:w-1/2 w-full h-14 flex flex-row items-center  px-7 bg-gray-300/30 dark:bg-gray-500/10
        rounded-full dark:text-white text-studodarkblue focus-within:border-gray-300 border-2 border-gray-400/30 dark:border-studoborder/20`}
      >
        <input
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearch(credential);
            }
          }}
          placeholder="search..."
          className="w-full h-full text-xl outline-none"
        />
      </div>

      <div className={"w-full flex-1 flex flex-col gap-3"}>
        {userQuery.data &&
          userQuery.data.map((user, key) => <UserCard key={key} user={user} />)}
      </div>
    </div>
  );
};

UserSearch.displayName = "UserSearch";
export default UserSearch;
