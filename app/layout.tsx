import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getMenu } from "@/lib/shopify";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ambalaje Constanța",
  description: "Ambalaje Constanța",
};

const navbarMenu = await getMenu("nextjs-frontend-menu");
const footerMenu = await getMenu("nextjs-frontend-footer");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Navbar menu={navbarMenu} />
        <main className="flex-1 pt-20 lg:pt-24">{children}</main>
        <Toaster />
        <Footer menu={footerMenu} />
      </body>
    </html>
  );
}
