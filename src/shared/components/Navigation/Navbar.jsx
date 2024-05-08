import { Menubar } from "primereact/menubar";

export default function Navbar({ handleOpenSbar }) {
  return (
    <>
      <div id="navbar" className="py-3 bg-primary">
        {/* Toggle Sidebar  */}
        <div className="flex lg:hidden">
          <button onClick={() => handleOpenSbar()}>adsads</button>
        </div>
        {/* Profile */}
      </div>
    </>
  );
}
