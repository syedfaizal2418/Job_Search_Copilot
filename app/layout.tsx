import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Job Search Copilot | AI Career Pipeline",
  description: "A precision job application tracker and AI kit generator for non-technical job seekers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-canvas text-ink min-h-screen selection:bg-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}

