import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { attendanceService } from "@/services/api/attendanceService";
import { gradeService } from "@/services/api/gradeService";
import { format } from "date-fns";

const Reports = () => {
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [gradesData, setGradesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, attendanceRecords, grades] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll(),
        gradeService.getAll()
      ]);
      
      setStudents(studentsData);
      setAttendanceData(attendanceRecords);
      setGradesData(grades);
    } catch (err) {
      setError(err.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadReportData} />;

  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === "active").length;
  const totalGrades = gradesData.length;
  const totalAttendanceRecords = attendanceData.length;

  // Calculate attendance rate
  const presentRecords = attendanceData.filter(r => r.status === "present" || r.status === "late" || r.status === "excused").length;
  const attendanceRate = totalAttendanceRecords > 0 ? (presentRecords / totalAttendanceRecords * 100).toFixed(1) : 0;

  // Calculate average GPA
  const averageGPA = gradesData.length > 0 ? (
    gradesData.reduce((sum, grade) => {
      const percentage = (grade.score / grade.maxScore) * 100;
      let points = 0;
      if (percentage >= 90) points = 4;
      else if (percentage >= 80) points = 3;
      else if (percentage >= 70) points = 2;
      else if (percentage >= 60) points = 1;
      return sum + points;
    }, 0) / gradesData.length
  ).toFixed(2) : "0.00";

  // Grade distribution
  const gradeDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  gradesData.forEach(grade => {
    const percentage = (grade.score / grade.maxScore) * 100;
    let letterGrade;
    if (percentage >= 90) letterGrade = "A";
    else if (percentage >= 80) letterGrade = "B";
    else if (percentage >= 70) letterGrade = "C";
    else if (percentage >= 60) letterGrade = "D";
    else letterGrade = "F";
    gradeDistribution[letterGrade]++;
  });

  // Subject averages
  const subjectGroups = gradesData.reduce((acc, grade) => {
    if (!acc[grade.subject]) acc[grade.subject] = [];
    acc[grade.subject].push((grade.score / grade.maxScore) * 100);
    return acc;
  }, {});

  const subjectAverages = Object.keys(subjectGroups).map(subject => ({
    subject,
    average: (subjectGroups[subject].reduce((sum, score) => sum + score, 0) / subjectGroups[subject].length).toFixed(1),
    count: subjectGroups[subject].length
  })).sort((a, b) => parseFloat(b.average) - parseFloat(a.average));

  // Grade level breakdown
  const gradeLevels = students.reduce((acc, student) => {
    if (!acc[student.grade]) acc[student.grade] = 0;
    acc[student.grade]++;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">
          Academic Reports
        </h1>
        <p className="mt-2 text-gray-600">
          Comprehensive overview of student performance and school statistics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon="Users"
          gradient="from-primary-500 to-primary-600"
        />
        <StatCard
          title="Active Students"
          value={activeStudents}
          icon="UserCheck"
          gradient="from-green-500 to-green-600"
        />
        <StatCard
          title="Overall GPA"
          value={averageGPA}
          icon="Award"
          gradient="from-accent-500 to-accent-600"
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon="Calendar"
          gradient="from-blue-500 to-blue-600"
        />
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold font-display text-gray-900 mb-4 flex items-center">
            <ApperIcon name="BarChart3" className="h-5 w-5 mr-2 text-primary-600" />
            Grade Distribution
          </h3>
          <div className="space-y-4">
            {Object.entries(gradeDistribution).map(([grade, count]) => {
              const total = Object.values(gradeDistribution).reduce((a, b) => a + b, 0);
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
                    <span className="text-sm font-medium text-gray-600 w-20">
                      {count} ({percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Grade Level Breakdown */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold font-display text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Users" className="h-5 w-5 mr-2 text-primary-600" />
            Students by Grade Level
          </h3>
          <div className="space-y-3">
            {Object.entries(gradeLevels)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([grade, count]) => (
              <div key={grade} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
                <span className="font-medium text-gray-900">{grade}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-primary-600">{count}</span>
                  <span className="text-sm text-gray-500">students</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Subject Performance */}
      {subjectAverages.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold font-display text-gray-900 mb-4 flex items-center">
            <ApperIcon name="BookOpen" className="h-5 w-5 mr-2 text-primary-600" />
            Subject Performance Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectAverages.map((subject) => (
              <div key={subject.subject} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{subject.subject}</h4>
                  <span className="text-lg font-bold text-primary-600">{subject.average}%</span>
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {subject.count} grade{subject.count !== 1 ? "s" : ""} recorded
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(parseFloat(subject.average), 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="FileText" className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Records</h3>
          <p className="text-3xl font-bold text-primary-600">{totalGrades + totalAttendanceRecords}</p>
          <p className="text-sm text-gray-500">Grades + Attendance</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="BookOpen" className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Subjects Taught</h3>
          <p className="text-3xl font-bold text-green-600">{Object.keys(subjectGroups).length}</p>
          <p className="text-sm text-gray-500">Different subjects</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Calendar" className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Generated</h3>
          <p className="text-lg font-bold text-blue-600">{format(new Date(), "MMM dd")}</p>
          <p className="text-sm text-gray-500">{format(new Date(), "yyyy")}</p>
        </Card>
      </div>
    </div>
  );
};

export default Reports;