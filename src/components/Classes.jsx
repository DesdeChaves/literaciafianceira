import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Table from './Table';
import { mockData } from '../data/mockData'; // Added import

const Classes = ({ classes, setClasses, users, openModal }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getProfessorName = (diretor_turma_id) => {
    const professor = users.find((user) => user.id === diretor_turma_id);
    return professor ? professor.nome : 'N/A';
  };

  const filteredClasses = classes.filter(
    (cls) =>
      cls.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProfessorName(cls.diretor_turma_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'codigo', label: 'Código' },
    { key: 'nome', label: 'Nome' },
    { key: 'ano_letivo', label: 'Ano Letivo' },
    {
      key: 'ciclo_id',
      label: 'Ciclo',
      render: (ciclo_id) => {
        const ciclo = mockData.ciclos_ensino.find((c) => c.id === ciclo_id);
        return ciclo ? ciclo.nome : 'N/A';
      },
    },
    {
      key: 'diretor_turma_id',
      label: 'Diretor de Turma',
      render: (diretor_turma_id) => getProfessorName(diretor_turma_id),
    },
    {
      key: 'ativo',
      label: 'Estado',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
          }`}
        >
          {value ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Turmas</h2>
        <button
          onClick={() => openModal('create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Turma</span>
        </button>
      </div>
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar turmas..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Table data={filteredClasses} columns={columns} openModal={openModal} />
    </div>
  );
};

export default Classes;
