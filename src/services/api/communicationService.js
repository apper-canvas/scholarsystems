import communicationsData from "@/services/mockData/communications.json";

const delay = () => new Promise(resolve => setTimeout(resolve, 500));

let communications = [...communicationsData];

export const communicationService = {
  async getAll() {
    await delay();
    return communications
      .map(comm => ({ ...comm }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(id) {
    await delay();
    const communication = communications.find(c => c.Id === parseInt(id));
    if (!communication) {
      throw new Error("Communication not found");
    }
    return { ...communication };
  },

  async getByParentId(parentId) {
    await delay();
    const parentCommunications = communications.filter(comm => 
      comm.parentId === parseInt(parentId)
    );
    return parentCommunications
      .map(comm => ({ ...comm }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getByStudentId(studentId) {
    await delay();
    const studentCommunications = communications.filter(comm => 
      comm.studentIds.includes(parseInt(studentId))
    );
    return studentCommunications
      .map(comm => ({ ...comm }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async create(communicationData) {
    await delay();
    const maxId = Math.max(...communications.map(c => c.Id), 0);
    const newCommunication = {
      Id: maxId + 1,
      ...communicationData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    communications.push(newCommunication);
    return { ...newCommunication };
  },

  async update(id, communicationData) {
    await delay();
    const index = communications.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Communication not found");
    }
    communications[index] = { 
      ...communications[index], 
      ...communicationData,
      updatedAt: new Date().toISOString()
    };
    return { ...communications[index] };
  },

  async delete(id) {
    await delay();
    const index = communications.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Communication not found");
    }
    const deletedCommunication = communications[index];
    communications.splice(index, 1);
    return { ...deletedCommunication };
  }
};