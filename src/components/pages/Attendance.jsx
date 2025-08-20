import React, { useState, useEffect } from "react";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { studentService } from "@/services/api/studentService";
import { attendanceService } from "@/services/api/attendanceService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, attendanceData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll()
      ]);
      
      setStudents(studentsData.filter(s => s.status === "active"));
      setAttendanceRecords(attendanceData);
    } catch (err) {
      setError(err.message || "Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (studentId, date, status) => {
    try {
      const updatedRecord = await attendanceService.markAttendance(
        studentId, 
        date, 
        status
      );
      
      setAttendanceRecords(prev => {
        const existingIndex = prev.findIndex(
          r => r.studentId === studentId && r.date === date
        );
        
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = updatedRecord;
          return updated;
        } else {
          return [...prev, updatedRecord];
        }
      });
      
      toast.success("Attendance updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update attendance");
    }
  };

  const getTodayStats = () => {
    const todayRecords = attendanceRecords.filter(r => r.date === selectedDate);
    return {
      total: students.length,
      present: todayRecords.filter(r => r.status === "present").length,
      absent: todayRecords.filter(r => r.status === "absent").length,
      late: todayRecords.filter(r => r.status === "late").length,
      excused: todayRecords.filter(r => r.status === "excused").length,
      unmarked: students.length - todayRecords.length
    };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (students.length === 0) {
    return (
      <Empty
        title="No Active Students"
        description="Add students to your system to start tracking attendance."
        icon="Users"
      />
    );
  }

  const stats = getTodayStats();
  const attendanceRate = stats.total > 0 ? 
    ((stats.present + stats.late + stats.excused) / stats.total * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">
          Attendance Management
        </h1>
        <p className="mt-2 text-gray-600">
          Track daily attendance for {format(new Date(selectedDate), "MMMM dd, yyyy")}
        </p>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Present"
          value={stats.present}
          icon="CheckCircle"
          gradient="from-green-500 to-green-600"
        />
        <StatCard
          title="Absent"
          value={stats.absent}
          icon="XCircle"
          gradient="from-red-500 to-red-600"
        />
        <StatCard
          title="Late"
          value={stats.late}
          icon="Clock"
          gradient="from-amber-500 to-amber-600"
        />
        <StatCard
          title="Excused"
          value={stats.excused}
          icon="FileText"
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon="TrendingUp"
          gradient="from-purple-500 to-purple-600"
        />
      </div>

      {/* Attendance Grid */}
      <AttendanceGrid
        students={students}
        attendanceRecords={attendanceRecords}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default Attendance;