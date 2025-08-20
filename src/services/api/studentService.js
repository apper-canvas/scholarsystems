import studentsData from "@/services/mockData/students.json";

let students = [...studentsData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const studentService = {
  async getAll() {
    await delay();
    return [...students];
  },

  async getById(id) {
    await delay();
    const student = students.find(s => s.Id === parseInt(id));
    if (!student) {
      throw new Error("Student not found");
    }
    return { ...student };
  },

  async create(studentData) {
    await delay();
    const maxId = Math.max(...students.map(s => s.Id), 0);
    const newStudent = {
      Id: maxId + 1,
      ...studentData
    };
    students.push(newStudent);
    return { ...newStudent };
  },

  async update(id, studentData) {
    await delay();
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    students[index] = { ...students[index], ...studentData };
    return { ...students[index] };
  },

  async delete(id) {
    await delay();
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    const deletedStudent = { ...students[index] };
    students.splice(index, 1);
    return deletedStudent;
  },

  async search(query) {
    await delay();
    if (!query.trim()) {
      return [...students];
    }
    
    const searchTerm = query.toLowerCase();
    return students.filter(student => 
      student.firstName.toLowerCase().includes(searchTerm) ||
      student.lastName.toLowerCase().includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm) ||
      student.grade.toLowerCase().includes(searchTerm)
    );
  }
};