import { Outlet } from "react-router";
import { BellIcon, GridIcon, KwolLogo } from "./icons";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="shadow-default flex h-[52px] items-center justify-center bg-white px-[114px] md:h-[72px] md:justify-between">
        <div className="flex h-[26px] flex-row md:h-[40px]">
          <KwolLogo />
        </div>
        <div className="hidden flex-row gap-[20px] md:flex">
          <BellIcon />
          <GridIcon />
        </div>
      </header>
      <main className="flex flex-1 items-end justify-center md:items-center">
        <Outlet />
      </main>
    </div>
  );
}
