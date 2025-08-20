export const parentService = {
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
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "relationship_c" } },
          { field: { Name: "occupation_c" } },
          { field: { Name: "work_phone_c" } },
          { field: { Name: "student_ids_c" } },
          { field: { Name: "is_primary_c" } },
          { field: { Name: "emergency_contact_c" } }
        ],
        orderBy: [
          { fieldName: "first_name_c", sorttype: "ASC" }
        ]
      };
      
      const response = await apperClient.fetchRecords("parent_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Convert database fields to UI format
      return (response.data || []).map(parent => ({
        Id: parent.Id,
        firstName: parent.first_name_c || "",
        lastName: parent.last_name_c || "",
        email: parent.email_c || "",
        phone: parent.phone_c || "",
        address: parent.address_c || "",
        relationship: parent.relationship_c || "",
        occupation: parent.occupation_c || "",
        workPhone: parent.work_phone_c || "",
        studentIds: parent.student_ids_c ? parent.student_ids_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
        isPrimary: parent.is_primary_c || false,
        emergencyContact: parent.emergency_contact_c || false
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching parents:", error?.response?.data?.message);
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
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "relationship_c" } },
          { field: { Name: "occupation_c" } },
          { field: { Name: "work_phone_c" } },
          { field: { Name: "student_ids_c" } },
          { field: { Name: "is_primary_c" } },
          { field: { Name: "emergency_contact_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById("parent_c", id, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      const parent = response.data;
      return {
        Id: parent.Id,
        firstName: parent.first_name_c || "",
        lastName: parent.last_name_c || "",
        email: parent.email_c || "",
        phone: parent.phone_c || "",
        address: parent.address_c || "",
        relationship: parent.relationship_c || "",
        occupation: parent.occupation_c || "",
        workPhone: parent.work_phone_c || "",
        studentIds: parent.student_ids_c ? parent.student_ids_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
        isPrimary: parent.is_primary_c || false,
        emergencyContact: parent.emergency_contact_c || false
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching parent with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async getByStudentId(studentId) {
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
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "relationship_c" } },
          { field: { Name: "occupation_c" } },
          { field: { Name: "work_phone_c" } },
          { field: { Name: "student_ids_c" } },
          { field: { Name: "is_primary_c" } },
          { field: { Name: "emergency_contact_c" } }
        ],
        where: [
          {
            FieldName: "student_ids_c",
            Operator: "Contains",
            Values: [studentId.toString()]
          }
        ],
        orderBy: [
          { fieldName: "first_name_c", sorttype: "ASC" }
        ]
      };
      
      const response = await apperClient.fetchRecords("parent_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Convert database fields to UI format and filter by exact student ID match
      return (response.data || []).map(parent => ({
        Id: parent.Id,
        firstName: parent.first_name_c || "",
        lastName: parent.last_name_c || "",
        email: parent.email_c || "",
        phone: parent.phone_c || "",
        address: parent.address_c || "",
        relationship: parent.relationship_c || "",
        occupation: parent.occupation_c || "",
        workPhone: parent.work_phone_c || "",
        studentIds: parent.student_ids_c ? parent.student_ids_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
        isPrimary: parent.is_primary_c || false,
        emergencyContact: parent.emergency_contact_c || false
      })).filter(parent => parent.studentIds.includes(parseInt(studentId)));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching parents by student ID:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async create(parentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Convert UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          first_name_c: parentData.firstName,
          last_name_c: parentData.lastName,
          email_c: parentData.email,
          phone_c: parentData.phone,
          address_c: parentData.address,
          relationship_c: parentData.relationship,
          occupation_c: parentData.occupation,
          work_phone_c: parentData.workPhone,
          student_ids_c: Array.isArray(parentData.studentIds) ? parentData.studentIds.join(',') : parentData.studentIds || "",
          is_primary_c: parentData.isPrimary || false,
          emergency_contact_c: parentData.emergencyContact || false
        }]
      };
      
      const response = await apperClient.createRecord("parent_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create parent records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create parent");
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const parent = successfulRecord.data;
          return {
            Id: parent.Id,
            firstName: parent.first_name_c || "",
            lastName: parent.last_name_c || "",
            email: parent.email_c || "",
            phone: parent.phone_c || "",
            address: parent.address_c || "",
            relationship: parent.relationship_c || "",
            occupation: parent.occupation_c || "",
            workPhone: parent.work_phone_c || "",
            studentIds: parent.student_ids_c ? parent.student_ids_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
            isPrimary: parent.is_primary_c || false,
            emergencyContact: parent.emergency_contact_c || false
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating parent:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async update(id, parentData) {
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
          first_name_c: parentData.firstName,
          last_name_c: parentData.lastName,
          email_c: parentData.email,
          phone_c: parentData.phone,
          address_c: parentData.address,
          relationship_c: parentData.relationship,
          occupation_c: parentData.occupation,
          work_phone_c: parentData.workPhone,
          student_ids_c: Array.isArray(parentData.studentIds) ? parentData.studentIds.join(',') : parentData.studentIds || "",
          is_primary_c: parentData.isPrimary || false,
          emergency_contact_c: parentData.emergencyContact || false
        }]
      };
      
      const response = await apperClient.updateRecord("parent_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update parent records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update parent");
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const parent = successfulRecord.data;
          return {
            Id: parent.Id,
            firstName: parent.first_name_c || "",
            lastName: parent.last_name_c || "",
            email: parent.email_c || "",
            phone: parent.phone_c || "",
            address: parent.address_c || "",
            relationship: parent.relationship_c || "",
            occupation: parent.occupation_c || "",
            workPhone: parent.work_phone_c || "",
            studentIds: parent.student_ids_c ? parent.student_ids_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
            isPrimary: parent.is_primary_c || false,
            emergencyContact: parent.emergency_contact_c || false
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating parent:", error?.response?.data?.message);
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
      
      const response = await apperClient.deleteRecord("parent_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete parent records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to delete parent");
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting parent:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }
};