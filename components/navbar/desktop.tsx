"use client";

import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Menu } from "@/lib/shopify/types";
import { SearchNavbar } from "./search";
import { IconShoppingCart } from "@tabler/icons-react";
import { Logo } from "../logo";

type DesktopNavbarProps = {
  menu: Menu[];
};

export const DesktopNavbar = ({ menu }: DesktopNavbarProps) => {
  const filteredMenu = menu.filter((item) => item.title !== "Acasa");
  const redirectHome = menu[0];

  return (
    <nav className="hidden md:flex justify-between items-center px-6 py-4 bg-white border-b">
      {/* LEFT: Logo + Nav links */}
      <div className="flex items-center gap-8 2xl:ml-20">
        <Link href={redirectHome.path} className="flex items-center">
          <Logo/>
        </Link>
        {filteredMenu.map((item) =>
          item.children && item.children.length > 0 ? (
            <Popover key={item.title}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="font-medium">
                  {item.title}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[500px] p-4 bg-white border rounded-md shadow-md">
                <div className="flex flex-col gap-3">
                  {item.children.find((child) => child.title === "Toate") && (
                    <Link
                      href={
                        item.children.find((c) => c.title === "Toate")!.path
                      }
                      className="block p-3 rounded hover:bg-gray-50 transition"
                    >
                      <div className="text-sm font-semibold">Toate</div>
                      <p className="text-xs text-muted-foreground">
                        {
                          item.children.find((c) => c.title === "Toate")!
                            .description
                        }
                      </p>
                    </Link>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    {item.children
                      .filter((child) => child.title !== "Toate")
                      .map((child) => (
                        <Link
                          key={child.title}
                          href={child.path}
                          className="block p-3 rounded hover:bg-gray-50 transition"
                        >
                          <div className="text-sm font-semibold">
                            {child.title}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {child.description}
                          </p>
                        </Link>
                      ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Link
              key={item.title}
              href={item.path}
              className="text-sm font-medium text-black hover:text-green-600 transition"
            >
              {item.title}
            </Link>
          )
        )}
      </div>

      {/* CENTER: Search */}
      <div className="flex-1 flex justify-center px-4">
        <div className="w-full max-w-2xl">
          <SearchNavbar />
        </div>
      </div>

      {/* RIGHT: Cart Icon */}
      <div className="ml-auto 2xl:mr-20 ">
        <Link href="/cart">
          <IconShoppingCart className="w-6 h-6 text-black hover:text-green-600 transition" />
        </Link>
      </div>
    </nav>
  );
};
