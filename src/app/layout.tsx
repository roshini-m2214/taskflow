import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PWARegister from "@/components/PWARegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskFlow",
  description:
    "Organize your tasks, focus on what matters, and make steady progress.",

  metadataBase: new URL("https://taskflow-rosh12.vercel.app"),

  openGraph: {
    title: "TaskFlow",
    description:
      "Organize your tasks, projects, deadlines, and productivity in one place.",
    url: "https://taskflow-rosh12.vercel.app",
    siteName: "TaskFlow",
    images: [
      {
        url: "/taskflow-preview.png",
        width: 235,
        height: 235,
        alt: "TaskFlow",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "TaskFlow",
    description:
      "Organize your tasks, projects, deadlines, and productivity in one place.",
    images: ["/taskflow-preview.png"],
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PWARegister />
        {children}
      </body>
    </html>
  );
}