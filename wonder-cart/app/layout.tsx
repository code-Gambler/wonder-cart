import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ModalProvider } from "@/providers/modal-provider";
import { ToasterProvider } from "@/providers/toast-provider";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { ClientOnly } from "@/components/client-only";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ClientOnly>
            {/* <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn> */}
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <ToasterProvider />
              <ModalProvider />
              {children}
            </ThemeProvider>
          </ClientOnly>
        </body>
      </html>
    </ClerkProvider>
  );
}
