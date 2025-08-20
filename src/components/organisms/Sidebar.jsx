import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

const navigationItems = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Students", href: "/students", icon: "Users" },
    { name: "Parents", href: "/parents", icon: "Users2" },
    { name: "Attendance", href: "/attendance", icon: "Calendar" },
    { name: "Grades", href: "/grades", icon: "BookOpen" },
    { name: "Reports", href: "/reports", icon: "BarChart3" }
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <NavLink
        to={item.href}
        onClick={() => onClose && onClose()}
        className={cn(
          "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
          isActive
            ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105"
            : "text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700"
        )}
      >
        <ApperIcon 
          name={item.icon} 
          className={cn(
            "h-5 w-5 mr-3 transition-colors",
            isActive ? "text-white" : "text-gray-500 group-hover:text-primary-600"
          )} 
        />
        {item.name}
      </NavLink>
    );
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-lg">
      <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
              <ApperIcon name="GraduationCap" className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                ScholarHub
              </h1>
              <p className="text-xs text-gray-500">Student Management</p>
            </div>
          </div>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-2">
          {navigationItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>
        <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-500 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="h-4 w-4 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">School Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      )}
      <div className={cn(
        "lg:hidden fixed inset-y-0 left-0 flex flex-col w-64 bg-white border-r border-gray-200 shadow-xl z-50 transition-transform duration-300 ease-in-out",
        isOpen ? "transform translate-x-0" : "transform -translate-x-full"
      )}>
        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center justify-between flex-shrink-0 px-4 mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
                <ApperIcon name="GraduationCap" className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  ScholarHub
                </h1>
                <p className="text-xs text-gray-500">Student Management</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-2">
            {navigationItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
          <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-500 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="h-4 w-4 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">School Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;