import { mockData } from '../data/mockData';
import { v4 as uuidv4 } from 'uuid';

export const getEnrollments = async () => {
  return mockData.enrollments; // Replace with: await axios.get('/api/enrollments');
};

export const createEnrollment = async (enrollmentData) => {
  console.log('Creating enrollment:', enrollmentData); // Debug log
  // Validate student and class exist
  const student = mockData.users.find((user) => user.id === enrollmentData.id && user.tipo_utilizador === 'ALUNO');
  const classObj = mockData.classes.find((cls) => cls.id === enrollmentData.turma_id);
  if (!student) throw new Error('Aluno não encontrado ou não é um estudante.');
  if (!classObj) throw new Error('Turma não encontrada.');

  // Check if student is already enrolled in another class
  const existingEnrollment = mockData.enrollments.find((enrollment) => enrollment.id === enrollmentData.id);
  if (existingEnrollment) throw new Error('Aluno já está matriculado em uma turma.');

  // Check if numero_aluno_na_turma is unique within the class
  const isNumeroUnique = !mockData.enrollments.some(
    (enrollment) =>
      enrollment.turma_id === enrollmentData.turma_id &&
      enrollment.numero_aluno_na_turma === enrollmentData.numero_aluno_na_turma
  );
  if (!isNumeroUnique) throw new Error('Número de aluno na turma já está em uso.');

  const newEnrollment = {
    ...enrollmentData,
    data_matricula: new Date().toISOString(),
  };
  mockData.enrollments = [...mockData.enrollments, newEnrollment]; // Immutable update

  // Update numero_alunos in the class
  const classIndex = mockData.classes.findIndex((cls) => cls.id === enrollmentData.turma_id);
  mockData.classes[classIndex] = {
    ...mockData.classes[classIndex],
    numero_alunos: (mockData.classes[classIndex].numero_alunos || 0) + 1,
  };

  return newEnrollment;
};

export const updateEnrollment = async (id, enrollmentData) => {
  const index = mockData.enrollments.findIndex((enrollment) => enrollment.id === id);
  if (index === -1) throw new Error('Matrícula não encontrada.');

  // Validate student and class exist
  const student = mockData.users.find((user) => user.id === id && user.tipo_utilizador === 'ALUNO');
  const classObj = mockData.classes.find((cls) => cls.id === enrollmentData.turma_id);
  if (!student) throw new Error('Aluno não encontrado ou não é um estudante.');
  if (!classObj) throw new Error('Turma não encontrada.');

  // Check if numero_aluno_na_turma is unique within the class (excluding current enrollment)
  const isNumeroUnique = !mockData.enrollments.some(
    (enrollment) =>
      enrollment.turma_id === enrollmentData.turma_id &&
      enrollment.numero_aluno_na_turma === enrollmentData.numero_aluno_na_turma &&
      enrollment.id !== id
  );
  if (!isNumeroUnique) throw new Error('Número de aluno na turma já está em uso.');

  const previousTurmaId = mockData.enrollments[index].turma_id;
  const updatedEnrollment = {
    ...enrollmentData,
    id,
    data_matricula: mockData.enrollments[index].data_matricula,
  };
  mockData.enrollments[index] = updatedEnrollment; // Replace with: await axios.put(`/api/enrollments/${id}`, enrollmentData);

  // Update numero_alunos if turma_id changed
  if (previousTurmaId !== enrollmentData.turma_id) {
    const oldClassIndex = mockData.classes.findIndex((cls) => cls.id === previousTurmaId);
    if (oldClassIndex !== -1) {
      mockData.classes[oldClassIndex] = {
        ...mockData.classes[oldClassIndex],
        numero_alunos: Math.max((mockData.classes[oldClassIndex].numero_alunos || 0) - 1, 0),
      };
    }
    const newClassIndex = mockData.classes.findIndex((cls) => cls.id === enrollmentData.turma_id);
    mockData.classes[newClassIndex] = {
      ...mockData.classes[newClassIndex],
      numero_alunos: (mockData.classes[newClassIndex].numero_alunos || 0) + 1,
    };
  }

  return updatedEnrollment;
};

export const deleteEnrollment = async (id) => {
  const index = mockData.enrollments.findIndex((enrollment) => enrollment.id === id);
  if (index === -1) throw new Error('Matrícula não encontrada.');

  const turmaId = mockData.enrollments[index].turma_id;
  mockData.enrollments.splice(index, 1); // Replace with: await axios.delete(`/api/enrollments/${id}`);

  // Update numero_alunos in the class
  const classIndex = mockData.classes.findIndex((cls) => cls.id === turmaId);
  if (classIndex !== -1) {
    mockData.classes[classIndex] = {
      ...mockData.classes[classIndex],
      numero_alunos: Math.max((mockData.classes[classIndex].numero_alunos || 0) - 1, 0),
    };
  }
};
