"use client";

import Link from "next/link";
import { getMenu } from "@/lib/shopify";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconRss,
} from "@tabler/icons-react";

type FooterProps = {
  menu: Awaited<ReturnType<typeof getMenu>>;
};

export const DesktopFooter = ({ menu }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="hidden md:block bg-white border-t pt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8 px-6">
        {/* Column 1: Company Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">AMBALAJE CONSTANȚA</h3>
          <p>Bd. Aurel Vlaicu, 163, Constanța</p>
          <p>Telefon: 0722 222 222</p>
          <p>Email: office@ambalajeconstanta.ro</p>
          <div>
            <h4 className="text-sm font-semibold mb-2">
              Rețele de socializare
            </h4>
            <div className="flex gap-3 text-gray-700">
              <Link
                href="https://www.facebook.com/p/Leo-Lory-Ambalaje-100078935673634"
                target="_blank"
              >
                <IconBrandFacebook size={20} />
              </Link>
              <Link
                href="https://www.instagram.com/ambalaje.constanta"
                target="_blank"
              >
                <IconBrandInstagram size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Dynamic Columns */}
        {menu.map((section) => (
          <div key={section.title} className="space-y-2">
            <h4 className="text-sm font-semibold mb-2">{section.title}</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {section.children?.map((child) => (
                <li key={child.title}>
                  <Link href={child.path}>{child.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom stripe */}
      <div className="border-t mt-10 py-4 bg-green-600 text-white text-center text-sm">
        © {currentYear} AMBALAJE CONSTANȚA. Toate drepturile rezervate.
      </div>
    </footer>
  );
};
