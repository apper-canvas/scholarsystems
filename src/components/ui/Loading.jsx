import React from "react";

const Loading = ({ className = "" }) => {
  return (
    <div className={`animate-pulse space-y-6 ${className}`}>
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
        <div className="h-10 w-32 bg-gradient-to-r from-primary-200 to-primary-300 rounded-lg"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
                <div className="h-8 w-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded"></div>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-primary-200 to-secondary-300 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
          <div className="grid grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        
        {/* Table Rows */}
        {[...Array(5)].map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4 border-b border-gray-200 last:border-b-0">
            <div className="grid grid-cols-6 gap-4 items-center">
              {/* Avatar and Name */}
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-br from-primary-200 to-secondary-300 rounded-full"></div>
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 w-32 bg-gray-100 rounded"></div>
                </div>
              </div>
              
              {/* Other columns */}
              {[...Array(4)].map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-gray-200 rounded"></div>
              ))}
              
              {/* Actions */}
              <div className="flex justify-end space-x-2">
                {[...Array(3)].map((_, actionIndex) => (
                  <div key={actionIndex} className="h-8 w-8 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;