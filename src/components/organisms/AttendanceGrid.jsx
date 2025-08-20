import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import AttendanceStatus from "@/components/molecules/AttendanceStatus";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const AttendanceGrid = ({ 
  students, 
  attendanceRecords, 
  selectedDate, 
  onDateChange, 
  onStatusChange 
}) => {
  const getAttendanceForStudent = (studentId, date) => {
    return attendanceRecords.find(
      record => record.studentId === studentId && record.date === date
    );
  };

  const getStatusCount = (status) => {
    return attendanceRecords.filter(
      record => record.date === selectedDate && record.status === status
    ).length;
  };

  const statusOptions = [
    { value: "present", label: "Present", icon: "Check", color: "text-green-600" },
    { value: "absent", label: "Absent", icon: "X", color: "text-red-600" },
    { value: "late", label: "Late", icon: "Clock", color: "text-amber-600" },
    { value: "excused", label: "Excused", icon: "FileText", color: "text-blue-600" }
  ];

  if (students.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="Calendar" className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Available</h3>
        <p className="text-gray-500">Add students to start tracking attendance.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Selector and Summary */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Daily Attendance
            </h3>
            <p className="text-sm text-gray-600">
              {format(new Date(selectedDate), "EEEE, MMMM dd, yyyy")}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="flex space-x-4 text-sm">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Present: {getStatusCount("present")}
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                Absent: {getStatusCount("absent")}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Attendance Grid */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => {
                const attendance = getAttendanceForStudent(student.Id, selectedDate);
                const currentStatus = attendance?.status || "absent";
                
                return (
                  <tr key={student.Id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
                              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <AttendanceStatus status={currentStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-1">
                        {statusOptions.map((option) => (
                          <Button
                            key={option.value}
                            variant={currentStatus === option.value ? "primary" : "ghost"}
                            size="sm"
                            onClick={() => onStatusChange(student.Id, selectedDate, option.value)}
                            className={`${currentStatus !== option.value ? option.color : ""}`}
                          >
                            <ApperIcon name={option.icon} className="h-4 w-4" />
                          </Button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AttendanceGrid;