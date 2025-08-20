import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { attendanceService } from "@/services/api/attendanceService";
import { gradeService } from "@/services/api/gradeService";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [gradeStats, setGradeStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, attendanceData, gradeData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAttendanceStats(),
        gradeService.getGradeStats()
      ]);
      
      setStudents(studentsData);
      setAttendanceStats(attendanceData);
      setGradeStats(gradeData);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const activeStudents = students.filter(s => s.status === "active").length;
  const totalStudents = students.length;
  
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display mb-2">
              Welcome to ScholarHub
            </h1>
            <p className="text-primary-100">
              Your comprehensive student management dashboard
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <ApperIcon name="GraduationCap" className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon="Users"
          change="+3 this month"
          changeType="positive"
          gradient="from-primary-500 to-primary-600"
        />
        <StatCard
          title="Active Students"
          value={activeStudents}
          icon="UserCheck"
          change={`${activeStudents} enrolled`}
          changeType="positive"
          gradient="from-green-500 to-green-600"
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceStats?.attendanceRate || 0}%`}
          icon="Calendar"
          change="Last 30 days"
          changeType="neutral"
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Average GPA"
          value={gradeStats?.averageGPA || "0.00"}
          icon="Award"
          change="All students"
          changeType="positive"
          gradient="from-accent-500 to-accent-600"
        />
      </div>

      {/* Grade Distribution & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold font-display text-gray-900 mb-4 flex items-center">
            <ApperIcon name="BarChart3" className="h-5 w-5 mr-2 text-primary-600" />
            Grade Distribution
          </h3>
          {gradeStats?.gradeDistribution && (
            <div className="space-y-4">
              {Object.entries(gradeStats.gradeDistribution).map(([grade, count]) => {
                const total = Object.values(gradeStats.gradeDistribution).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? (count / total * 100).toFixed(1) : 0;
                
                const colors = {
                  A: "bg-green-500",
                  B: "bg-blue-500", 
                  C: "bg-yellow-500",
                  D: "bg-orange-500",
                  F: "bg-red-500"
                };
                
                return (
                  <div key={grade} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${colors[grade]} mr-3`}></div>
                      <span className="font-medium text-gray-900">Grade {grade}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${colors[grade]}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600 w-12">
                        {count} ({percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold font-display text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Zap" className="h-5 w-5 mr-2 text-primary-600" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg hover:from-primary-100 hover:to-primary-200 transition-all duration-200 group">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                  <ApperIcon name="UserPlus" className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium text-primary-700">Add Student</p>
              </div>
            </button>
            
            <button className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-200 group">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                  <ApperIcon name="Calendar" className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium text-green-700">Take Attendance</p>
              </div>
            </button>
            
            <button className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                  <ApperIcon name="BookOpen" className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium text-blue-700">Add Grade</p>
              </div>
            </button>
            
            <button className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-200 group">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                  <ApperIcon name="FileText" className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium text-purple-700">View Reports</p>
              </div>
            </button>
          </div>
        </Card>
      </div>

      {/* Subject Performance */}
      {gradeStats?.subjectAverages && Object.keys(gradeStats.subjectAverages).length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold font-display text-gray-900 mb-4 flex items-center">
            <ApperIcon name="BookOpen" className="h-5 w-5 mr-2 text-primary-600" />
            Subject Performance Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(gradeStats.subjectAverages).map(([subject, average]) => (
              <div key={subject} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900 text-sm">{subject}</h4>
                  <span className="text-lg font-bold text-primary-600">{average}%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(parseFloat(average), 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;