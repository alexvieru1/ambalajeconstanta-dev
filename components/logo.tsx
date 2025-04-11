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
        alt="Logo"
        width={40} // You can adjust size here
        height={40}
        priority // loads fast
      />
    </Link>
  );
};
