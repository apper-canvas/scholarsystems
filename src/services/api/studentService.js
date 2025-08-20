export const studentService = {
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
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "date_of_birth_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "guardian_name_c" } },
          { field: { Name: "guardian_phone_c" } },
          { field: { Name: "guardian_email_c" } },
          { field: { Name: "emergency_contact_name_c" } },
          { field: { Name: "emergency_contact_phone_c" } },
          { field: { Name: "emergency_contact_relationship_c" } },
          { field: { Name: "status_c" } }
        ],
        orderBy: [
          { fieldName: "first_name_c", sorttype: "ASC" }
        ]
      };
      
      const response = await apperClient.fetchRecords("student_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Convert database fields to UI format
      return (response.data || []).map(student => ({
        Id: student.Id,
        firstName: student.first_name_c || "",
        lastName: student.last_name_c || "",
        dateOfBirth: student.date_of_birth_c || "",
        grade: student.grade_c || "",
        enrollmentDate: student.enrollment_date_c || "",
        email: student.email_c || "",
        phone: student.phone_c || "",
        address: student.address_c || "",
        guardianName: student.guardian_name_c || "",
        guardianPhone: student.guardian_phone_c || "",
        guardianEmail: student.guardian_email_c || "",
        emergencyContactName: student.emergency_contact_name_c || "",
        emergencyContactPhone: student.emergency_contact_phone_c || "",
        emergencyContactRelationship: student.emergency_contact_relationship_c || "",
        status: student.status_c || "active"
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching students:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "date_of_birth_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "guardian_name_c" } },
          { field: { Name: "guardian_phone_c" } },
          { field: { Name: "guardian_email_c" } },
          { field: { Name: "emergency_contact_name_c" } },
          { field: { Name: "emergency_contact_phone_c" } },
          { field: { Name: "emergency_contact_relationship_c" } },
          { field: { Name: "status_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById("student_c", id, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      const student = response.data;
      return {
        Id: student.Id,
        firstName: student.first_name_c || "",
        lastName: student.last_name_c || "",
        dateOfBirth: student.date_of_birth_c || "",
        grade: student.grade_c || "",
        enrollmentDate: student.enrollment_date_c || "",
        email: student.email_c || "",
        phone: student.phone_c || "",
        address: student.address_c || "",
        guardianName: student.guardian_name_c || "",
        guardianPhone: student.guardian_phone_c || "",
        guardianEmail: student.guardian_email_c || "",
        emergencyContactName: student.emergency_contact_name_c || "",
        emergencyContactPhone: student.emergency_contact_phone_c || "",
        emergencyContactRelationship: student.emergency_contact_relationship_c || "",
        status: student.status_c || "active"
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching student with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async create(studentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Convert UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          first_name_c: studentData.firstName,
          last_name_c: studentData.lastName,
          date_of_birth_c: studentData.dateOfBirth,
          grade_c: studentData.grade,
          enrollment_date_c: studentData.enrollmentDate,
          email_c: studentData.email,
          phone_c: studentData.phone,
          address_c: studentData.address,
          guardian_name_c: studentData.guardianName,
          guardian_phone_c: studentData.guardianPhone,
          guardian_email_c: studentData.guardianEmail,
          emergency_contact_name_c: studentData.emergencyContactName,
          emergency_contact_phone_c: studentData.emergencyContactPhone,
          emergency_contact_relationship_c: studentData.emergencyContactRelationship,
          status_c: studentData.status || "active"
        }]
      };
      
      const response = await apperClient.createRecord("student_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create student records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create student");
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const student = successfulRecord.data;
          return {
            Id: student.Id,
            firstName: student.first_name_c || "",
            lastName: student.last_name_c || "",
            dateOfBirth: student.date_of_birth_c || "",
            grade: student.grade_c || "",
            enrollmentDate: student.enrollment_date_c || "",
            email: student.email_c || "",
            phone: student.phone_c || "",
            address: student.address_c || "",
            guardianName: student.guardian_name_c || "",
            guardianPhone: student.guardian_phone_c || "",
            guardianEmail: student.guardian_email_c || "",
            emergencyContactName: student.emergency_contact_name_c || "",
            emergencyContactPhone: student.emergency_contact_phone_c || "",
            emergencyContactRelationship: student.emergency_contact_relationship_c || "",
            status: student.status_c || "active"
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating student:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async update(id, studentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Convert UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          Id: parseInt(id),
          first_name_c: studentData.firstName,
          last_name_c: studentData.lastName,
          date_of_birth_c: studentData.dateOfBirth,
          grade_c: studentData.grade,
          enrollment_date_c: studentData.enrollmentDate,
          email_c: studentData.email,
          phone_c: studentData.phone,
          address_c: studentData.address,
          guardian_name_c: studentData.guardianName,
          guardian_phone_c: studentData.guardianPhone,
          guardian_email_c: studentData.guardianEmail,
          emergency_contact_name_c: studentData.emergencyContactName,
          emergency_contact_phone_c: studentData.emergencyContactPhone,
          emergency_contact_relationship_c: studentData.emergencyContactRelationship,
          status_c: studentData.status || "active"
        }]
      };
      
      const response = await apperClient.updateRecord("student_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update student records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update student");
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const student = successfulRecord.data;
          return {
            Id: student.Id,
            firstName: student.first_name_c || "",
            lastName: student.last_name_c || "",
            dateOfBirth: student.date_of_birth_c || "",
            grade: student.grade_c || "",
            enrollmentDate: student.enrollment_date_c || "",
            email: student.email_c || "",
            phone: student.phone_c || "",
            address: student.address_c || "",
            guardianName: student.guardian_name_c || "",
            guardianPhone: student.guardian_phone_c || "",
            guardianEmail: student.guardian_email_c || "",
            emergencyContactName: student.emergency_contact_name_c || "",
            emergencyContactPhone: student.emergency_contact_phone_c || "",
            emergencyContactRelationship: student.emergency_contact_relationship_c || "",
            status: student.status_c || "active"
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating student:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord("student_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete student records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to delete student");
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting student:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async search(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      if (!query.trim()) {
        return this.getAll();
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "date_of_birth_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "guardian_name_c" } },
          { field: { Name: "guardian_phone_c" } },
          { field: { Name: "guardian_email_c" } },
          { field: { Name: "emergency_contact_name_c" } },
          { field: { Name: "emergency_contact_phone_c" } },
          { field: { Name: "emergency_contact_relationship_c" } },
          { field: { Name: "status_c" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "first_name_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "last_name_c",
                    operator: "Contains", 
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "email_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "grade_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              }
            ]
          }
        ],
        orderBy: [
          { fieldName: "first_name_c", sorttype: "ASC" }
        ]
      };
      
      const response = await apperClient.fetchRecords("student_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Convert database fields to UI format
      return (response.data || []).map(student => ({
        Id: student.Id,
        firstName: student.first_name_c || "",
        lastName: student.last_name_c || "",
        dateOfBirth: student.date_of_birth_c || "",
        grade: student.grade_c || "",
        enrollmentDate: student.enrollment_date_c || "",
        email: student.email_c || "",
        phone: student.phone_c || "",
        address: student.address_c || "",
        guardianName: student.guardian_name_c || "",
        guardianPhone: student.guardian_phone_c || "",
        guardianEmail: student.guardian_email_c || "",
        emergencyContactName: student.emergency_contact_name_c || "",
        emergencyContactPhone: student.emergency_contact_phone_c || "",
        emergencyContactRelationship: student.emergency_contact_relationship_c || "",
        status: student.status_c || "active"
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching students:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }
};