import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/layout.css";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="win95-window">
      <Header />
      <main className="win95-main">{children}</main>
      <Footer />
    </div>
  );
}
