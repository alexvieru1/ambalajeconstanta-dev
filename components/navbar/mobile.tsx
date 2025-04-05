"use client";

import React, { Suspense, useState } from "react";
import { Menu } from "@/lib/shopify/types";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SearchNavbar, SearchSkeleton } from "./search";
import { IconShoppingCart } from "@tabler/icons-react";
import { Logo } from "../logo";

type MobileNavbarProps = {
  menu: Menu[];
};

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="2"
    stroke="currentColor"
    strokeLinecap="round"
    {...props}
  />
);

const MobileNavbar = ({ menu }: MobileNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const filteredMenu = menu.filter((item) => item.title !== "Acasa");
  const redirectHome = menu[0];

  console.log(redirectHome);
  return (
    <div className="md:hidden px-4 py-3 flex items-center justify-between border-b relative z-50 bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-black focus:outline-none"
        aria-label="Toggle menu"
      >
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          animate={isOpen ? "open" : "closed"}
          initial={false}
        >
          <Path
            variants={{
              closed: { d: "M 2 5 L 22 5" },
              open: { d: "M 4 4 L 20 20" },
            }}
          />
          <Path
            variants={{
              closed: { d: "M 2 12 L 22 12", opacity: 1 },
              open: { opacity: 0 },
            }}
            transition={{ duration: 0.1 }}
          />
          <Path
            variants={{
              closed: { d: "M 2 19 L 22 19" },
              open: { d: "M 4 20 L 20 4" },
            }}
          />
        </motion.svg>
      </button>

      {/* LOGO */}
      <Link href={redirectHome.path} className="flex items-center">
        <Logo />
      </Link>

      {/* SHOPPING CART */}
      <Link href="/cart">
        <IconShoppingCart className="w-6 h-6 text-gray-600" />
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full bg-white border-t shadow-md z-40"
          >
            <div className="flex flex-col p-4 space-y-2">
              <Suspense fallback={<SearchSkeleton />}>
                <SearchNavbar />
              </Suspense>
              {filteredMenu.map((item) => (
                <div key={item.title}>
                  <Link
                    href={item.path}
                    className="text-sm font-medium text-gray-800 hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                  {item.children && item.children?.length > 0 && (
                    <div className="ml-3 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.title}
                          href={child.path}
                          className="block text-sm text-muted-foreground hover:underline"
                          onClick={() => setIsOpen(false)}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNavbar;
