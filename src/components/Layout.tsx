
import React from "react";
import { NavigationBar } from "./NavigationBar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavigationBar />
      <main className="flex-grow bg-background relative overflow-hidden">
        {/* Enhanced decorative glow effects */}
        <div className="fixed top-20 right-10 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse"></div>
        <div className="fixed bottom-40 left-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl animate-pulse"></div>
        <div className="fixed top-1/2 left-1/3 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl animate-pulse"></div>
        
        {children}
      </main>
      <Footer />
    </div>
  );
}
