import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { Chatbot } from "@/components/ai/chatbot";
import "./globals.css";

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

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f2f7f2",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light">
      <body className="min-h-screen text-foreground antialiased">
        {children}
        <Chatbot />
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
