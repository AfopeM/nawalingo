import "./globals.css";
import { Poppins } from "next/font/google";
import ErrorBoundary from "@/providers/error/ErrorBoundary";
import { AuthProvider } from "@/providers/auth/auth-provider";
import { ThemeProvider } from "@/providers/theme/theme-provider";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "300", "500", "700", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-pop font-normal antialiased`}>
        <AuthProvider>
          <ThemeProvider>
            <ErrorBoundary>{children}</ErrorBoundary>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
