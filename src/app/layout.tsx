import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

// 1. Inisialisasi font Google
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CP Upsolve Quest",
  description: "Aplikasi antrean soal competitive programming pasca-kontes (upsolving).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 2. Tempelkan variabel font ke tag <html>
    <html
      lang="id"
      className={`dark ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      {/* 3. Tambahkan utility font-sans agar font diterapkan ke seluruh teks */}
      <body className="bg-canvas text-textPrimary font-sans antialiased selection:bg-[#FACC15] selection:text-black">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}