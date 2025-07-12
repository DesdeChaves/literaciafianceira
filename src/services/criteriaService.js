import { mockData } from '../data/mockData';
import { v4 as uuidv4 } from 'uuid';

export const getCriteria = async () => {
  return mockData.criteria; // Replace with: await axios.get('/api/criteria');
};

export const createCriteria = async (criteriaData) => {
  const newCriteria = { ...criteriaData, id: uuidv4() };
  mockData.criteria.push(newCriteria); // Replace with: await axios.post('/api/criteria', criteriaData);
  return newCriteria;
};

export const updateCriteria = async (id, criteriaData) => {
  const index = mockData.criteria.findIndex((crit) => crit.id === id);
  if (index === -1) throw new Error('Criteria not found');
  const updatedCriteria = { ...criteriaData, id };
  mockData.criteria[index] = updatedCriteria; // Replace with: await axios.put(`/api/criteria/${id}`, criteriaData);
  return updatedCriteria;
};

export const deleteCriteria = async (id) => {
  const index = mockData.criteria.findIndex((crit) => crit.id === id);
  if (index === -1) throw new Error('Criteria not found');
  mockData.criteria.splice(index, 1); // Replace with: await axios.delete(`/api/criteria/${id}`);
};
