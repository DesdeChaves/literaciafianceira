import React, { useState, useEffect, useMemo } from 'react';
import { XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { createEnrollment, updateEnrollment, deleteEnrollment } from '../services';

const EnrollmentModal = ({ showModal, closeModal, modalType, selectedItem, setEnrollments, users, classes }) => {
  const [formData, setFormData] = useState({
    id: '', // Student UUID
    numero_aluno_na_turma: '',
    turma_id: '',
  });
  const [errors, setErrors] = useState({});

  // Memoize students and classes to prevent reference changes
  const students = useMemo(() => users.filter((user) => user.tipo_utilizador === 'ALUNO'), [users]);
  const availableClasses = useMemo(() => classes.filter((cls) => cls.ativo), [classes]);

  useEffect(() => {
    if (!showModal) return;

    if (selectedItem && modalType !== 'create') {
      setFormData({
        id: selectedItem.id || '',
        numero_aluno_na_turma: selectedItem.numero_aluno_na_turma || '',
        turma_id: selectedItem.turma_id || '',
      });
    } else {
      setFormData({
        id: students.length > 0 ? students[0].id : '',
        numero_aluno_na_turma: '',
        turma_id: availableClasses.length > 0 ? availableClasses[0].id : '',
      });
    }
    setErrors({});
  }, [showModal, modalType, selectedItem, students, availableClasses]);

  if (!showModal) return null;

  const isViewMode = modalType === 'view';
  const isEditMode = modalType === 'edit';
  const isCreateMode = modalType === 'create';
  const isDeleteMode = modalType === 'delete';

  const validateForm = () => {
    const newErrors = {};
    if (!formData.id) newErrors.id = 'Aluno é obrigatório';
    if (!formData.numero_aluno_na_turma) newErrors.numero_aluno_na_turma = 'Número na turma é obrigatório';
    else if (formData.numero_aluno_na_turma.length > 20)
      newErrors.numero_aluno_na_turma = 'Número na turma deve ter no máximo 20 caracteres';
    if (!formData.turma_id) newErrors.turma_id = 'Turma é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Input change:', { name, value }); // Debug
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData); // Debug
    if (!validateForm()) return;

    try {
      if (isCreateMode) {
        const newEnrollment = await createEnrollment(formData);
        let enrollmentAdded = false;
        setEnrollments((prevEnrollments) => {
          if (!prevEnrollments.some((enrollment) => enrollment.id === newEnrollment.id)) {
            enrollmentAdded = true;
            return [...prevEnrollments, newEnrollment];
          }
          return prevEnrollments;
        });
        if (enrollmentAdded) {
          console.log('Triggering toast: Matrícula criada com sucesso!'); // Debug
          toast.success('Matrícula criada com sucesso!');
        }
      } else if (isEditMode) {
        const updatedEnrollment = await updateEnrollment(selectedItem.id, formData);
        setEnrollments((prevEnrollments) =>
          prevEnrollments.map((enrollment) =>
            enrollment.id === selectedItem.id ? updatedEnrollment : enrollment
          )
        );
        console.log('Triggering toast: Matrícula atualizada com sucesso!'); // Debug
        toast.success('Matrícula atualizada com sucesso!');
      }
      closeModal();
    } catch (error) {
      console.log('Error during submission:', error); // Debug
      toast.error(error.message || 'Erro ao salvar matrícula.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEnrollment(selectedItem.id);
      setEnrollments((prevEnrollments) =>
        prevEnrollments.filter((enrollment) => enrollment.id !== selectedItem.id)
      );
      console.log('Triggering toast: Matrícula excluída com sucesso!'); // Debug
      toast.success('Matrícula excluída com sucesso!');
      closeModal();
    } catch (error) {
      console.log('Error during deletion:', error); // Debug
      toast.error(error.message || 'Erro ao excluir matrícula.');
    }
  };

  if (students.length === 0 && (isCreateMode || isEditMode)) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full p-6">
          <p className="text-red-500">Nenhum aluno registado. Registe um aluno primeiro.</p>
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

  if (availableClasses.length === 0 && (isCreateMode || isEditMode)) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full p-6">
          <p className="text-red-500">Nenhuma turma ativa registada. Registe uma turma primeiro.</p>
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
              {isViewMode && 'Visualizar'}
              {isEditMode && 'Editar'}
              {isCreateMode && 'Criar Nova'}
              {isDeleteMode && 'Confirmar Exclusão'} Matrícula
            </h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          {isDeleteMode ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Tem certeza que deseja excluir a matrícula do aluno "
                {users.find((user) => user.id === selectedItem?.id)?.nome || ''}"? Esta ação não pode ser desfeita.
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aluno</label>
                    <select
                      name="id"
                      className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.id ? 'border-red-500' : ''
                      }`}
                      value={formData.id || ''}
                      onChange={handleInputChange}
                      disabled={isViewMode || isEditMode} // Disable in edit mode to prevent changing student
                    >
                      <option value="">Selecione o aluno</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.nome}
                        </option>
                      ))}
                    </select>
                    {errors.id && <p className="text-red-500 text-xs mt-1">{errors.id}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número na Turma</label>
                    <input
                      type="text"
                      name="numero_aluno_na_turma"
                      className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.numero_aluno_na_turma ? 'border-red-500' : ''
                      }`}
                      value={formData.numero_aluno_na_turma || ''}
                      onChange={handleInputChange}
                      disabled={isViewMode}
                      placeholder="Ex: 2024-10A-003"
                    />
                    {errors.numero_aluno_na_turma && (
                      <p className="text-red-500 text-xs mt-1">{errors.numero_aluno_na_turma}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
                    <select
                      name="turma_id"
                      className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.turma_id ? 'border-red-500' : ''
                      }`}
                      value={formData.turma_id || ''}
                      onChange={handleInputChange}
                      disabled={isViewMode}
                    >
                      <option value="">Selecione a turma</option>
                      {availableClasses.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.nome}
                        </option>
                      ))}
                    </select>
                    {errors.turma_id && <p className="text-red-500 text-xs mt-1">{errors.turma_id}</p>}
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

export default EnrollmentModal;
