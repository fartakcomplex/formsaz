import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "فرم‌ساز آنلاین | ساخت فرم، پرسشنامه و نظرسنجی",
  description: "فرم‌ساز آنلاین حرفه‌ای برای ساخت فرم، پرسشنامه و نظرسنجی. رایگان و سریع. بیش از ۲۰ نوع سوال با طراحی زیبا و تحلیل آماری پیشرفته.",
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${vazirmatn.variable} font-[family-name:var(--font-vazirmatn)] antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
