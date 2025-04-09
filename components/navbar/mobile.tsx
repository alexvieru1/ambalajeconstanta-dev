"use client";

import React, { Suspense, useState } from "react";
import { Menu } from "@/lib/shopify/types";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SearchNavbar, SearchSkeleton } from "./search";
import { IconShoppingCart, IconChevronDown } from "@tabler/icons-react";
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
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const filteredMenu = menu.filter((item) => item.title !== "Acasa");

  return (
    <div className="fixed top-0 left-0 right-0 md:hidden px-4 py-3 flex items-center justify-between border-b z-50 bg-white">
      {/* Hamburger Menu */}
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
      <Logo />

      {/* Shopping Cart */}
      <Link href="/cart">
        <IconShoppingCart className="w-6 h-6 text-gray-600" />
      </Link>

      {/* MENU CONTENT */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full bg-white border-t shadow-md z-40"
          >
            <div className="flex flex-col p-4 space-y-2 max-h-[calc(100vh-60px)] overflow-y-auto">
              {/* Search */}
              <Suspense fallback={<SearchSkeleton />}>
                <SearchNavbar />
              </Suspense>

              {/* Menu Items */}
              {filteredMenu.map((item) => (
                <div key={item.title} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.path}
                      className="text-sm font-medium text-gray-800 hover:underline"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                    {item.children && item.children.length > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleMenu(item.title)}
                        className="text-gray-600 focus:outline-none"
                      >
                        <IconChevronDown
                          className={`w-4 h-4 transition-transform ${
                            openMenus.includes(item.title) ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Child Items */}
                  {item.children &&
                    item.children.length > 0 &&
                    openMenus.includes(item.title) && (
                      <div className="ml-4 space-y-1">
                        {item.children.map((child) => (
                          <div key={child.title} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <Link
                                href={child.path}
                                className="block text-sm text-muted-foreground hover:underline"
                                onClick={() => setIsOpen(false)}
                              >
                                {child.title}
                              </Link>
                              {child.children && child.children.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => toggleMenu(child.title)}
                                  className="text-gray-600 focus:outline-none"
                                >
                                  <IconChevronDown
                                    className={`w-4 h-4 transition-transform ${
                                      openMenus.includes(child.title)
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  />
                                </button>
                              )}
                            </div>

                            {/* Nested Child Items */}
                            {child.children &&
                              child.children.length > 0 &&
                              openMenus.includes(child.title) && (
                                <div className="ml-4 space-y-1">
                                  {child.children.map((subChild) => (
                                    <Link
                                      key={subChild.title}
                                      href={subChild.path}
                                      className="block text-sm text-muted-foreground hover:underline"
                                      onClick={() => setIsOpen(false)}
                                    >
                                      {subChild.title}
                                    </Link>
                                  ))}
                                </div>
                              )}
                          </div>
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
