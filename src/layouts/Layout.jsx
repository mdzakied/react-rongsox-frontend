import { Outlet } from "react-router-dom";

import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";

export default function Layout() {
  return (
    <>
      <div id="layout">
        <div>Layout for Semeru</div>
        <div id="content">
          <PrimeReactProvider>
            <Outlet />
          </PrimeReactProvider>
        </div>
      </div>
    </>
  );
}
