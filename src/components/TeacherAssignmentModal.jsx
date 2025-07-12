import React, { useState, useEffect, useMemo } from 'react';
import { XCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { createTeacherAssignment } from '../services';

const TeacherAssignmentModal = ({ showModal, closeModal, subject, users, classes, setProfessorDisciplinaTurma }) => {
  const [formData, setFormData] = useState({
    professor_ids: [],
    turma_id: '',
    ano_letivo: '2024/2025',
  });
  const [errors, setErrors] = useState({});

  const teachers = useMemo(() => users.filter((user) => user.tipo_utilizador === 'PROFESSOR'), [users]);
  const availableClasses = useMemo(() => classes.filter((cls) => cls.ativo), [classes]);

  useEffect(() => {
    if (!showModal) return;
    setFormData({
      professor_ids: [],
      turma_id: availableClasses.length > 0 ? availableClasses[0].id : '',
      ano_letivo: '2024/2025',
    });
    setErrors({});
  }, [showModal, availableClasses]);

  if (!showModal) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.turma_id) newErrors.turma_id = 'Turma é obrigatória';
    if (!formData.ano_letivo.match(/^[0-9]{4}\/[0-9]{4}$/))
      newErrors.ano_letivo = 'Ano letivo deve seguir o formato AAAA/AAAA';
    if (formData.professor_ids.length === 0)
      newErrors.professor_ids = 'Selecione pelo menos um professor';
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

  const handleTeacherSelection = (professorId) => {
    setFormData((prev) => ({
      ...prev,
      professor_ids: prev.professor_ids.includes(professorId)
        ? prev.professor_ids.filter((id) => id !== professorId)
        : [...prev.professor_ids, professorId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData); // Debug
    if (!validateForm()) return;

    try {
      const newAssignments = await Promise.all(
        formData.professor_ids.map((professorId) =>
          createTeacherAssignment({
            professor_id: professorId,
            disciplina_id: subject.id,
            turma_id: formData.turma_id,
            ano_letivo: formData.ano_letivo,
          })
        )
      );

      setProfessorDisciplinaTurma((prev) => [...prev, ...newAssignments]);
      console.log('Triggering toast: Professores atribuídos com sucesso!'); // Debug
      toast.success('Professores atribuídos com sucesso!');
      closeModal();
    } catch (error) {
      console.log('Error during submission:', error); // Debug
      toast.error(error.message || 'Erro ao atribuir professores.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Atribuir Professores a {subject.nome}</h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
                <select
                  name="turma_id"
                  className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.turma_id ? 'border-red-500' : ''
                  }`}
                  value={formData.turma_id}
                  onChange={handleInputChange}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ano Letivo</label>
                <input
                  type="text"
                  name="ano_letivo"
                  className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.ano_letivo ? 'border-red-500' : ''
                  }`}
                  value={formData.ano_letivo}
                  onChange={handleInputChange}
                  placeholder="Ex: 2024/2025"
                />
                {errors.ano_letivo && <p className="text-red-500 text-xs mt-1">{errors.ano_letivo}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professores</label>
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                  {teachers.length === 0 ? (
                    <p className="text-gray-500">Nenhum professor disponível.</p>
                  ) : (
                    teachers.map((teacher) => (
                      <div key={teacher.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={teacher.id}
                          checked={formData.professor_ids.includes(teacher.id)}
                          onChange={() => handleTeacherSelection(teacher.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span>{teacher.nome}</span>
                      </div>
                    ))
                  )}
                </div>
                {errors.professor_ids && (
                  <p className="text-red-500 text-xs mt-1">{errors.professor_ids}</p>
                )}
              </div>
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
                  Atribuir
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherAssignmentModal;
