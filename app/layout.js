import { Inter } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ProJourney",
  description: "AI Powered DSA Practice",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </AuthProvider>
  );
}
