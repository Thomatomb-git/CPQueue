import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

// 1. Initialize Google fonts
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CPQueue",
  description: "A competitive programming post-contest problem queue manager for upsolving.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.jpg", type: "image/jpeg" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 2. Attach font variables to the <html> tag
    <html
      lang="en"
      className={`dark ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      {/* 3. Add font-sans utility so the font applies to all text */}
      <body className="bg-canvas text-textPrimary font-sans antialiased selection:bg-[#FACC15] selection:text-black">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}