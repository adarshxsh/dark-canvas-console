import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopNavbar } from "./TopNavbar";
import { LeftSidebar } from "./LeftSidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, clear auth state here
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar onLogout={handleLogout} />
      <LeftSidebar />
      <main className="pt-12 pl-48 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
