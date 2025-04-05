"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export const Logo = ({ className }: LogoProps) => {
  return (
    <Link href="/" className={cn("inline-flex items-center", className)}>
      <Image
        src="/logo.webp"
        alt="Ambalaje Constanta Logo"
        width={40} // You can adjust size here
        height={40}
        priority // loads fast
      />
      <div className="flex flex-col items-center">
        <p className="ml-2 font-bold text-green-600 text-md">Ambalaje</p>
        <p className="ml-2 font-semibold text-black text-md">Constanța</p>
      </div>
    </Link>
  );
};
