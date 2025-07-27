// src/components/Enrollments.jsx
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Table from './Table';
import {
  createAlunoTurma,
  updateAlunoTurma,
  deleteAlunoTurma,
} from '../services/api';

const Enrollments = ({ alunoTurma, setAlunoTurma, users, classes, openModal }) => {
  const [searchTerm, setSearchTerm] = useState('');

  console.log('Enrollments component received:', { alunoTurma, users, classes });

  const getUserName = (id) => {
    if (!users || !Array.isArray(users)) {
      console.warn('Users prop is invalid:', users);
      return 'Unknown';
    }
    const user = users.find(user => user.id === id);
    return user ? user.nome : 'Unknown';
  };

  const getClassName = (id) => {
    if (!classes || !Array.isArray(classes)) {
      console.warn('Classes prop is invalid:', classes);
      return 'Unknown';
    }
    const classData = classes.find(c => c.id === id);
    return classData ? classData.nome : 'Unknown';
  };

  const filteredEnrollments = alunoTurma.filter(
    enrollment =>
      getUserName(enrollment.aluno_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getClassName(enrollment.turma_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('Filtered enrollments:', filteredEnrollments);

  const columns = [
    { key: 'aluno_id', label: 'Aluno', render: (value) => getUserName(value) },
    { key: 'turma_id', label: 'Turma', render: (value) => getClassName(value) },
    { key: 'ano_letivo', label: 'Ano Letivo' },
    {
      key: 'ativo',
      label: 'Estado',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${value ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}
        >
          {value ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
  ];

  const handleCreate = async (enrollmentData) => {
    try {
      const response = await createAlunoTurma(enrollmentData);
      setAlunoTurma([...alunoTurma, response.data]);
      console.log('Created aluno_turma:', response.data);
    } catch (error) {
      console.error('Error creating aluno_turma:', error);
      throw error;
    }
  };

  const handleUpdate = async (id, enrollmentData) => {
    try {
      const response = await updateAlunoTurma(id, enrollmentData);
      setAlunoTurma(alunoTurma.map(e => e.id === id ? response.data : e));
      console.log('Updated aluno_turma:', response.data);
    } catch (error) {
      console.error('Error updating aluno_turma:', error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAlunoTurma(id);
      setAlunoTurma(alunoTurma.filter(e => e.id !== id));
      console.log('Deleted aluno_turma:', id);
    } catch (error) {
      console.error('Error deleting aluno_turma:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Matrículas (Alunos-Turmas)</h2>
        <button
          onClick={() => {
            console.log('Matricular Aluno button clicked');
            openModal('createAlunoTurma');
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Matricular Aluno</span>
        </button>
      </div>
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar matrículas..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Table
        data={filteredEnrollments}
        columns={columns}
        openModal={(type, item) => openModal(type === 'create' ? 'createAlunoTurma' : 'editAlunoTurma', item)}
        onEdit={(item) => openModal('editAlunoTurma', item)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Enrollments;
