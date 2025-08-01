// ClassModal.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { createClass, updateClass, deleteClass } from '../services/api';

const ClassModal = ({ showModal, closeModal, modalType, selectedItem, setClasses, users, ciclos }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    ano_letivo: '',
    ciclo_id: '',
    diretor_turma_id: '',
    ativo: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const professors = useMemo(() => users.filter((user) => user.tipo_utilizador === 'PROFESSOR'), [users]);

  useEffect(() => {
    if (!showModal) return;
    if (selectedItem && modalType !== 'create') {
      setFormData({
        codigo: selectedItem.codigo || '',
        nome: selectedItem.nome || '',
        ano_letivo: selectedItem.ano_letivo || '',
        ciclo_id: selectedItem.ciclo_id || '',
        diretor_turma_id: selectedItem.diretor_turma_id || '',
        ativo: selectedItem.ativo !== undefined ? selectedItem.ativo : true,
      });
    } else {
      setFormData({
        codigo: '',
        nome: '',
        ano_letivo: '',
        ciclo_id: ciclos.length > 0 ? ciclos[0].id : '',
        diretor_turma_id: professors.length > 0 ? professors[0].id : '',
        ativo: true,
      });
    }
    setErrors({});
  }, [showModal, modalType, selectedItem, ciclos, professors]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.codigo) newErrors.codigo = 'Código é obrigatório';
    else if (formData.codigo.length > 10) newErrors.codigo = 'Código deve ter no máximo 10 caracteres';
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    else if (formData.nome.length > 255) newErrors.nome = 'Nome deve ter no máximo 255 caracteres';
    if (!formData.ano_letivo) newErrors.ano_letivo = 'Ano letivo é obrigatório';
    else {
      const [startYear, endYear] = formData.ano_letivo.split('/');
      if (!/^[0-9]{4}\/[0-9]{4}$/.test(formData.ano_letivo) ||
          parseInt(endYear) !== parseInt(startYear) + 1 ||
          parseInt(startYear) < 1900 || parseInt(endYear) > new Date().getFullYear() + 1) {
        newErrors.ano_letivo = 'Ano letivo deve estar no formato AAAA/AAAA (ex: 2024/2025) e ser válido';
      }
    }
    if (!formData.ciclo_id || !ciclos.some(c => c.id === formData.ciclo_id)) {
      newErrors.ciclo_id = 'Ciclo inválido';
    }
    if (!formData.diretor_turma_id || !professors.some(p => p.id === formData.diretor_turma_id)) {
      newErrors.diretor_turma_id = 'Diretor de turma inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      if (modalType === 'create') {
        const response = await createClass(formData);
        setClasses((prevClasses) => [...prevClasses, response.data]);
        toast.success('Turma criada com sucesso!');
      } else if (modalType === 'edit') {
        const response = await updateClass(selectedItem.id, formData);
        setClasses((prevClasses) =>
          prevClasses.map((cls) => (cls.id === selectedItem.id ? response.data : cls))
        );
        toast.success('Turma atualizada com sucesso!');
      }
      closeModal();
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao salvar turma';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteClass(selectedItem.id);
      setClasses((prevClasses) => prevClasses.filter((cls) => cls.id !== selectedItem.id));
      toast.success('Turma excluída com sucesso!');
      closeModal();
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao excluir turma';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (professors.length === 0 && (modalType === 'create' || modalType === 'edit')) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full p-6">
          <p className="text-red-500">
            Nenhum professor registado.{' '}
            <button
              onClick={() => window.location.href = '/users?create=professor'}
              className="text-blue-600 underline"
            >
              Registar um professor
            </button>
          </p>
          <button
            onClick={closeModal}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  if (ciclos.length === 0 && (modalType === 'create' || modalType === 'edit')) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full p-6">
          <p className="text-red-500">
            Nenhum ciclo registado.{' '}
            <button
              onClick={() => window.location.href = '/ciclos?create=ciclo'}
              className="text-blue-600 underline"
            >
              Registar um ciclo
            </button>
          </p>
          <button
            onClick={closeModal}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {errors.general && <p className="text-red-500 text-sm mb-4">{errors.general}</p>}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {modalType === 'view' && 'Visualizar'}
              {modalType === 'edit' && 'Editar'}
              {modalType === 'create' && 'Criar Nova'}
              {modalType === 'delete' && 'Confirmar Exclusão'} Turma
            </h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          {modalType === 'delete' ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Tem certeza que deseja excluir a turma "{selectedItem?.nome || ''}"? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                    <input
                      type="text"
                      name="codigo"
                      className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.codigo ? 'border-red-500' : ''}`}
                      value={formData.codigo || ''}
                      onChange={handleInputChange}
                      disabled={modalType === 'view' || isSubmitting}
                    />
                    {errors.codigo && <p className="text-red-500 text-xs mt-1">{errors.codigo}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                      type="text"
                      name="nome"
                      className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.nome ? 'border-red-500' : ''}`}
                      value={formData.nome || ''}
                      onChange={handleInputChange}
                      disabled={modalType === 'view' || isSubmitting}
                    />
                    {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ano Letivo</label>
                    <input
                      type="text"
                      name="ano_letivo"
                      className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.ano_letivo ? 'border-red-500' : ''}`}
                      value={formData.ano_letivo || ''}
                      onChange={handleInputChange}
                      disabled={modalType === 'view' || isSubmitting}
                      placeholder="AAAA/AAAA"
                    />
                    {errors.ano_letivo && <p className="text-red-500 text-xs mt-1">{errors.ano_letivo}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ciclo</label>
                    <select
                      name="ciclo_id"
                      className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.ciclo_id ? 'border-red-500' : ''}`}
                      value={formData.ciclo_id || ''}
                      onChange={handleInputChange}
                      disabled={modalType === 'view' || isSubmitting}
                    >
                      <option value="">Selecione o ciclo</option>
                      {ciclos.map((ciclo) => (
                        <option key={ciclo.id} value={ciclo.id}>
                          {ciclo.nome}
                        </option>
                      ))}
                    </select>
                    {errors.ciclo_id && <p className="text-red-500 text-xs mt-1">{errors.ciclo_id}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diretor de Turma</label>
                    <select
                      name="diretor_turma_id"
                      className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.diretor_turma_id ? 'border-red-500' : ''}`}
                      value={formData.diretor_turma_id || ''}
                      onChange={handleInputChange}
                      disabled={modalType === 'view' || isSubmitting}
                    >
                      <option value="">Selecione o diretor</option>
                      {professors.map((professor) => (
                        <option key={professor.id} value={professor.id}>
                          {professor.nome}
                        </option>
                      ))}
                    </select>
                    {errors.diretor_turma_id && <p className="text-red-500 text-xs mt-1">{errors.diretor_turma_id}</p>}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ativo</label>
                    <input
                      type="checkbox"
                      name="ativo"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={formData.ativo}
                      onChange={handleInputChange}
                      disabled={modalType === 'view' || isSubmitting}
                    />
                  </div>
                </div>
                {modalType !== 'view' && (
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Salvando...' : modalType === 'create' ? 'Criar' : 'Salvar'}
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassModal;
