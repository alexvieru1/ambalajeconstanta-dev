"use client";

import { DesktopNavbar } from "./desktop";
import MobileNavbar from "./mobile";

export const Navbar = ({ menu }: { menu: any }) => {
  return (
    <>
      <DesktopNavbar menu={menu} />
      <MobileNavbar menu={menu} />
    </>
  );
};
