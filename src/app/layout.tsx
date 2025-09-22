import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/themeProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "My App",
  description: "You are secure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-right" richColors />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
