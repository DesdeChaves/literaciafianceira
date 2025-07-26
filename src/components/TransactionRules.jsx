import React, { useState, useEffect } from 'react';
import { getTransactionRules, createTransactionRule, updateTransactionRule, deleteTransactionRule } from '../services/transactionRuleService';
import TransactionRuleModal from './TransactionRuleModal';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const TransactionRules = () => {
  const [rules, setRules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const data = await getTransactionRules();
      setRules(data);
    } catch (error) {
      console.error('Error fetching transaction rules:', error);
    }
  };

  const handleCreate = () => {
    setSelectedRule(null);
    setIsModalOpen(true);
  };

  const handleEdit = (rule) => {
    setSelectedRule(rule);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransactionRule(id);
      fetchRules();
    } catch (error) {
      console.error('Error deleting transaction rule:', error);
    }
  };

  const handleSave = async (rule) => {
    try {
      if (rule.id) {
        await updateTransactionRule(rule.id, rule);
      } else {
        await createTransactionRule(rule);
      }
      fetchRules();
    } catch (error) {
      console.error('Error saving transaction rule:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Regras de Transação</h1>
        <button
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="mr-2" size={20} />
          Adicionar Regra
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Valor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rules.map((rule) => (
              <tr key={rule.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rule.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{rule.tipo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{rule.valor}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleEdit(rule)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <Edit size={20} />
                  </button>
                  <button onClick={() => handleDelete(rule.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <TransactionRuleModal
          rule={selectedRule}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default TransactionRules;