import { mockData } from '../data/mockData';
import { v4 as uuidv4 } from 'uuid';

export const getSubjects = async () => {
  console.log('getSubjects called, returning:', mockData.subjects); // Debug
  return [...mockData.subjects]; // Return a copy
};

export const createSubject = async (subjectData) => {
  console.log('Creating subject:', subjectData); // Debug
  const existingSubject = mockData.subjects.find(
    (subject) =>
      subject.nome === subjectData.nome || subject.codigo === subjectData.codigo
  );
  if (existingSubject) throw new Error('Nome ou código da disciplina já está em uso.');

  const newSubject = {
    ...subjectData,
    id: uuidv4(),
  };
  mockData.subjects = [...mockData.subjects, newSubject];
  console.log('Updated mockData.subjects:', mockData.subjects); // Debug
  return newSubject;
};

export const updateSubject = async (id, subjectData) => {
  const index = mockData.subjects.findIndex((subject) => subject.id === id);
  if (index === -1) throw new Error('Disciplina não encontrada.');

  const existingSubject = mockData.subjects.find(
    (subject) =>
      (subject.nome === subjectData.nome || subject.codigo === subjectData.codigo) &&
      subject.id !== id
  );
  if (existingSubject) throw new Error('Nome ou código da disciplina já está em uso.');

  const updatedSubject = {
    ...mockData.subjects[index],
    ...subjectData,
    id,
  };
  mockData.subjects[index] = updatedSubject;
  console.log('Updated mockData.subjects:', mockData.subjects); // Debug
  return updatedSubject;
};

export const deleteSubject = async (id) => {
  const index = mockData.subjects.findIndex((subject) => subject.id === id);
  if (index === -1) throw new Error('Disciplina não encontrada.');
  mockData.subjects.splice(index, 1);
  console.log('Updated mockData.subjects:', mockData.subjects); // Debug
};

export const createStudentEnrollment = async (enrollmentData) => {
  console.log('Creating student enrollment:', enrollmentData); // Debug
  const student = mockData.users.find(
    (user) => user.id === enrollmentData.aluno_id && user.tipo_utilizador === 'ALUNO'
  );
  const subject = mockData.subjects.find((subject) => subject.id === enrollmentData.disciplina_id);
  if (!student) throw new Error('Aluno não encontrado.');
  if (!subject) throw new Error('Disciplina não encontrada.');

  const existingEnrollment = mockData.aluno_disciplina.find(
    (ad) =>
      ad.aluno_id === enrollmentData.aluno_id &&
      ad.disciplina_id === enrollmentData.disciplina_id &&
      ad.ano_letivo === enrollmentData.ano_letivo &&
      ad.ativo
  );
  if (existingEnrollment) throw new Error('Aluno já está inscrito nesta disciplina para o ano letivo.');

  const newEnrollment = {
    ...enrollmentData,
    id: uuidv4(),
    ativo: true,
  };
  mockData.aluno_disciplina = [...mockData.aluno_disciplina, newEnrollment];
  console.log('Updated mockData.aluno_disciplina:', mockData.aluno_disciplina); // Debug
  return newEnrollment;
};

export const removeStudentEnrollment = async (enrollmentId) => {
  console.log('Removing student enrollment:', enrollmentId); // Debug
  const index = mockData.aluno_disciplina.findIndex((ad) => ad.id === enrollmentId);
  if (index === -1) throw new Error('Inscrição não encontrada.');
  mockData.aluno_disciplina[index] = { ...mockData.aluno_disciplina[index], ativo: false };
  console.log('Updated mockData.aluno_disciplina:', mockData.aluno_disciplina); // Debug
};

export const createTeacherAssignment = async (assignmentData) => {
  console.log('Creating teacher assignment:', assignmentData); // Debug
  const teacher = mockData.users.find(
    (user) => user.id === assignmentData.professor_id && user.tipo_utilizador === 'PROFESSOR'
  );
  const subject = mockData.subjects.find((subject) => subject.id === assignmentData.disciplina_id);
  const classe = mockData.classes.find((cls) => cls.id === assignmentData.turma_id);
  if (!teacher) throw new Error('Professor não encontrado.');
  if (!subject) throw new Error('Disciplina não encontrada.');
  if (!classe) throw new Error('Turma não encontrada.');

  const existingAssignment = mockData.professor_disciplina_turma.find(
    (pdt) =>
      pdt.professor_id === assignmentData.professor_id &&
      pdt.disciplina_id === assignmentData.disciplina_id &&
      pdt.turma_id === assignmentData.turma_id &&
      pdt.ano_letivo === assignmentData.ano_letivo &&
      pdt.ativo
  );
  if (existingAssignment) throw new Error('Professor já está atribuído a esta disciplina e turma para o ano letivo.');

  const newAssignment = {
    ...assignmentData,
    id: uuidv4(),
    ativo: true,
  };
  mockData.professor_disciplina_turma = [...mockData.professor_disciplina_turma, newAssignment];
  console.log('Updated mockData.professor_disciplina_turma:', mockData.professor_disciplina_turma); // Debug
  return newAssignment;
};

export const removeTeacherAssignment = async (assignmentId) => {
  console.log('Removing teacher assignment:', assignmentId); // Debug
  const index = mockData.professor_disciplina_turma.findIndex((pdt) => pdt.id === assignmentId);
  if (index === -1) throw new Error('Atribuição não encontrada.');
  mockData.professor_disciplina_turma[index] = { ...mockData.professor_disciplina_turma[index], ativo: false };
  console.log('Updated mockData.professor_disciplina_turma:', mockData.professor_disciplina_turma); // Debug
};
