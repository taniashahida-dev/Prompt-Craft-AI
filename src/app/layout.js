import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
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
  title: "PromptCraft AI - Advanced AI Content Generator Platform",
  description: "Create premium quality articles, social copy, emails, and code snippets instantly with our state-of-the-art AI content suite.",
  keywords: ["AI Writer", "Content Generator", "AI copywriting", "Next-gen Prompt Generator", "SaaS Content Creation"],
  openGraph: {
    title: "PromptCraft AI - Advanced AI Content Generator Platform",
    description: "Generate high-converting marketing copy, blog posts, and developer assets at 10x speed with AI.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-dark text-slate-100 selection:bg-purple-500/30 selection:text-purple-200">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
