import React, { useState, useEffect } from 'react';
import { XCircle, ArrowRight } from 'lucide-react';
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionGroup,
} from '../services/transactionService';

const TransactionModal = ({ showModal, closeModal, modalType, selectedItem, setTransactions, users }) => {
  const [formData, setFormData] = useState({
    utilizador_origem_id: '',
    utilizador_destino_id: '',
    montante: '',
    tipo: 'CREDITO',
    descricao: '',
    status: 'PENDENTE',
  });
  const [errors, setErrors] = useState({});
  const [transactionPair, setTransactionPair] = useState([]);
  const [isLoadingPair, setIsLoadingPair] = useState(false);

  const activeUsers = users?.filter((user) => user.ativo) || [];

  useEffect(() => {
    const fetchTransactionPair = async (pairId) => {
      if (!pairId) return;
      setIsLoadingPair(true);
      try {
        const pairData = await getTransactionGroup(pairId);
        setTransactionPair(pairData);
      } catch (error) {
        console.error('Error fetching transaction pair:', error);
        setErrors((prev) => ({ ...prev, pair: 'Erro ao carregar a transação de contrapartida.' }));
      } finally {
        setIsLoadingPair(false);
      }
    };

    if (selectedItem) {
      setFormData({
        utilizador_origem_id: selectedItem.utilizador_origem_id || '',
        utilizador_destino_id: selectedItem.utilizador_destino_id || '',
        montante: selectedItem.montante || '',
        tipo: selectedItem.tipo || 'CREDITO',
        descricao: selectedItem.descricao || '',
        status: selectedItem.status || 'PENDENTE',
      });

      if (modalType === 'view' && selectedItem.transaction_pair_id) {
        fetchTransactionPair(selectedItem.transaction_pair_id);
      } else {
        setTransactionPair([]);
      }
    } else {
      setFormData({
        utilizador_origem_id: '',
        utilizador_destino_id: '',
        montante: '',
        tipo: 'CREDITO',
        descricao: '',
        status: 'PENDENTE',
      });
      setTransactionPair([]);
    }
    setErrors({});
  }, [selectedItem, modalType]);

  if (!showModal) return null;

  const isViewMode = modalType === 'view';
  const isEditMode = modalType === 'edit';
  const isCreateMode = modalType === 'create';
  const isDeleteMode = modalType === 'delete';

  const validateForm = () => {
    const newErrors = {};
    if (!formData.utilizador_origem_id) newErrors.utilizador_origem_id = 'Utilizador origem é obrigatório';
    if (!formData.utilizador_destino_id) newErrors.utilizador_destino_id = 'Utilizador destino é obrigatório';
    if (formData.utilizador_origem_id === formData.utilizador_destino_id) {
      newErrors.utilizador_destino_id = 'Utilizador destino deve ser diferente do utilizador origem';
    }
    if (!formData.montante || isNaN(formData.montante) || parseFloat(formData.montante) <= 0) {
      newErrors.montante = 'Montante é obrigatório e deve ser um número positivo';
    }
    if (!formData.descricao) newErrors.descricao = 'Descrição é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const transactionData = { ...formData, montante: parseFloat(formData.montante) };

      if (isCreateMode) {
        const newTransactions = await createTransaction(transactionData);
        setTransactions((prev) => [...prev, ...newTransactions]);
      } else if (isEditMode) {
        const updatedTransaction = await updateTransaction(selectedItem.id, transactionData);
        const updatedTransactions = Array.isArray(updatedTransaction) ? updatedTransaction : [updatedTransaction];
        
        setTransactions((prev) => {
          const otherTransactions = prev.filter(
            (t) => t.transaction_pair_id !== selectedItem.transaction_pair_id
          );
          return [...otherTransactions, ...updatedTransactions];
        });
      }
      closeModal();
    } catch (error) {
      setErrors({ general: error.message || 'Erro ao salvar transação.' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTransaction(selectedItem.id);
      setTransactions((prev) => prev.filter((txn) => txn.id !== selectedItem.id));
      closeModal();
    } catch (error) {
      setErrors({ general: error.message || 'Erro ao excluir transação.' });
    }
  };

  const getUserName = (userId) => {
    const user = activeUsers.find((u) => u.id === userId);
    return user ? user.nome : 'Utilizador não encontrado';
  };

  const TransactionDetail = ({ transaction, title }) => (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <h4 className="text-md font-semibold text-gray-800 mb-3">{title}</h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="font-medium text-gray-500">Origem:</div>
        <div>{getUserName(transaction.utilizador_origem_id)}</div>
        
        <div className="font-medium text-gray-500">Destino:</div>
        <div>{getUserName(transaction.utilizador_destino_id)}</div>

        <div className="font-medium text-gray-500">Montante:</div>
        <div>{transaction.montante} ValCoin</div>

        <div className="font-medium text-gray-500">Tipo:</div>
        <div>{transaction.tipo}</div>

        <div className="font-medium text-gray-500">Status:</div>
        <div>{transaction.status}</div>

        <div className="col-span-2 font-medium text-gray-500">Descrição:</div>
        <div className="col-span-2 text-gray-700">{transaction.descricao}</div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {errors.general && <p className="text-red-500 text-sm mb-4">{errors.general}</p>}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {isViewMode && 'Visualizar'}
              {isEditMode && 'Editar'}
              {isCreateMode && 'Criar Nova'}
              {isDeleteMode && 'Confirmar Exclusão'} Transação
            </h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          {isDeleteMode ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Tem certeza que deseja excluir a transação "{selectedItem.descricao}"? Esta ação não pode ser desfeita.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Origem:</strong> {getUserName(selectedItem.utilizador_origem_id)}</p>
                <p><strong>Destino:</strong> {getUserName(selectedItem.utilizador_destino_id)}</p>
                <p><strong>Montante:</strong> {selectedItem.montante} ValCoin</p>
              </div>
              <div className="flex justify-end space-x-3">
                <button onClick={closeModal} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancelar
                </button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Excluir
                </button>
              </div>
            </div>
          ) : isViewMode ? (
            <div className="space-y-6">
              {isLoadingPair ? (
                <p>A carregar dados da transação...</p>
              ) : errors.pair ? (
                <p className="text-red-500">{errors.pair}</p>
              ) : transactionPair.length > 0 ? (
                <div className="flex items-center justify-center space-x-4">
                  {transactionPair.map((txn, index) => (
                    <React.Fragment key={txn.id}>
                      <TransactionDetail 
                        transaction={txn} 
                        title={txn.descricao.includes('[Contrapartida]') ? 'Transação de Contrapartida' : 'Transação Original'}
                      />
                      {index === 0 && transactionPair.length > 1 && <ArrowRight className="w-8 h-8 text-gray-400" />}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <TransactionDetail transaction={selectedItem} title="Detalhes da Transação" />
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Utilizador Origem</label>
                  <select
                    name="utilizador_origem_id"
                    className={`w-full p-2 border rounded-lg ${errors.utilizador_origem_id ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.utilizador_origem_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione um utilizador</option>
                    {activeUsers.map((user) => (
                      <option key={user.id} value={user.id}>{user.nome}</option>
                    ))}
                  </select>
                  {errors.utilizador_origem_id && <p className="text-red-500 text-xs mt-1">{errors.utilizador_origem_id}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Utilizador Destino</label>
                  <select
                    name="utilizador_destino_id"
                    className={`w-full p-2 border rounded-lg ${errors.utilizador_destino_id ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.utilizador_destino_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione um utilizador</option>
                    {activeUsers.map((user) => (
                      <option key={user.id} value={user.id}>{user.nome}</option>
                    ))}
                  </select>
                  {errors.utilizador_destino_id && <p className="text-red-500 text-xs mt-1">{errors.utilizador_destino_id}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montante (ValCoin)</label>
                  <input
                    type="number"
                    name="montante"
                    step="0.01"
                    min="0"
                    className={`w-full p-2 border rounded-lg ${errors.montante ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.montante}
                    onChange={handleInputChange}
                  />
                  {errors.montante && <p className="text-red-500 text-xs mt-1">{errors.montante}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select name="tipo" className="w-full p-2 border border-gray-300 rounded-lg" value={formData.tipo} onChange={handleInputChange}>
                    <option value="CREDITO">Crédito</option>
                    <option value="DEBITO">Débito</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select name="status" className="w-full p-2 border border-gray-300 rounded-lg" value={formData.status} onChange={handleInputChange}>
                    <option value="PENDENTE">Pendente</option>
                    <option value="APROVADA">Aprovada</option>
                    <option value="REJEITADA">Rejeitada</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    name="descricao"
                    rows="3"
                    className={`w-full p-2 border rounded-lg ${errors.descricao ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.descricao}
                    onChange={handleInputChange}
                  />
                  {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao}</p>}
                </div>
              </div>
              {isCreateMode && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> Ao criar uma transação, será automaticamente criada uma transação inversa para manter o sistema de dupla entrada contabilística.
                  </p>
                </div>
              )}
              <div className="flex justify-end space-x-3 pt-4">
                <button onClick={closeModal} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancelar
                </button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {isCreateMode ? 'Criar' : 'Salvar'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
