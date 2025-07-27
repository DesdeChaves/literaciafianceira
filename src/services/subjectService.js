// src/services/subjectService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users`, userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await axios.put(`${API_URL}/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  await axios.delete(`${API_URL}/users/${id}`);
};

export const getTransactions = async () => {
  const response = await axios.get(`${API_URL}/transactions`);
  return response.data;
};

export const createTransaction = async (transactionData) => {
  const response = await axios.post(`${API_URL}/transactions`, transactionData);
  return response.data;
};

export const getSubjects = async () => {
  const response = await axios.get(`${API_URL}/subjects`);
  return response.data;
};

export const createSubject = async (subjectData) => {
  const response = await axios.post(`${API_URL}/subjects`, subjectData);
  return response.data;
};

export const updateSubject = async (id, subjectData) => {
  const response = await axios.put(`${API_URL}/subjects/${id}`, subjectData);
  return response.data;
};

export const deleteSubject = async (id) => {
  await axios.delete(`${API_URL}/subjects/${id}`);
};

export const getClasses = async () => {
  const response = await axios.get(`${API_URL}/classes`);
  return response.data;
};

export const createClass = async (classData) => {
  const response = await axios.post(`${API_URL}/classes`, classData);
  return response.data;
};

export const updateClass = async (id, classData) => {
  const response = await axios.put(`${API_URL}/classes/${id}`, classData);
  return response.data;
};

export const deleteClass = async (id) => {
  await axios.delete(`${API_URL}/classes/${id}`);
};

export const getEnrollments = async () => {
  const response = await axios.get(`${API_URL}/enrollments`);
  return response.data;
};

export const createStudentEnrollment = async (enrollmentData) => {
  const response = await axios.post(`${API_URL}/enroll`, enrollmentData);
  return response.data;
};

export const removeStudentEnrollment = async (id) => {
  await axios.delete(`${API_URL}/enrollments/${id}`);
};

export const getTransactionRules = async () => {
  const response = await axios.get(`${API_URL}/transactionRules`);
  return response.data;
};

export const createTransactionRule = async (ruleData) => {
  const response = await axios.post(`${API_URL}/transactionRules`, ruleData);
  return response.data;
};

export const updateTransactionRule = async (id, ruleData) => {
  const response = await axios.put(`${API_URL}/transactionRules/${id}`, ruleData);
  return response.data;
};

export const getCiclos = async () => {
  const response = await axios.get(`${API_URL}/ciclos`);
  return response.data;
};

export const getAlunoTurma = async () => {
  const response = await axios.get(`${API_URL}/aluno_turma`);
  return response.data;
};

export const createAlunoTurma = async (enrollmentData) => {
  const response = await axios.post(`${API_URL}/aluno_turma`, enrollmentData);
  return response.data;
};

export const updateAlunoTurma = async (id, enrollmentData) => {
  const response = await axios.put(`${API_URL}/aluno_turma/${id}`, enrollmentData);
  return response.data;
};

export const getDisciplinaTurma = async () => {
  const response = await axios.get(`${API_URL}/disciplina_turma`);
  return response.data;
};

export const createDisciplinaTurma = async (data) => {
  const response = await axios.post(`${API_URL}/disciplina_turma`, data);
  return response.data;
};

export const getProfessorDisciplinaTurma = async () => {
  const response = await axios.get(`${API_URL}/professor_disciplina_turma`);
  return response.data;
};

export const createTeacherAssignment = async (assignmentData) => {
  const response = await axios.post(`${API_URL}/professor_disciplina_turma`, assignmentData);
  return response.data;
};

export const removeTeacherAssignment = async (id) => {
  await axios.delete(`${API_URL}/professor_disciplina_turma/${id}`);
};
