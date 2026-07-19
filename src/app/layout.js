import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import QueryProvider from "@/context/QueryProvider";
import { Toaster } from "react-hot-toast";
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
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster 
              position="top-right" 
              toastOptions={{ 
                duration: 4000,
                style: {
                  background: '#090526',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }
              }} 
            />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
