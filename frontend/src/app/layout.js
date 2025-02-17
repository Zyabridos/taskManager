import { Geist, Geist_Mono } from "next/font/google";
import I18nProvider from "@/components/i18nProvider.jsx";
import Navbar from "@/components/Partials/Navbar";
import Footer from "@/components/Partials/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow py-6">
              <div className="max-w-7xl mx-auto px-4">{children}</div>
            </main>
            <Footer />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
