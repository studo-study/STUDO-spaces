import PageTitle from "../../components/PageTitle.tsx";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <PageTitle title={"Home"} />
      <div className={"mb-10"}>
        <p>welcome to the Studo dev tools</p>
      </div>
      <div>
        <span className={"section-title"}>Quick actions:</span>
        <div className={"grid grid-cols-3 mt-5"}>
          <Link
            to={"/icons"}
            className={
              "h-100 w-100 border border-neutral-200 text-neutral-800 rounded-3xl flex justify-center items-center"
            }
          >
            Icons
          </Link>
        </div>
      </div>
    </div>
  );
}
