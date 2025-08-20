export const communicationService = {
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
          {
            field: { Name: "parent_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "teacher_id_c" } },
          { field: { Name: "student_ids_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "follow_up_required_c" } },
          { field: { Name: "follow_up_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        orderBy: [
          { fieldName: "created_at_c", sorttype: "DESC" }
        ]
      };
      
      const response = await apperClient.fetchRecords("communication_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Convert database fields to UI format
      return (response.data || []).map(comm => ({
        Id: comm.Id,
        parentId: comm.parent_id_c?.Id || comm.parent_id_c || 0,
        teacherId: parseInt(comm.teacher_id_c) || 0,
        studentIds: comm.student_ids_c ? comm.student_ids_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
        type: comm.type_c || "",
        subject: comm.subject_c || "",
        notes: comm.notes_c || "",
        followUpRequired: comm.follow_up_required_c || false,
        followUpDate: comm.follow_up_date_c || "",
        createdAt: comm.created_at_c || new Date().toISOString(),
        updatedAt: comm.updated_at_c || new Date().toISOString()
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching communications:", error?.response?.data?.message);
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
          {
            field: { Name: "parent_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "teacher_id_c" } },
          { field: { Name: "student_ids_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "follow_up_required_c" } },
          { field: { Name: "follow_up_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById("communication_c", id, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      const comm = response.data;
      return {
        Id: comm.Id,
        parentId: comm.parent_id_c?.Id || comm.parent_id_c || 0,
        teacherId: parseInt(comm.teacher_id_c) || 0,
        studentIds: comm.student_ids_c ? comm.student_ids_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
        type: comm.type_c || "",
        subject: comm.subject_c || "",
        notes: comm.notes_c || "",
        followUpRequired: comm.follow_up_required_c || false,
        followUpDate: comm.follow_up_date_c || "",
        createdAt: comm.created_at_c || new Date().toISOString(),
        updatedAt: comm.updated_at_c || new Date().toISOString()
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching communication with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async getByParentId(parentId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          {
            field: { Name: "parent_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "teacher_id_c" } },
          { field: { Name: "student_ids_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "follow_up_required_c" } },
          { field: { Name: "follow_up_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        where: [
          {
            FieldName: "parent_id_c",
            Operator: "EqualTo",
            Values: [parseInt(parentId)]
          }
        ],
        orderBy: [
          { fieldName: "created_at_c", sorttype: "DESC" }
        ]
      };
      
      const response = await apperClient.fetchRecords("communication_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Convert database fields to UI format
      return (response.data || []).map(comm => ({
        Id: comm.Id,
        parentId: comm.parent_id_c?.Id || comm.parent_id_c || 0,
        teacherId: parseInt(comm.teacher_id_c) || 0,
        studentIds: comm.student_ids_c ? comm.student_ids_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
        type: comm.type_c || "",
        subject: comm.subject_c || "",
        notes: comm.notes_c || "",
        followUpRequired: comm.follow_up_required_c || false,
        followUpDate: comm.follow_up_date_c || "",
        createdAt: comm.created_at_c || new Date().toISOString(),
        updatedAt: comm.updated_at_c || new Date().toISOString()
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching communications by parent ID:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
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
          {
            field: { Name: "parent_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "teacher_id_c" } },
          { field: { Name: "student_ids_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "follow_up_required_c" } },
          { field: { Name: "follow_up_date_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        where: [
          {
            FieldName: "student_ids_c",
            Operator: "Contains",
            Values: [studentId.toString()]
          }
        ],
        orderBy: [
          { fieldName: "created_at_c", sorttype: "DESC" }
        ]
      };
      
      const response = await apperClient.fetchRecords("communication_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Convert database fields to UI format and filter by exact student ID match
      return (response.data || []).map(comm => ({
        Id: comm.Id,
        parentId: comm.parent_id_c?.Id || comm.parent_id_c || 0,
        teacherId: parseInt(comm.teacher_id_c) || 0,
        studentIds: comm.student_ids_c ? comm.student_ids_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
        type: comm.type_c || "",
        subject: comm.subject_c || "",
        notes: comm.notes_c || "",
        followUpRequired: comm.follow_up_required_c || false,
        followUpDate: comm.follow_up_date_c || "",
        createdAt: comm.created_at_c || new Date().toISOString(),
        updatedAt: comm.updated_at_c || new Date().toISOString()
      })).filter(comm => comm.studentIds.includes(parseInt(studentId)));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching communications by student ID:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async create(communicationData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Convert UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          parent_id_c: parseInt(communicationData.parentId),
          teacher_id_c: parseInt(communicationData.teacherId) || 1,
          student_ids_c: Array.isArray(communicationData.studentIds) ? communicationData.studentIds.join(',') : communicationData.studentIds || "",
          type_c: communicationData.type,
          subject_c: communicationData.subject,
          notes_c: communicationData.notes,
          follow_up_required_c: communicationData.followUpRequired || false,
          follow_up_date_c: communicationData.followUpDate || "",
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord("communication_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create communication records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create communication");
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const comm = successfulRecord.data;
          return {
            Id: comm.Id,
            parentId: comm.parent_id_c?.Id || comm.parent_id_c || 0,
            teacherId: parseInt(comm.teacher_id_c) || 0,
            studentIds: comm.student_ids_c ? comm.student_ids_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
            type: comm.type_c || "",
            subject: comm.subject_c || "",
            notes: comm.notes_c || "",
            followUpRequired: comm.follow_up_required_c || false,
            followUpDate: comm.follow_up_date_c || "",
            createdAt: comm.created_at_c || new Date().toISOString(),
            updatedAt: comm.updated_at_c || new Date().toISOString()
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating communication:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async update(id, communicationData) {
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
          parent_id_c: parseInt(communicationData.parentId),
          teacher_id_c: parseInt(communicationData.teacherId) || 1,
          student_ids_c: Array.isArray(communicationData.studentIds) ? communicationData.studentIds.join(',') : communicationData.studentIds || "",
          type_c: communicationData.type,
          subject_c: communicationData.subject,
          notes_c: communicationData.notes,
          follow_up_required_c: communicationData.followUpRequired || false,
          follow_up_date_c: communicationData.followUpDate || "",
          updated_at_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.updateRecord("communication_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update communication records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update communication");
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const comm = successfulRecord.data;
          return {
            Id: comm.Id,
            parentId: comm.parent_id_c?.Id || comm.parent_id_c || 0,
            teacherId: parseInt(comm.teacher_id_c) || 0,
            studentIds: comm.student_ids_c ? comm.student_ids_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
            type: comm.type_c || "",
            subject: comm.subject_c || "",
            notes: comm.notes_c || "",
            followUpRequired: comm.follow_up_required_c || false,
            followUpDate: comm.follow_up_date_c || "",
            createdAt: comm.created_at_c || new Date().toISOString(),
            updatedAt: comm.updated_at_c || new Date().toISOString()
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating communication:", error?.response?.data?.message);
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
      
      const response = await apperClient.deleteRecord("communication_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete communication records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to delete communication");
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting communication:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }
};