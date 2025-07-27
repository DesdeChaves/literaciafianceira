// src/components/EnrollmentModal.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const EnrollmentModal = ({ isOpen, closeModal, modalType, selectedItem, users, classes, createAlunoTurma, updateAlunoTurma, setAlunoTurma }) => {
  const [formData, setFormData] = useState({
    aluno_id: '',
    turma_id: '',
    ano_letivo: '2024/2025',
    ativo: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('EnrollmentModal props:', { isOpen, modalType, selectedItem, usersLength: users?.length, classesLength: classes?.length });
    if (modalType === 'editAlunoTurma' && selectedItem) {
      setFormData({
        aluno_id: selectedItem.aluno_id || '',
        turma_id: selectedItem.turma_id || '',
        ano_letivo: selectedItem.ano_letivo || '2024/2025',
        ativo: selectedItem.ativo ?? true,
      });
    } else {
      setFormData({
        aluno_id: '',
        turma_id: '',
        ano_letivo: '2024/2025',
        ativo: true,
      });
    }
    setErrors({});
  }, [modalType, selectedItem, users, classes]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.aluno_id) newErrors.aluno_id = 'Selecione um aluno';
    if (!formData.turma_id) newErrors.turma_id = 'Selecione uma turma';
    if (!formData.ano_letivo) newErrors.ano_letivo = 'Ano letivo é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData);
    if (!validateForm()) {
      console.log('Validation errors:', errors);
      return;
    }
    setIsSubmitting(true);
    try {
      if (modalType === 'createAlunoTurma') {
        const response = await createAlunoTurma(formData);
        console.log('Created aluno_turma:', response.data);
        setAlunoTurma((prev) => [...prev, response.data]);
        toast.success('Matrícula criada com sucesso!');
      } else if (modalType === 'editAlunoTurma') {
        const response = await updateAlunoTurma(selectedItem.id, formData);
        console.log('Updated aluno_turma:', response.data);
        setAlunoTurma((prev) =>
          prev.map((item) => (item.id === selectedItem.id ? response.data : item))
        );
        toast.success('Matrícula atualizada com sucesso!');
      }
      closeModal();
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao salvar matrícula';
      console.error('Create/edit error:', errorMsg, error.response?.data);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    console.log('EnrollmentModal not rendering: isOpen is false');
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {modalType === 'createAlunoTurma' ? 'Nova Matrícula' : 'Editar Matrícula'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Aluno</label>
            <select
              value={formData.aluno_id}
              onChange={(e) => setFormData({ ...formData, aluno_id: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione um aluno</option>
              {users
                ?.filter(u => u.tipo_utilizador === 'ALUNO')
                .map(user => (
                  <option key={user.id} value={user.id}>
                    {user.nome}
                  </option>
                ))}
            </select>
            {errors.aluno_id && <p className="text-red-500 text-xs mt-1">{errors.aluno_id}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Turma</label>
            <select
              value={formData.turma_id}
              onChange={(e) => setFormData({ ...formData, turma_id: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione uma turma</option>
              {classes?.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.nome}
                </option>
              ))}
            </select>
            {errors.turma_id && <p className="text-red-500 text-xs mt-1">{errors.turma_id}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Ano Letivo</label>
            <input
              type="text"
              value={formData.ano_letivo}
              onChange={(e) => setFormData({ ...formData, ano_letivo: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.ano_letivo && <p className="text-red-500 text-xs mt-1">{errors.ano_letivo}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              value={formData.ativo}
              onChange={(e) => setFormData({ ...formData, ativo: e.target.value === 'true' })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={true}>Ativo</option>
              <option value={false}>Inativo</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentModal;
