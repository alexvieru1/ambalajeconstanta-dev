"use client";

import { DesktopFooter } from "./desktop";
import MobileFooter from "./mobile";

export const Footer = ({ menu }: { menu: any }) => {
  return (
    <>
      <DesktopFooter menu={menu} />
      <MobileFooter menu={menu} />
    </>
  );
};
