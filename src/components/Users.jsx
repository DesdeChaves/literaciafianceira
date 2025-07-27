import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Table from './Table';

const Users = ({ users, openModal }) => {
  const [searchTerm, setSearchTerm] = useState('');

  console.log('Users component received:', users); // Debug

  const filteredUsers = users.filter((user) => {
    // Ensure user has required properties, provide fallback empty strings
    const nome = user.nome || '';
    const email = user.email || '';
    const numero_mecanografico = user.numero_mecanografico || '';

    return (
      nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      numero_mecanografico.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const columns = [
    { key: 'numero_mecanografico', label: 'Número Mecanográfico' },
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'Email' },
    { key: 'tipo_utilizador', label: 'Tipo' },
    {
      key: 'ativo',
      label: 'Estado',
      render: (value) => (value ? 'Ativo' : 'Inativo'),
    },
    {
      key: 'data_criacao',
      label: 'Data de Criação',
      render: (value) => new Date(value).toLocaleDateString('pt-PT'),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Utilizadores</h2>
        <button
          onClick={() => openModal('create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Utilizador</span>
        </button>
      </div>
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar utilizadores..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Table data={filteredUsers} columns={columns} openModal={openModal} />
    </div>
  );
};

export default Users;
