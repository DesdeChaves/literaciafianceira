import React, { useState } from 'react';
import { createEnrollment } from '../services/api';

const StudentEnrollmentModal = ({
  showModal,
  closeModal,
  subject,
  users,
  classes,
  setEnrollments,
}) => {
  const [formData, setFormData] = useState({
    aluno_id: '',
    ano_letivo: '2024/2025',
    ativo: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const enrollmentData = {
        ...formData,
        disciplina_id: subject.id,
      };
      const response = await createEnrollment(enrollmentData);
      setEnrollments(prev => [...prev, response.data]);
      closeModal();
    } catch (error) {
      console.error('Error creating student enrollment:', error);
      alert('Erro ao criar matrícula.');
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Matrícula em {subject.nome}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aluno</label>
            <select
              name="aluno_id"
              value={formData.aluno_id}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione um aluno</option>
              {users.filter(u => u.tipo_utilizador === 'ALUNO').map(user => (
                <option key={user.id} value={user.id}>{user.nome}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ano Letivo</label>
            <input
              type="text"
              name="ano_letivo"
              value={formData.ano_letivo}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Matricular
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentEnrollmentModal;
