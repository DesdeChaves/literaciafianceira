import React, { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import { createTransaction, updateTransaction, deleteTransaction } from '../services/transactionService';

const CriteriaModal = ({ showModal, closeModal, modalType, selectedItem, setTransactions }) => {
  const [formData, setFormData] = useState({
    user_id: '',
    amount: '',
    type: 'CREDIT',
    description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedItem && modalType !== 'create') {
      setFormData({
        user_id: selectedItem.user_id || '',
        amount: selectedItem.amount || '',
        type: selectedItem.type || 'CREDIT',
        description: selectedItem.description || '',
      });
    } else {
      setFormData({
        user_id: '',
        amount: '',
        type: 'CREDIT',
        description: '',
      });
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
    if (!formData.user_id) newErrors.user_id = 'Utilizador é obrigatório';
    if (!formData.amount || isNaN(formData.amount)) newErrors.amount = 'Montante é obrigatório e deve ser numérico';
    if (!formData.description) newErrors.description = 'Descrição é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isCreateMode) {
        const newTransaction = await createTransaction(formData);
        setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
      } else if (isEditMode) {
        const updatedTransaction = await updateTransaction(selectedItem.id, formData);
        setTransactions((prevTransactions) =>
          prevTransactions.map((txn) => (txn.id === selectedItem.id ? updatedTransaction : txn))
        );
      }
      closeModal();
    } catch (error) {
      setErrors({ general: error.message || 'Erro ao salvar transação.' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTransaction(selectedItem.id);
      setTransactions((prevTransactions) => prevTransactions.filter((txn) => txn.id !== selectedItem.id));
      closeModal();
    } catch (error) {
      setErrors({ general: error.message || 'Erro ao excluir transação.' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                Tem certeza que deseja excluir a transação "{selectedItem.description}"? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Excluir
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Utilizador ID</label>
                  <input
                    type="text"
                    name="user_id"
                    className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.user_id ? 'border-red-500' : ''
                    }`}
                    value={formData.user_id}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                  {errors.user_id && <p className="text-red-500 text-xs mt-1">{errors.user_id}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montante</label>
                  <input
                    type="number"
                    name="amount"
                    className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.amount ? 'border-red-500' : ''
                    }`}
                    value={formData.amount}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                  {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    name="type"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.type}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  >
                    <option value="CREDIT">Crédito</option>
                    <option value="DEBIT">Débito</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <input
                    type="text"
                    name="description"
                    className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : ''
                    }`}
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>
              </div>
              {!isViewMode && (
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {isCreateMode ? 'Criar' : 'Salvar'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CriteriaModal;
