import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AuthProvider } from "@/providers/auth/auth-provider";
import { ThemeProvider } from "@/providers/theme/theme-provider";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "300", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Nawalingo",
  description:
    "Nawalingo is a pay-per-lesson language learning platform offering 1-on-1 live video sessions with qualified tutors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-pop antialiased`}>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
