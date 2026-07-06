import { Link, Outlet } from "react-router-dom";
import PageContainer from "./components/PageContainer";

export default function Layout() {
  return (
    <div>
      <header
        className={
          "w-full h-15 font-roboto px-10 flex items-center justify-between border-b border-neutral-200"
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
      <main style={{ padding: 16 }}>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </main>
    </div>
  );
}
