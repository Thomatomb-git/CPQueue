import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

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
    <html lang="id" className="dark">
      <body className="bg-canvas text-textPrimary antialiased selection:bg-[#FACC15] selection:text-black">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
