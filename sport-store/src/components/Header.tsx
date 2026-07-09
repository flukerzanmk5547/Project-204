import TopBar from "./TopBar";
import NavMenu from "./NavMenu";
import AnnouncementBar from "./AnnouncementBar";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 shadow-sm relative">
      <TopBar />
      <NavMenu />
      <AnnouncementBar />
    </header>
  );
}
