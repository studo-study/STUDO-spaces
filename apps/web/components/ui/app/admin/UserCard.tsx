import { UserResponse } from "@studo/types";
import Avatar from "@/components/ui/design_system/avatar/Avatar";
import { GoDotFill } from "react-icons/go";
import { TbFlameFilled } from "react-icons/tb";
import Link from "next/link";

interface UserCardProps {
  user: UserResponse;
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

const Field = ({ label, children }: FieldProps) => (
  <span className="flex min-w-0 flex-col justify-center">
    <p className="text-xs opacity-50">{label}</p>
    <b className="truncate text-sm">{children}</b>
  </span>
);

const UserCard = ({ user }: UserCardProps) => {
  return (
    <Link
      href={"/backoffice/users/" + user.id}
      className="grid h-20 grid-cols-[auto_1.5fr_2fr_1fr_1fr_1fr] items-center gap-6 rounded-2xl border hover:border-studoborder border-studoborder/30 px-5"
    >
      <Avatar displayName={user.displayName} id={user.id} />

      <Field label="username">{user.displayName}</Field>

      <Field label="email">{user.email}</Field>

      <Field label="role">{user.publicRole}</Field>

      <Field label="streak">
        <span className="flex flex-row items-center gap-1">
          <TbFlameFilled
            className={
              user.streakCount === 0 ? "text-zinc-400" : "text-orange-400"
            }
          />
          {user.streakCount}
        </span>
      </Field>

      <span className="flex min-w-0 flex-col justify-center">
        <p className="text-xs opacity-50">status</p>
        <span
          className={`flex w-fit flex-row items-center justify-center gap-1 rounded-full border border-studoborder/30 pl-1 pr-2 text-sm ${
            user.banned ? "bg-rose-300/30" : "bg-emerald-300/30"
          }`}
        >
          <GoDotFill
            className={user.banned ? "text-rose-500" : "text-emerald-400"}
          />
          {user.banned ? "banned" : "active"}
        </span>
      </span>
    </Link>
  );
};

UserCard.displayName = "UserCard";
export default UserCard;
