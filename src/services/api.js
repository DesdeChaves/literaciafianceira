import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleRequest = async (request, endpointName) => {
  console.log(`Fetching ${endpointName} from /api/${endpointName} via Axios`);
  try {
    const response = await request();
    console.log(`${endpointName} response:`, response.data);
    return response;
  } catch (error) {
    console.error(`${endpointName} failed:`, {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

// Users
export const getUsers = () => handleRequest(() => apiClient.get('/api/users'), 'users');
export const getUser = (id) => handleRequest(() => apiClient.get(`/api/users/${id}`), 'user');
export const createUser = (data) => apiClient.post('/api/users', data); // Line 34
export const updateUser = (id, data) => apiClient.put(`/api/users/${id}`, data);
export const deleteUser = (id) => apiClient.delete(`/api/users/${id}`);

// Transactions
export const getTransactions = () => handleRequest(() => apiClient.get('/api/transactions'), 'transactions');
export const createTransaction = (data) => apiClient.post('/api/transactions', data);
export const updateTransaction = (id, data) => apiClient.put(`/api/transactions/${id}`, data);
export const deleteTransaction = (id) => apiClient.delete(`/api/transactions/${id}`);

// Subjects
export const getSubjects = () => handleRequest(() => apiClient.get('/api/subjects'), 'subjects');
export const createSubject = (data) => apiClient.post('/api/subjects', data);
export const updateSubject = (id, data) => apiClient.put(`/api/subjects/${id}`, data);
export const deleteSubject = (id) => apiClient.delete(`/api/subjects/${id}`);

// Classes
export const getClasses = () => handleRequest(() => apiClient.get('/api/classes'), 'classes');
export const createClass = (data) => apiClient.post('/api/classes', data);
export const updateClass = (id, data) => apiClient.put(`/api/classes/${id}`, data);
export const deleteClass = (id) => apiClient.delete(`/api/classes/${id}`);

// Enrollments (aluno_disciplina, kept for compatibility)
export const getEnrollments = () => handleRequest(() => apiClient.get('/api/enrollments'), 'enrollments');
export const getEnrollment = (id) => handleRequest(() => apiClient.get(`/api/enrollments/${id}`), 'enrollment');
export const createEnrollment = (data) => apiClient.post('/api/enroll', data);
export const updateEnrollment = (id, data) => apiClient.put(`/api/enrollments/${id}`, data);
export const deleteEnrollment = (id) => apiClient.delete(`/api/enrollments/${id}`);

// Aluno-Turma
export const getAlunoTurma = () => handleRequest(() => apiClient.get('/api/aluno_turma'), 'aluno_turma');
export const getAlunoTurmaById = (id) => handleRequest(() => apiClient.get(`/api/aluno_turma/${id}`), 'aluno_turma');
export const createAlunoTurma = (data) => apiClient.post('/api/aluno_turma', data);
export const updateAlunoTurma = (id, data) => apiClient.put(`/api/aluno_turma/${id}`, data);
export const deleteAlunoTurma = (id) => apiClient.delete(`/api/aluno_turma/${id}`);

// Transaction Rules
export const getTransactionRules = () => handleRequest(() => apiClient.get('/api/transaction-rules'), 'transaction-rules');
export const createTransactionRule = (data) => apiClient.post('/api/transaction-rules', data);
export const updateTransactionRule = (id, data) => apiClient.put(`/api/transaction-rules/${id}`, data);
export const deleteTransactionRule = (id) => apiClient.delete(`/api/transaction-rules/${id}`);

// Ciclos
export const getCiclos = () => handleRequest(() => apiClient.get('/api/ciclos'), 'ciclos');
