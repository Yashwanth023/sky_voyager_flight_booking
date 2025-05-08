
import React from "react";
import { NavigationBar } from "./NavigationBar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-grow bg-background">{children}</main>
      <Footer />
    </div>
  );
}
