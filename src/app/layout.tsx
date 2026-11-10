import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

export const metadata: Metadata = {
  title: {
    default: "فكرتو - نظّم وقتك، حقق أهدافك",
    template: "%s | فكرتو",
  },
  description:
    "منصة احترافية لتنظيم الوقت والمهام. أنشئ جداول مخصصة، تابع إنجازاتك، وحقق أهدافك بكفاءة.",
  keywords: [
    "تنظيم الوقت",
    "إدارة المهام",
    "جدول يومي",
    "إنتاجية",
    "فكرتو",
    "Fekrto",
  ],
  authors: [{ name: "Fekrto Team" }],
  openGraph: {
    title: "فكرتو - نظّم وقتك، حقق أهدافك",
    description:
      "منصة احترافية لتنظيم الوقت والمهام. أنشئ جداول مخصصة، تابع إنجازاتك، وحقق أهدافك بكفاءة.",
    type: "website",
    locale: "ar_SA",
    siteName: "فكرتو",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('fekrto-theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
        <ThemeProvider>
          <CurrencyProvider>
            <AuthProvider>{children}</AuthProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
