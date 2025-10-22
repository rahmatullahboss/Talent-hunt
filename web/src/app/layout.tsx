import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { SupabaseProvider } from "@/components/providers/supabase-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TalentHunt BD",
    template: "%s | TalentHunt BD",
  },
  description:
    "Hire and discover Bangladeshi freelance talent for your next project. Post jobs, submit proposals, and collaborate securely on TalentHunt BD.",
  keywords: [
    "Bangladesh freelancers",
    "Remote jobs Bangladesh",
    "Hire developers in Bangladesh",
    "Freelance marketplace",
    "Talent Hunt BD",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}>
        <SupabaseProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </SupabaseProvider>
      </body>
    </html>
  );
}
