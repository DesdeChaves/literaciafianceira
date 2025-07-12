import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Table from './Table';

const Criteria = ({ transactions, setTransactions, searchTerm, setSearchTerm, filterStatus, setFilterStatus, openModal }) => {
  const filteredTransactions = transactions.filter(
    (txn) =>
      (filterStatus === 'all' || txn.type === filterStatus) &&
      (txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.user_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = [
    { key: 'user_id', label: 'Utilizador ID' },
    { key: 'amount', label: 'Montante' },
    { key: 'type', label: 'Tipo' },
    { key: 'description', label: 'Descrição' },
    {
      key: 'date',
      label: 'Data',
      render: (value) => (value ? new Date(value).toLocaleDateString('pt-PT') : '-'),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Transações</h2>
        <button
          onClick={() => openModal('create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Transação</span>
        </button>
      </div>
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar transações..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="CREDIT">Crédito</option>
          <option value="DEBIT">Débito</option>
        </select>
      </div>
      <Table data={filteredTransactions} columns={columns} openModal={openModal} />
    </div>
  );
};

export default Criteria;
