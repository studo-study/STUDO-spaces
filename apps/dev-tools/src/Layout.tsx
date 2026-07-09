import { Link, Outlet } from "react-router-dom";
import PageContainer from "./components/PageContainer";

export default function Layout() {
  return (
    <div
      className={
        "bg-neutral-100 dark:bg-gray-900 dark:text-white w-screen h-screen"
      }
    >
      <header
        className={
          "w-full h-15 font-roboto px-10 flex items-center justify-between border-b dark:border-white/50 border-neutral-200"
        }
      >
        <Link to="/" className={"hover:underline"}>
          Dev Tools
        </Link>
        <nav style={{ display: "flex", gap: 12, padding: 16 }}>
          <Link to="/icons" className={"hover:underline"}>
            Icons
          </Link>
        </nav>
      </header>
      <main>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </main>
    </div>
  );
}
