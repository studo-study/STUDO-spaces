import { Navigate } from "react-router-dom";
import useSWR from "swr";

export default function ClassroomsRedirect() {
  const { data, isLoading } = useSWR("users/me/classrooms");

  if (isLoading) return null;

  if (data?.classrooms?.length > 0) {
    return (
      <Navigate
        to={`/classrooms/${data.classrooms[0].id}`}
        replace
      />
    );
  }

  return null;
}
