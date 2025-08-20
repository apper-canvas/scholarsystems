import parentsData from "@/services/mockData/parents.json";

const delay = () => new Promise(resolve => setTimeout(resolve, 500));

let parents = [...parentsData];

export const parentService = {
  async getAll() {
    await delay();
    return parents.map(parent => ({ ...parent }));
  },

  async getById(id) {
    await delay();
    const parent = parents.find(p => p.Id === parseInt(id));
    if (!parent) {
      throw new Error("Parent not found");
    }
    return { ...parent };
  },

  async getByStudentId(studentId) {
    await delay();
    const studentParents = parents.filter(parent => 
      parent.studentIds.includes(parseInt(studentId))
    );
    return studentParents.map(parent => ({ ...parent }));
  },

  async create(parentData) {
    await delay();
    const maxId = Math.max(...parents.map(p => p.Id), 0);
    const newParent = {
      Id: maxId + 1,
      ...parentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    parents.push(newParent);
    return { ...newParent };
  },

  async update(id, parentData) {
    await delay();
    const index = parents.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Parent not found");
    }
    parents[index] = { 
      ...parents[index], 
      ...parentData,
      updatedAt: new Date().toISOString()
    };
    return { ...parents[index] };
  },

  async delete(id) {
    await delay();
    const index = parents.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Parent not found");
    }
    const deletedParent = parents[index];
    parents.splice(index, 1);
    return { ...deletedParent };
  }
};