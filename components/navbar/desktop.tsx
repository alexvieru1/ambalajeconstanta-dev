"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "@/lib/shopify/types";
import { SearchNavbar, SearchSkeleton } from "./search";
import { IconShoppingCart } from "@tabler/icons-react";
import { Logo } from "../logo";
import { motion, AnimatePresence } from "framer-motion";

type DesktopNavbarProps = {
  menu: Menu[];
};

export const DesktopNavbar = ({ menu }: DesktopNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Menu | null>(null);

  const pathname = usePathname();

  // Extract menu items
  const produseItem = menu.find((item) => item.title === "Produse");
  const categories = produseItem?.children ?? [];

  // Safe destructure children of activeCategory
  const children = activeCategory?.children ?? [];

  // Auto-close menu on route change
  useEffect(() => {
    setIsOpen(false);
    setActiveCategory(null);
  }, [pathname]);

  // Toggle menu and auto-select first category
  const handleToggleMenu = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      if (newState && categories.length > 0) {
        setActiveCategory(categories[0]);
      } else {
        setActiveCategory(null);
      }
      return newState;
    });
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b shadow-sm">
      {/* TOP NAVBAR */}
      <div className="hidden md:flex justify-between items-center px-6 py-4">
        {/* LEFT: Menu Button + Logo */}
        <div className="flex items-center gap-4 2xl:ml-20">
          <button
            onClick={handleToggleMenu}
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
              <motion.path
                fill="transparent"
                strokeWidth="2"
                stroke="currentColor"
                strokeLinecap="round"
                variants={{
                  closed: { d: "M 2 5 L 22 5" },
                  open: { d: "M 4 4 L 20 20" },
                }}
              />
              <motion.path
                fill="transparent"
                strokeWidth="2"
                stroke="currentColor"
                strokeLinecap="round"
                variants={{
                  closed: { d: "M 2 12 L 22 12", opacity: 1 },
                  open: { opacity: 0 },
                }}
                transition={{ duration: 0.1 }}
              />
              <motion.path
                fill="transparent"
                strokeWidth="2"
                stroke="currentColor"
                strokeLinecap="round"
                variants={{
                  closed: { d: "M 2 19 L 22 19" },
                  open: { d: "M 4 20 L 20 4" },
                }}
              />
            </motion.svg>
          </button>

          <Logo />
        </div>

        {/* CENTER: Search */}
        <div className="flex-1 flex justify-center px-4">
          <div className="w-full max-w-2xl">
            <Suspense fallback={<SearchSkeleton />}>
              <SearchNavbar />
            </Suspense>
          </div>
        </div>

        {/* RIGHT: Cart Icon */}
        <div className="ml-auto 2xl:mr-20">
          <Link href="/cart">
            <IconShoppingCart className="w-6 h-6 text-black hover:text-green-600 transition" />
          </Link>
        </div>
      </div>

      {/* DROPDOWN MEGA MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden md:block bg-white border-t shadow-md w-full"
          >
            <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-3 gap-8">
              {/* General Pages */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-gray-900">
                  General
                </h4>
                <ul className="space-y-2">
                  {menu.map((page) => (
                    <li key={page.title}>
                      <Link
                        href={page.path}
                        className="text-gray-700 hover:text-green-600 transition"
                      >
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-gray-900">
                    Categorii produse
                  </h4>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category.title} className="group">
                        <Link
                          href={category.path}
                          onMouseEnter={() => setActiveCategory(category)}
                          onFocus={() => setActiveCategory(category)}
                          className="block text-gray-700 hover:text-green-600 transition"
                        >
                          {category.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Subcategories (with animation) */}
              <div>
                <AnimatePresence mode="wait">
                  {children.length > 0 && (
                    <motion.div
                      key={activeCategory?.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="text-sm font-semibold mb-3 text-gray-900">
                        {activeCategory?.title}
                      </h4>
                      <ul className="space-y-2">
                        {children.map((sub) => (
                          <li key={sub.title}>
                            <Link
                              href={sub.path}
                              className="text-gray-700 hover:text-green-600 transition"
                            >
                              {sub.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
