export const attendanceService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          {
            field: { Name: "student_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [
          { fieldName: "date_c", sorttype: "DESC" }
        ]
      };
      
      const response = await apperClient.fetchRecords("attendance_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Convert database fields to UI format
      return (response.data || []).map(record => ({
        Id: record.Id,
        date: record.date_c || "",
        status: record.status_c || "absent",
        notes: record.notes_c || "",
        studentId: record.student_id_c?.Id || record.student_id_c || 0
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance records:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async getByDate(date) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          {
            field: { Name: "student_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        where: [
          {
            FieldName: "date_c",
            Operator: "EqualTo",
            Values: [date]
          }
        ],
        orderBy: [
          { fieldName: "student_id_c", sorttype: "ASC" }
        ]
      };
      
      const response = await apperClient.fetchRecords("attendance_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Convert database fields to UI format
      return (response.data || []).map(record => ({
        Id: record.Id,
        date: record.date_c || "",
        status: record.status_c || "absent",
        notes: record.notes_c || "",
        studentId: record.student_id_c?.Id || record.student_id_c || 0
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by date:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async getByStudent(studentId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          {
            field: { Name: "student_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        where: [
          {
            FieldName: "student_id_c",
            Operator: "EqualTo",
            Values: [parseInt(studentId)]
          }
        ],
        orderBy: [
          { fieldName: "date_c", sorttype: "DESC" }
        ]
      };
      
      const response = await apperClient.fetchRecords("attendance_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Convert database fields to UI format
      return (response.data || []).map(record => ({
        Id: record.Id,
        date: record.date_c || "",
        status: record.status_c || "absent",
        notes: record.notes_c || "",
        studentId: record.student_id_c?.Id || record.student_id_c || 0
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching student attendance:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async markAttendance(studentId, date, status, notes = "") {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // First check if record already exists
      const existingRecords = await this.getByDate(date);
      const existingRecord = existingRecords.find(record => record.studentId === parseInt(studentId));
      
      if (existingRecord) {
        // Update existing record
        const updateParams = {
          records: [{
            Id: existingRecord.Id,
            status_c: status,
            notes_c: notes
          }]
        };
        
        const response = await apperClient.updateRecord("attendance_c", updateParams);
        
        if (!response.success) {
          console.error(response.message);
          throw new Error(response.message);
        }
        
        if (response.results) {
          const failedRecords = response.results.filter(result => !result.success);
          
          if (failedRecords.length > 0) {
            console.error(`Failed to update attendance records:${JSON.stringify(failedRecords)}`);
            throw new Error(failedRecords[0].message || "Failed to update attendance");
          }
          
          const successfulRecord = response.results.find(result => result.success);
          if (successfulRecord) {
            const record = successfulRecord.data;
            return {
              Id: record.Id,
              date: record.date_c || "",
              status: record.status_c || "absent",
              notes: record.notes_c || "",
              studentId: record.student_id_c?.Id || record.student_id_c || 0
            };
          }
        }
      } else {
        // Create new record
        const createParams = {
          records: [{
            date_c: date,
            status_c: status,
            notes_c: notes,
            student_id_c: parseInt(studentId)
          }]
        };
        
        const response = await apperClient.createRecord("attendance_c", createParams);
        
        if (!response.success) {
          console.error(response.message);
          throw new Error(response.message);
        }
        
        if (response.results) {
          const failedRecords = response.results.filter(result => !result.success);
          
          if (failedRecords.length > 0) {
            console.error(`Failed to create attendance records:${JSON.stringify(failedRecords)}`);
            throw new Error(failedRecords[0].message || "Failed to create attendance");
          }
          
          const successfulRecord = response.results.find(result => result.success);
          if (successfulRecord) {
            const record = successfulRecord.data;
            return {
              Id: record.Id,
              date: record.date_c || "",
              status: record.status_c || "absent",
              notes: record.notes_c || "",
              studentId: record.student_id_c?.Id || record.student_id_c || 0
            };
          }
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error marking attendance:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async getAttendanceStats(dateRange) {
    try {
      let filteredRecords;
      
      if (dateRange) {
        // Get filtered records by date range
        const { ApperClient } = window.ApperSDK;
        const apperClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });
        
        const params = {
          fields: [
            { field: { Name: "Name" } },
            { field: { Name: "date_c" } },
            { field: { Name: "status_c" } },
            { field: { Name: "notes_c" } },
            {
              field: { Name: "student_id_c" },
              referenceField: { field: { Name: "Name" } }
            }
          ],
          where: [
            {
              FieldName: "date_c",
              Operator: "GreaterThanOrEqualTo",
              Values: [dateRange.start]
            },
            {
              FieldName: "date_c",
              Operator: "LessThanOrEqualTo",
              Values: [dateRange.end]
            }
          ]
        };
        
        const response = await apperClient.fetchRecords("attendance_c", params);
        
        if (!response.success) {
          console.error(response.message);
          filteredRecords = [];
        } else {
          // Convert database fields to UI format
          filteredRecords = (response.data || []).map(record => ({
            Id: record.Id,
            date: record.date_c || "",
            status: record.status_c || "absent",
            notes: record.notes_c || "",
            studentId: record.student_id_c?.Id || record.student_id_c || 0
          }));
        }
      } else {
        filteredRecords = await this.getAll();
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
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error getting attendance stats:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return {
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        attendanceRate: 0
      };
    }
  }
};