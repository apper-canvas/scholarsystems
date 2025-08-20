import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const gradeService = {
  async getAll() {
    await delay();
    return [...grades];
  },

  async getByStudent(studentId) {
    await delay();
    return grades.filter(grade => grade.studentId === parseInt(studentId));
  },

  async getBySubject(subject) {
    await delay();
    return grades.filter(grade => grade.subject === subject);
  },

  async create(gradeData) {
    await delay();
    const maxId = Math.max(...grades.map(g => g.Id), 0);
    const newGrade = {
      Id: maxId + 1,
      ...gradeData,
      studentId: parseInt(gradeData.studentId)
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, gradeData) {
    await delay();
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    grades[index] = { 
      ...grades[index], 
      ...gradeData,
      studentId: parseInt(gradeData.studentId || grades[index].studentId)
    };
    return { ...grades[index] };
  },

  async delete(id) {
    await delay();
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    const deletedGrade = { ...grades[index] };
    grades.splice(index, 1);
    return deletedGrade;
  },

  async getGradeStats() {
    await delay();
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
  }
};