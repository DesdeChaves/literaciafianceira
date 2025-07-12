import { mockData } from '../data/mockData';
import { v4 as uuidv4 } from 'uuid';

export const getClasses = async () => {
  return mockData.classes; // Replace with: await axios.get('/api/classes');
};

export const createClass = async (classData) => {
  console.log('Creating class:', classData); // Debug log
  const newClass = {
    ...classData,
    id: uuidv4(),
    numero_alunos: 0, // Calculated in future API
    data_criacao: new Date().toISOString(),
  };
  mockData.classes = [...mockData.classes, newClass]; // Immutable update
  return newClass;
};

export const updateClass = async (id, classData) => {
  const index = mockData.classes.findIndex((cls) => cls.id === id);
  if (index === -1) throw new Error('Class not found');
  const updatedClass = {
    ...classData,
    id,
    numero_alunos: 0, // Calculated in future API
    data_criacao: mockData.classes[index].data_criacao,
  };
  mockData.classes[index] = updatedClass; // Replace with: await axios.put(`/api/classes/${id}`, classData);
  return updatedClass;
};

export const deleteClass = async (id) => {
  const index = mockData.classes.findIndex((cls) => cls.id === id);
  if (index === -1) throw new Error('Class not found');
  mockData.classes.splice(index, 1); // Replace with: await axios.delete(`/api/classes/${id}`);
};
