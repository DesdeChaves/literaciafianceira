import React, { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';

const Transactions = ({ transactions, setTransactions, users, searchTerm, setSearchTerm, filterStatus, setFilterStatus, openModal }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filter transactions to show only original transactions
  const originalTransactions = transactions.filter(txn => !txn.descricao.includes('[Contrapartida]'));

  // Filter transactions based on search term and status
  const filteredTransactions = originalTransactions.filter((txn) => {
    const matchesSearch = searchTerm === '' || 
      txn.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.utilizador_origem_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.utilizador_destino_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.montante?.toString().includes(searchTerm);

    const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Sort transactions
  const sortedTransactions = React.useMemo(() => {
    let sortableTransactions = [...filteredTransactions];
    if (sortConfig.key) {
      sortableTransactions.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle different data types
        if (sortConfig.key === 'montante') {
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
        } else if (sortConfig.key === 'data_transacao') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else {
          aValue = aValue?.toString().toLowerCase() || '';
          bValue = bValue?.toString().toLowerCase() || '';
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTransactions;
  }, [filteredTransactions, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatCurrency = (amount) => {
    return `${parseFloat(amount).toFixed(2)}€`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDENTE': { color: 'bg-yellow-100 text-yellow-800', text: 'Pendente' },
      'APROVADA': { color: 'bg-green-100 text-green-800', text: 'Aprovada' },
      'REJEITADA': { color: 'bg-red-100 text-red-800', text: 'Rejeitada' }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getTipoBadge = (tipo) => {
    const tipoConfig = {
      'CREDITO': { color: 'bg-blue-100 text-blue-800', text: 'Crédito' },
      'DEBITO': { color: 'bg-orange-100 text-orange-800', text: 'Débito' }
    };
    
    const config = tipoConfig[tipo] || { color: 'bg-gray-100 text-gray-800', text: tipo };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return <span className="ml-1 text-gray-400">↕</span>;
    }
    return (
      <span className="ml-1 text-blue-600">
        {sortConfig.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

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

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar por descrição, utilizador ou montante..."
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
          <option value="all">Todos os Status</option>
          <option value="PENDENTE">Pendente</option>
          <option value="APROVADA">Aprovada</option>
          <option value="REJEITADA">Rejeitada</option>
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Total Transações</div>
          <div className="text-xl font-semibold">{sortedTransactions.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Pendentes</div>
          <div className="text-xl font-semibold text-yellow-600">
            {sortedTransactions.filter(t => t.status === 'PENDENTE').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Aprovadas</div>
          <div className="text-xl font-semibold text-green-600">
            {sortedTransactions.filter(t => t.status === 'APROVADA').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Rejeitadas</div>
          <div className="text-xl font-semibold text-red-600">
            {sortedTransactions.filter(t => t.status === 'REJEITADA').length}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('utilizador_origem_nome')}
                >
                  Origem
                  <SortIcon column="utilizador_origem_nome" />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('utilizador_destino_nome')}
                >
                  Destino
                  <SortIcon column="utilizador_destino_nome" />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('montante')}
                >
                  Montante
                  <SortIcon column="montante" />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('tipo')}
                >
                  Tipo
                  <SortIcon column="tipo" />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  Status
                  <SortIcon column="status" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('data_transacao')}
                >
                  Data
                  <SortIcon column="data_transacao" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedTransactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    {transactions.length === 0 ? 'Nenhuma transação disponível' : 'Nenhuma transação encontrada com os filtros aplicados'}
                  </td>
                </tr>
              ) : (
                sortedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.utilizador_origem_nome || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.utilizador_destino_nome || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(transaction.montante)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getTipoBadge(transaction.tipo)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {transaction.descricao || 'Sem descrição'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.data_transacao)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal('view', transaction)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal('edit', transaction)}
                          className="text-green-600 hover:text-green-800"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal('delete', transaction)}
                          className="text-red-600 hover:text-red-800"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Info */}
      {sortedTransactions.length > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Mostrando {sortedTransactions.length} de {originalTransactions.length} transações
        </div>
      )}
    </div>
  );
};

export default Transactions;

