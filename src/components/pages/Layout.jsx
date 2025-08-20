import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

const Layout = ({ searchValue, onSearchChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/students":
        return "Students";
      case "/attendance":
        return "Attendance";
      case "/grades":
        return "Grades";
      case "/reports":
        return "Reports";
      default:
        return "ScholarHub";
    }
  };

  const shouldShowSearch = () => {
    return ["/students", "/grades"].includes(location.pathname);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title={getPageTitle()}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          showSearch={shouldShowSearch()}
        />
        
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;