import React, { useState, useEffect, useMemo } from 'react';
import { XCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { createStudentEnrollment } from '../services';
import { mockData } from '../data/mockData'; // Import mockData

const StudentEnrollmentModal = ({ showModal, closeModal, subject, users, classes, setAlunoDisciplina, setDisciplinaTurma }) => {
  const [formData, setFormData] = useState({
    turma_id: '',
    enrollAll: true,
    selectedStudents: [],
    ano_letivo: '2024/2025',
  });
  const [errors, setErrors] = useState({});

  const students = useMemo(() => users.filter((user) => user.tipo_utilizador === 'ALUNO'), [users]);
  const availableClasses = useMemo(() => classes.filter((cls) => cls.ativo), [classes]);

  useEffect(() => {
    if (!showModal) return;
    setFormData({
      turma_id: availableClasses.length > 0 ? availableClasses[0].id : '',
      enrollAll: true,
      selectedStudents: [],
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
    if (!formData.enrollAll && formData.selectedStudents.length === 0)
      newErrors.selectedStudents = 'Selecione pelo menos um aluno';
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

  const handleStudentSelection = (studentId) => {
    setFormData((prev) => ({
      ...prev,
      selectedStudents: prev.selectedStudents.includes(studentId)
        ? prev.selectedStudents.filter((id) => id !== studentId)
        : [...prev.selectedStudents, studentId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData); // Debug
    if (!validateForm()) return;

    try {
      const studentsToEnroll = formData.enrollAll
        ? students.filter((student) =>
            mockData.enrollments.some(
              (enrollment) => enrollment.id === student.id && enrollment.turma_id === formData.turma_id
            )
          )
        : students.filter((student) => formData.selectedStudents.includes(student.id));

      const newEnrollments = await Promise.all(
        studentsToEnroll.map((student) =>
          createStudentEnrollment({
            aluno_id: student.id,
            disciplina_id: subject.id,
            ano_letivo: formData.ano_letivo,
          })
        )
      );

      // Update disciplina_turma
      const disciplinaTurmaData = {
        disciplina_id: subject.id,
        turma_id: formData.turma_id,
        ano_letivo: formData.ano_letivo,
      };
      const existingDisciplinaTurma = mockData.disciplina_turma.find(
        (dt) => dt.disciplina_id === subject.id && dt.turma_id === formData.turma_id && dt.ano_letivo === formData.ano_letivo
      );
      if (!existingDisciplinaTurma) {
        const newDisciplinaTurma = {
          id: require('uuid').v4(),
          ...disciplinaTurmaData,
          ativo: true,
          data_criacao: new Date().toISOString(),
        };
        setDisciplinaTurma((prev) => [...prev, newDisciplinaTurma]);
      }

      setAlunoDisciplina((prev) => [...prev, ...newEnrollments]);
      console.log('Triggering toast: Alunos inscritos com sucesso!'); // Debug
      toast.success('Alunos inscritos com sucesso!');
      closeModal();
    } catch (error) {
      console.log('Error during submission:', error); // Debug
      toast.error(error.message || 'Erro ao inscrever alunos.');
    }
  };

  const getClassStudents = () => {
    return students.filter((student) =>
      mockData.enrollments.some(
        (enrollment) => enrollment.id === student.id && enrollment.turma_id === formData.turma_id
      )
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Inscrever Alunos em {subject.nome}</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inscrever Todos os Alunos da Turma
                </label>
                <input
                  type="checkbox"
                  name="enrollAll"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={formData.enrollAll}
                  onChange={handleInputChange}
                />
              </div>
              {!formData.enrollAll && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alunos</label>
                  <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                    {getClassStudents().length === 0 ? (
                      <p className="text-gray-500">Nenhum aluno na turma selecionada.</p>
                    ) : (
                      getClassStudents().map((student) => (
                        <div key={student.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            value={student.id}
                            checked={formData.selectedStudents.includes(student.id)}
                            onChange={() => handleStudentSelection(student.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span>{student.nome}</span>
                        </div>
                      ))
                    )}
                  </div>
                  {errors.selectedStudents && (
                    <p className="text-red-500 text-xs mt-1">{errors.selectedStudents}</p>
                  )}
                </div>
              )}
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
                  Inscrever
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentEnrollmentModal;
