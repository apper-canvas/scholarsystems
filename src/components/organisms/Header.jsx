import React from "react";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onMenuClick, title, searchValue, onSearchChange, showSearch = true }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Menu" className="h-6 w-6" />
            </button>
            <h1 className="ml-4 lg:ml-0 text-2xl font-bold font-display text-gray-900">
              {title}
            </h1>
          </div>
          
          {showSearch && (
            <div className="flex-1 max-w-md mx-8">
              <SearchBar
                value={searchValue}
                onChange={onSearchChange}
                placeholder="Search students, grades, attendance..."
              />
            </div>
          )}

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors relative">
              <ApperIcon name="Bell" className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-accent-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center shadow-lg">
              <ApperIcon name="User" className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;