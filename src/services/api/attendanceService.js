import attendanceData from "@/services/mockData/attendance.json";

let attendanceRecords = [...attendanceData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const attendanceService = {
  async getAll() {
    await delay();
    return [...attendanceRecords];
  },

  async getByDate(date) {
    await delay();
    return attendanceRecords.filter(record => record.date === date);
  },

  async getByStudent(studentId) {
    await delay();
    return attendanceRecords.filter(record => record.studentId === parseInt(studentId));
  },

  async markAttendance(studentId, date, status, notes = "") {
    await delay();
    
    // Check if record already exists
    const existingIndex = attendanceRecords.findIndex(
      record => record.studentId === parseInt(studentId) && record.date === date
    );

    if (existingIndex !== -1) {
      // Update existing record
      attendanceRecords[existingIndex] = {
        ...attendanceRecords[existingIndex],
        status,
        notes
      };
      return { ...attendanceRecords[existingIndex] };
    } else {
      // Create new record
      const maxId = Math.max(...attendanceRecords.map(r => r.Id), 0);
      const newRecord = {
        Id: maxId + 1,
        studentId: parseInt(studentId),
        date,
        status,
        notes
      };
      attendanceRecords.push(newRecord);
      return { ...newRecord };
    }
  },

  async getAttendanceStats(dateRange) {
    await delay();
    let filteredRecords = attendanceRecords;
    
    if (dateRange) {
      filteredRecords = attendanceRecords.filter(
        record => record.date >= dateRange.start && record.date <= dateRange.end
      );
    }

    const stats = {
      total: filteredRecords.length,
      present: filteredRecords.filter(r => r.status === "present").length,
      absent: filteredRecords.filter(r => r.status === "absent").length,
      late: filteredRecords.filter(r => r.status === "late").length,
      excused: filteredRecords.filter(r => r.status === "excused").length
    };

    stats.attendanceRate = stats.total > 0 ? 
      ((stats.present + stats.late + stats.excused) / stats.total * 100).toFixed(1) : 0;

    return stats;
  }
};