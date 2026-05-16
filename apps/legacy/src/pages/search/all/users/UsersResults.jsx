import { t } from "i18next";

export default function UsersResults({ users, toggleUsers }) {
  users = {};

  return (
    <div className="w-full flex flex-col justify-between items-center">
      <div className="w-full h-fit flex flex-row justify-between items-center">
        <span>{t("Users")}:</span>
        <span
          onClick={toggleUsers}
          className="cursor-pointer font-semibold text-studogrey"
        >
          {t("show alle users")}
        </span>
      </div>
      <div className="w-full h-fit row-span-1 col-span-5">
        {users.map((user, i) => UserItem(user))}
      </div>
    </div>
  );
}

function UserItem(user) {
  return <div className="w-full h-35 rounded-2xl bg-studogrey"></div>;
}
