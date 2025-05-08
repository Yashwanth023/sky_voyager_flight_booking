
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
        {/* Enhanced decorative elements with animations */}
        <div className="fixed top-20 right-0 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl pointer-events-none animate-pulse"></div>
        <div className="fixed bottom-20 left-0 w-64 h-64 bg-secondary/5 rounded-full filter blur-2xl pointer-events-none animate-pulse"></div>
        <div className="fixed top-1/2 left-1/3 w-80 h-80 bg-accent/5 rounded-full filter blur-3xl pointer-events-none animate-pulse"></div>
        
        {children}
      </main>
      <Footer />
    </div>
  );
}
