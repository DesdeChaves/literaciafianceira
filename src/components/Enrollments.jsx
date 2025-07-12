import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Table from './Table';
import { mockData } from '../data/mockData';

const Enrollments = ({ enrollments, setEnrollments, users, classes, openModal }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getStudentName = (studentId) => {
    const student = users.find((user) => user.id === studentId);
    return student ? student.nome : 'N/A';
  };

  const getClassName = (turmaId) => {
    const classObj = classes.find((cls) => cls.id === turmaId);
    return classObj ? classObj.nome : 'N/A';
  };

  const filteredEnrollments = enrollments.filter(
    (enrollment) =>
      getStudentName(enrollment.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.numero_aluno_na_turma.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getClassName(enrollment.turma_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'id',
      label: 'Aluno',
      render: (studentId) => getStudentName(studentId),
    },
    { key: 'numero_aluno_na_turma', label: 'Número na Turma' },
    {
      key: 'turma_id',
      label: 'Turma',
      render: (turmaId) => getClassName(turmaId),
    },
    {
      key: 'data_matricula',
      label: 'Data de Matrícula',
      render: (value) => new Date(value).toLocaleDateString('pt-PT'),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Matrículas</h2>
        <button
          onClick={() => openModal('create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Matrícula</span>
        </button>
      </div>
      <div className="flex space-x-4">
        <div className="flex-1 relative">
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
      <Table data={filteredEnrollments} columns={columns} openModal={openModal} />
    </div>
  );
};

export default Enrollments;
