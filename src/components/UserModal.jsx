import React, { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { createUser, updateUser, deleteUser } from '../services';

const UserModal = ({ showModal, closeModal, modalType, selectedItem, setUsers }) => {
  const [formData, setFormData] = useState({
    numero_mecanografico: '',
    nome: '',
    email: '',
    tipo_utilizador: 'ALUNO',
    ativo: true,
    password: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!showModal) return;

    if (selectedItem && modalType !== 'create') {
      setFormData({
        numero_mecanografico: selectedItem.numero_mecanografico || '',
        nome: selectedItem.nome || '',
        email: selectedItem.email || '',
        tipo_utilizador: selectedItem.tipo_utilizador || 'ALUNO',
        ativo: selectedItem.ativo !== undefined ? selectedItem.ativo : true,
        password: '',
      });
    } else {
      setFormData({
        numero_mecanografico: '',
        nome: '',
        email: '',
        tipo_utilizador: 'ALUNO',
        ativo: true,
        password: '',
      });
    }
    setErrors({});
  }, [showModal, modalType, selectedItem]);

  if (!showModal) return null;

  const isViewMode = modalType === 'view';
  const isEditMode = modalType === 'edit';
  const isCreateMode = modalType === 'create';
  const isDeleteMode = modalType === 'delete';

  const validateForm = () => {
    const newErrors = {};
    if (!formData.numero_mecanografico)
      newErrors.numero_mecanografico = 'Número mecanográfico é obrigatório';
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (isCreateMode && !formData.password) newErrors.password = 'Senha é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log('Input change:', { name, value, type, checked }); // Debug
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData); // Debug
    if (!validateForm()) return;

    try {
      if (isCreateMode) {
        const newUser = await createUser({
          ...formData,
          password_hash: formData.password, // In real app, hash the password
        });
        let userAdded = false;
        setUsers((prevUsers) => {
          if (!prevUsers.some((user) => user.id === newUser.id)) {
            userAdded = true;
            return [...prevUsers, newUser];
          }
          return prevUsers;
        });
        if (userAdded) {
          console.log('Triggering toast: Utilizador criado com sucesso!'); // Debug
          toast.success('Utilizador criado com sucesso!');
        }
      } else if (isEditMode) {
        const updatedUser = await updateUser(selectedItem.id, {
          ...formData,
          password_hash: formData.password || selectedItem.password_hash,
        });
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === selectedItem.id ? updatedUser : user))
        );
        console.log('Triggering toast: Utilizador atualizado com sucesso!'); // Debug
        toast.success('Utilizador atualizado com sucesso!');
      }
      closeModal();
    } catch (error) {
      console.log('Error during submission:', error); // Debug
      toast.error(error.message || 'Erro ao salvar utilizador.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(selectedItem.id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== selectedItem.id));
      console.log('Triggering toast: Utilizador excluído com sucesso!'); // Debug
      toast.success('Utilizador excluído com sucesso!');
      closeModal();
    } catch (error) {
      console.log('Error during deletion:', error); // Debug
      toast.error(error.message || 'Erro ao excluir utilizador.');
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
              {isCreateMode && 'Criar Novo'}
              {isDeleteMode && 'Confirmar Exclusão'} Utilizador
            </h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          {isDeleteMode ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Tem certeza que deseja excluir o utilizador "{selectedItem?.nome || ''}"? Esta ação não pode ser desfeita.
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
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número Mecanográfico
                    </label>
                    <input
                      type="text"
                      name="numero_mecanografico"
                      className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.numero_mecanografico ? 'border-red-500' : ''
                      }`}
                      value={formData.numero_mecanografico || ''}
                      onChange={handleInputChange}
                      disabled={isViewMode}
                    />
                    {errors.numero_mecanografico && (
                      <p className="text-red-500 text-xs mt-1">{errors.numero_mecanografico}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                      type="text"
                      name="nome"
                      className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.nome ? 'border-red-500' : ''
                      }`}
                      value={formData.nome || ''}
                      onChange={handleInputChange}
                      disabled={isViewMode}
                    />
                    {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      disabled={isViewMode}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Utilizador
                    </label>
                    <select
                      name="tipo_utilizador"
                      className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.tipo_utilizador ? 'border-red-500' : ''
                      }`}
                      value={formData.tipo_utilizador || 'ALUNO'}
                      onChange={handleInputChange}
                      disabled={isViewMode}
                    >
                      <option value="ALUNO">Aluno</option>
                      <option value="PROFESSOR">Professor</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>
                  {isCreateMode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                      <input
                        type="password"
                        name="password"
                        className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.password ? 'border-red-500' : ''
                        }`}
                        value={formData.password || ''}
                        onChange={handleInputChange}
                      />
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                  )}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ativo</label>
                    <input
                      type="checkbox"
                      name="ativo"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={formData.ativo}
                      onChange={handleInputChange}
                      disabled={isViewMode}
                    />
                  </div>
                </div>
                {!isViewMode && (
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {isCreateMode ? 'Criar' : 'Salvar'}
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

export default UserModal;
