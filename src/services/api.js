
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUsers = () => apiClient.get('/users');
export const getUser = (id) => apiClient.get(`/users/${id}`);
export const createUser = (data) => apiClient.post('/users', data);
export const updateUser = (id, data) => apiClient.put(`/users/${id}`, data);
export const deleteUser = (id) => apiClient.delete(`/users/${id}`);

export const getTransactions = () => apiClient.get('/transactions');
export const createTransaction = (data) => apiClient.post('/transactions', data);

export const getSubjects = () => apiClient.get('/subjects');
export const createSubject = (data) => apiClient.post('/subjects', data);
export const updateSubject = (id, data) => apiClient.put(`/subjects/${id}`, data);
export const deleteSubject = (id) => apiClient.delete(`/subjects/${id}`);

export const getClasses = () => apiClient.get('/classes');
export const createClass = (data) => apiClient.post('/classes', data);
export const updateClass = (id, data) => apiClient.put(`/classes/${id}`, data);
export const deleteClass = (id) => apiClient.delete(`/classes/${id}`);

export const getCriteria = () => apiClient.get('/criteria');
export const createCriteria = (data) => apiClient.post('/criteria', data);
export const updateCriteria = (id, data) => apiClient.put(`/criteria/${id}`, data);
export const deleteCriteria = (id) => apiClient.delete(`/criteria/${id}`);

export const enrollStudent = (data) => apiClient.post('/enroll', data);

export const getTransactionRules = () => apiClient.get('/transaction-rules');
export const createTransactionRule = (data) => apiClient.post('/transaction-rules', data);
export const updateTransactionRule = (id, data) => apiClient.put(`/transaction-rules/${id}`, data);
export const deleteTransactionRule = (id) => apiClient.delete(`/transaction-rules/${id}`);
