"use client";

import Link from "next/link";
import { getMenu } from "@/lib/shopify";
import { IconBrandFacebook, IconBrandInstagram } from "@tabler/icons-react";

type FooterProps = {
  menu: Awaited<ReturnType<typeof getMenu>>;
};

const MobileFooter = ({ menu }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="md:hidden bg-white border-t pt-6">
      <div className="px-4 space-y-8">
        {/* Company Info */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">AMBALAJE CONSTANȚA</h3>
          <p className="text-sm">Bd. Aurel Vlaicu, 163, Constanța</p>
          <p className="text-sm">Telefon: 0722 222 222</p>
          <p className="text-sm">Email: office@ambalajeconstanta.ro</p>
        </div>

        {/* Dynamic Sections */}
        {menu.map((section) => (
          <div key={section.title}>
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

        {/* Social Media */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Rețele de socializare</h4>
          <div className="flex gap-4 text-gray-700">
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

      {/* Bottom stripe */}
      <div className="border-t mt-6 py-4 bg-green-600 text-white text-center text-xs">
        © {currentYear} AMBALAJE CONSTANȚA. Toate drepturile rezervate.
      </div>
    </footer>
  );
};

export default MobileFooter;
