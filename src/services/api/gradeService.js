export const gradeService = {
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
          { field: { Name: "subject_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "max_score_c" } },
          { field: { Name: "term_c" } },
          { field: { Name: "date_c" } },
          {
            field: { Name: "student_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [
          { fieldName: "date_c", sorttype: "DESC" }
        ]
      };
      
      const response = await apperClient.fetchRecords("grade_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Convert database fields to UI format
      return (response.data || []).map(grade => ({
        Id: grade.Id,
        subject: grade.subject_c || "",
        score: parseFloat(grade.score_c) || 0,
        maxScore: parseFloat(grade.max_score_c) || 100,
        term: grade.term_c || "",
        date: grade.date_c || "",
        studentId: grade.student_id_c?.Id || grade.student_id_c || 0
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades:", error?.response?.data?.message);
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
          { field: { Name: "subject_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "max_score_c" } },
          { field: { Name: "term_c" } },
          { field: { Name: "date_c" } },
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
      
      const response = await apperClient.fetchRecords("grade_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Convert database fields to UI format
      return (response.data || []).map(grade => ({
        Id: grade.Id,
        subject: grade.subject_c || "",
        score: parseFloat(grade.score_c) || 0,
        maxScore: parseFloat(grade.max_score_c) || 100,
        term: grade.term_c || "",
        date: grade.date_c || "",
        studentId: grade.student_id_c?.Id || grade.student_id_c || 0
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching student grades:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async getBySubject(subject) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "max_score_c" } },
          { field: { Name: "term_c" } },
          { field: { Name: "date_c" } },
          {
            field: { Name: "student_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        where: [
          {
            FieldName: "subject_c",
            Operator: "EqualTo",
            Values: [subject]
          }
        ],
        orderBy: [
          { fieldName: "date_c", sorttype: "DESC" }
        ]
      };
      
      const response = await apperClient.fetchRecords("grade_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Convert database fields to UI format
      return (response.data || []).map(grade => ({
        Id: grade.Id,
        subject: grade.subject_c || "",
        score: parseFloat(grade.score_c) || 0,
        maxScore: parseFloat(grade.max_score_c) || 100,
        term: grade.term_c || "",
        date: grade.date_c || "",
        studentId: grade.student_id_c?.Id || grade.student_id_c || 0
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching subject grades:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async create(gradeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Convert UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          subject_c: gradeData.subject,
          score_c: parseFloat(gradeData.score),
          max_score_c: parseFloat(gradeData.maxScore),
          term_c: gradeData.term,
          date_c: gradeData.date,
          student_id_c: parseInt(gradeData.studentId)
        }]
      };
      
      const response = await apperClient.createRecord("grade_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create grade records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create grade");
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const grade = successfulRecord.data;
          return {
            Id: grade.Id,
            subject: grade.subject_c || "",
            score: parseFloat(grade.score_c) || 0,
            maxScore: parseFloat(grade.max_score_c) || 100,
            term: grade.term_c || "",
            date: grade.date_c || "",
            studentId: grade.student_id_c?.Id || grade.student_id_c || 0
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating grade:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async update(id, gradeData) {
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
          subject_c: gradeData.subject,
          score_c: parseFloat(gradeData.score),
          max_score_c: parseFloat(gradeData.maxScore),
          term_c: gradeData.term,
          date_c: gradeData.date,
          student_id_c: parseInt(gradeData.studentId)
        }]
      };
      
      const response = await apperClient.updateRecord("grade_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update grade records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update grade");
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const grade = successfulRecord.data;
          return {
            Id: grade.Id,
            subject: grade.subject_c || "",
            score: parseFloat(grade.score_c) || 0,
            maxScore: parseFloat(grade.max_score_c) || 100,
            term: grade.term_c || "",
            date: grade.date_c || "",
            studentId: grade.student_id_c?.Id || grade.student_id_c || 0
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grade:", error?.response?.data?.message);
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
      
      const response = await apperClient.deleteRecord("grade_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete grade records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to delete grade");
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grade:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async getGradeStats() {
    try {
      const grades = await this.getAll();
      
      if (grades.length === 0) {
        return {
          averageGPA: 0,
          totalGrades: 0,
          gradeDistribution: { A: 0, B: 0, C: 0, D: 0, F: 0 },
          subjectAverages: {}
        };
      }

      // Calculate grade distribution and GPA
      const gradeDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
      let totalPoints = 0;

      grades.forEach(grade => {
        const percentage = (grade.score / grade.maxScore) * 100;
        let letterGrade, points;

        if (percentage >= 90) { letterGrade = "A"; points = 4; }
        else if (percentage >= 80) { letterGrade = "B"; points = 3; }
        else if (percentage >= 70) { letterGrade = "C"; points = 2; }
        else if (percentage >= 60) { letterGrade = "D"; points = 1; }
        else { letterGrade = "F"; points = 0; }

        gradeDistribution[letterGrade]++;
        totalPoints += points;
      });

      // Calculate subject averages
      const subjectGroups = grades.reduce((acc, grade) => {
        if (!acc[grade.subject]) acc[grade.subject] = [];
        acc[grade.subject].push((grade.score / grade.maxScore) * 100);
        return acc;
      }, {});

      const subjectAverages = {};
      Object.keys(subjectGroups).forEach(subject => {
        const scores = subjectGroups[subject];
        subjectAverages[subject] = (
          scores.reduce((sum, score) => sum + score, 0) / scores.length
        ).toFixed(1);
      });

      return {
        averageGPA: (totalPoints / grades.length).toFixed(2),
        totalGrades: grades.length,
        gradeDistribution,
        subjectAverages
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error getting grade stats:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return {
        averageGPA: 0,
        totalGrades: 0,
        gradeDistribution: { A: 0, B: 0, C: 0, D: 0, F: 0 },
        subjectAverages: {}
      };
    }
  }
};