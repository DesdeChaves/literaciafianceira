// src/components/SubjectModal.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { XCircle, Trash } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  createSubject,
  updateSubject,
  deleteSubject,
  createTeacherAssignment,
  createStudentEnrollment,
  removeTeacherAssignment,
  removeStudentEnrollment,
  createDisciplinaTurma,
  getDisciplinaTurma,
  getProfessorDisciplinaTurma,
} from '../services/subjectService';

const SubjectModal = ({ showModal, closeModal, modalType, selectedItem, setSubjects, users, classes, setProfessorDisciplinaTurma, setAlunoDisciplina, setDisciplinaTurma }) => {
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    ativo: true,
    professor_ids: [],
    turma_id: '',
    ano_letivo: '2024/2025',
    selectedStudents: [],
  });
  const [errors, setErrors] = useState({});
  const [professorDisciplinaTurma, setLocalProfessorDisciplinaTurma] = useState([]);
  const [disciplinaTurma, setLocalDisciplinaTurma] = useState([]);

  const teachers = useMemo(() => users.filter((user) => user.tipo_utilizador === 'PROFESSOR'), [users]);
  const availableClasses = useMemo(() => classes.filter((cls) => cls.ativo), [classes]);
  const students = useMemo(() => users.filter((user) => user.tipo_utilizador === 'ALUNO'), [users]);

  // Enrolled students for view/edit mode
  const enrolledStudents = useMemo(() => {
    if (!selectedItem) return [];
    return (window.alunoDisciplina || []) // Use global state or prop if available
      .filter((ad) => ad.disciplina_id === selectedItem.id && ad.ativo)
      .map((ad) => {
        const student = users.find((user) => user.id === ad.aluno_id && user.tipo_utilizador === 'ALUNO');
        const classInfo = classes.find((cls) => cls.id === disciplinaTurma.find((dt) => dt.disciplina_id === selectedItem.id && dt.ano_letivo === ad.ano_letivo)?.turma_id);
        return {
          ...ad,
          studentName: student ? student.nome : 'Desconhecido',
          className: classInfo ? classInfo.nome : 'N/A',
        };
      });
  }, [selectedItem, users, classes, disciplinaTurma]);

  // Assigned teachers for view/edit mode
  const assignedTeachers = useMemo(() => {
    if (!selectedItem) return [];
    return professorDisciplinaTurma
      .filter((pdt) => pdt.disciplina_id === selectedItem.id && pdt.ativo)
      .map((pdt) => {
        const teacher = users.find((user) => user.id === pdt.professor_id && user.tipo_utilizador === 'PROFESSOR');
        const classInfo = classes.find((cls) => cls.id === pdt.turma_id);
        return {
          ...pdt,
          teacherName: teacher ? teacher.nome : 'Desconhecido',
          className: classInfo ? classInfo.nome : 'N/A',
        };
      });
  }, [selectedItem, users, classes, professorDisciplinaTurma]);

  useEffect(() => {
    if (!showModal) return;

    // Fetch professor_disciplina_turma and disciplina_turma
    const fetchData = async () => {
      try {
        const [pdtData, dtData] = await Promise.all([
          getProfessorDisciplinaTurma(),
          getDisciplinaTurma(),
        ]);
        setLocalProfessorDisciplinaTurma(pdtData);
        setLocalDisciplinaTurma(dtData);
        setProfessorDisciplinaTurma(pdtData);
        setDisciplinaTurma(dtData);
      } catch (error) {
        console.error('Error fetching professor_disciplina_turma or disciplina_turma:', error);
        toast.error('Erro ao carregar dados de atribuições.');
      }
    };
    fetchData();

    if (selectedItem && modalType !== 'create') {
      const preSelectedTeachers = professorDisciplinaTurma
        .filter((pdt) => pdt.disciplina_id === selectedItem.id && pdt.ativo)
        .map((pdt) => pdt.professor_id);
      
      setFormData({
        nome: selectedItem.nome || '',
        codigo: selectedItem.codigo || '',
        ativo: selectedItem.ativo !== undefined ? selectedItem.ativo : true,
        professor_ids: preSelectedTeachers,
        turma_id: availableClasses.length > 0 ? availableClasses[0].id : '',
        ano_letivo: '2024/2025',
        selectedStudents: [],
      });
    } else {
      setFormData({
        nome: '',
        codigo: '',
        ativo: true,
        professor_ids: [],
        turma_id: availableClasses.length > 0 ? availableClasses[0].id : '',
        ano_letivo: '2024/2025',
        selectedStudents: [],
      });
    }
    setErrors({});
  }, [showModal, modalType, selectedItem, availableClasses, professorDisciplinaTurma]);

  if (!showModal) return null;

  const isViewMode = modalType === 'view';
  const isEditMode = modalType === 'edit';
  const isCreateMode = modalType === 'create';
  const isDeleteMode = modalType === 'delete';

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.codigo) newErrors.codigo = 'Código é obrigatório';
    else if (formData.codigo.length > 10) newErrors.codigo = 'Código deve ter no máximo 10 caracteres';
    if (formData.professor_ids.length > 0 && !formData.turma_id)
      newErrors.turma_id = 'Turma é obrigatória quando professores são selecionados';
    if ((formData.professor_ids.length > 0 || formData.selectedStudents.length > 0) && !formData.ano_letivo.match(/^[0-9]{4}\/[0-9]{4}$/))
      newErrors.ano_letivo = 'Ano letivo deve seguir o formato AAAA/AAAA';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log('Input change:', { name, value, type, checked });
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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

  const handleStudentSelection = (studentId) => {
    setFormData((prev) => ({
      ...prev,
      selectedStudents: prev.selectedStudents.includes(studentId)
        ? prev.selectedStudents.filter((id) => id !== studentId)
        : [...prev.selectedStudents, studentId],
    }));
  };

  const handleRemoveStudent = async (enrollmentId) => {
    try {
      await removeStudentEnrollment(enrollmentId);
      setAlunoDisciplina((prev) =>
        prev.map((ad) => (ad.id === enrollmentId ? { ...ad, ativo: false } : ad))
      );
      console.log('Triggering toast: Aluno removido com sucesso!');
      toast.success('Aluno removido com sucesso!');
    } catch (error) {
      console.error('Error removing student:', error);
      toast.error(error || 'Erro ao remover aluno.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    if (!validateForm()) return;

    try {
      let newSubject;
      if (isCreateMode) {
        newSubject = await createSubject({
          nome: formData.nome,
          codigo: formData.codigo,
          ativo: formData.ativo,
        });
        setSubjects((prevSubjects) => [...prevSubjects, newSubject]);
      } else if (isEditMode) {
        newSubject = await updateSubject(selectedItem.id, {
          nome: formData.nome,
          codigo: formData.codigo,
          ativo: formData.ativo,
        });
        setSubjects((prevSubjects) =>
          prevSubjects.map((subject) =>
            subject.id === selectedItem.id ? newSubject : subject
          )
        );

        // Update teacher assignments
        const currentTeacherAssignments = professorDisciplinaTurma
          .filter((pdt) => pdt.disciplina_id === selectedItem.id && pdt.ativo)
          .map((pdt) => pdt.professor_id);

        const teachersToAdd = formData.professor_ids.filter(
          (id) => !currentTeacherAssignments.includes(id)
        );
        const teachersToRemove = currentTeacherAssignments.filter(
          (id) => !formData.professor_ids.includes(id)
        );

        const newAssignments = await Promise.all(
          teachersToAdd.map((professorId) =>
            createTeacherAssignment({
              professor_id: professorId,
              disciplina_id: selectedItem.id,
              turma_id: formData.turma_id,
              ano_letivo: formData.ano_letivo,
            })
          )
        );

        await Promise.all(
          teachersToRemove.map(async (professorId) => {
            const assignment = professorDisciplinaTurma.find(
              (pdt) =>
                pdt.professor_id === professorId &&
                pdt.disciplina_id === selectedItem.id &&
                pdt.turma_id === formData.turma_id &&
                pdt.ano_letivo === formData.ano_letivo &&
                pdt.ativo
            );
            if (assignment) {
              await removeTeacherAssignment(assignment.id);
            }
          })
        );

        setProfessorDisciplinaTurma((prev) => [
          ...prev.filter((pdt) => !teachersToRemove.includes(pdt.professor_id) || !pdt.ativo),
          ...newAssignments,
        ]);

        // Update student enrollments
        const newEnrollments = await Promise.all(
          formData.selectedStudents.map((studentId) =>
            createStudentEnrollment({
              aluno_id: studentId,
              disciplina_id: selectedItem.id,
              ano_letivo: formData.ano_letivo,
            })
          )
        );

        // Update disciplina_turma
        const disciplinaTurmaData = {
          disciplina_id: selectedItem.id,
          turma_id: formData.turma_id,
          ano_letivo: formData.ano_letivo,
        };
        const existingDisciplinaTurma = disciplinaTurma.find(
          (dt) =>
            dt.disciplina_id === selectedItem.id &&
            dt.turma_id === formData.turma_id &&
            dt.ano_letivo === formData.ano_letivo &&
            dt.ativo
        );
        if (!existingDisciplinaTurma && (newEnrollments.length > 0 || teachersToAdd.length > 0)) {
          const newDisciplinaTurma = await createDisciplinaTurma({
            ...disciplinaTurmaData,
            ativo: true,
            data_criacao: new Date().toISOString(),
          });
          setDisciplinaTurma((prev) => [...prev, newDisciplinaTurma]);
        }

        setAlunoDisciplina((prev) => [...prev, ...newEnrollments]);
      }

      console.log('Triggering toast:', isCreateMode ? 'Disciplina criada com sucesso!' : 'Disciplina atualizada com sucesso!');
      toast.success(isCreateMode ? 'Disciplina criada com sucesso!' : 'Disciplina atualizada com sucesso!');
      closeModal();
    } catch (error) {
      console.error('Error during submission:', error);
      toast.error(error || 'Erro ao salvar disciplina.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSubject(selectedItem.id);
      setSubjects((prevSubjects) =>
        prevSubjects.filter((subject) => subject.id !== selectedItem.id)
      );
      console.log('Triggering toast: Disciplina excluída com sucesso!');
      toast.success('Disciplina excluída com sucesso!');
      closeModal();
    } catch (error) {
      console.error('Error during deletion:', error);
      toast.error(error || 'Erro ao excluir disciplina.');
    }
  };

  const getClassStudents = () => {
    return students.filter((student) =>
      window.alunoTurma?.some(
        (enrollment) => enrollment.aluno_id === student.id && enrollment.turma_id === formData.turma_id && enrollment.ativo
      ) || []
    );
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
              {isDeleteMode && 'Confirmar Exclusão'} Disciplina
            </h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          {isDeleteMode ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Tem certeza que deseja excluir a disciplina "{selectedItem?.nome || ''}"? Esta ação não pode ser desfeita.
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
          ) : isViewMode ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <p className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100">{selectedItem.nome}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                  <p className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100">{selectedItem.codigo}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <p className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100">{selectedItem.ativo ? 'Ativo' : 'Inativo'}</p>
                </div>
              </div>
              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-2">Alunos Inscritos</h4>
                {enrolledStudents.length === 0 ? (
                  <p className="text-gray-500">Nenhum aluno inscrito.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome
                          </th>
                          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Turma
                          </th>
                          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ano Letivo
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrolledStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-100">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.studentName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.className}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.ano_letivo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-2">Professores Atribuídos</h4>
                {assignedTeachers.length === 0 ? (
                  <p className="text-gray-500">Nenhum professor atribuído.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome
                          </th>
                          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Turma
                          </th>
                          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ano Letivo
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignedTeachers.map((teacher) => (
                          <tr key={teacher.id} className="hover:bg-gray-100">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.teacherName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.className}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.ano_letivo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Fechar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                      type="text"
                      name="nome"
                      className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.nome ? 'border-red-500' : ''}`}
                      value={formData.nome || ''}
                      onChange={handleInputChange}
                      disabled={isViewMode}
                    />
                    {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                    <input
                      type="text"
                      name="codigo"
                      className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.codigo ? 'border-red-500' : ''}`}
                      value={formData.codigo || ''}
                      onChange={handleInputChange}
                      disabled={isViewMode}
                    />
                    {errors.codigo && <p className="text-red-500 text-xs mt-1">{errors.codigo}</p>}
                  </div>
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
                {(isCreateMode || isEditMode) && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Turma (Opcional)</label>
                        <select
                          name="turma_id"
                          className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.turma_id ? 'border-red-500' : ''}`}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ano Letivo (Opcional)</label>
                        <input
                          type="text"
                          name="ano_letivo"
                          className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.ano_letivo ? 'border-red-500' : ''}`}
                          value={formData.ano_letivo}
                          onChange={handleInputChange}
                          placeholder="Ex: 2024/2025"
                        />
                        {errors.ano_letivo && <p className="text-red-500 text-xs mt-1">{errors.ano_letivo}</p>}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-gray-700 mb-2">Professores</h4>
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
                    </div>
                    {isEditMode && (
                      <>
                        <div>
                          <h4 className="text-md font-semibold text-gray-700 mb-2">Alunos Inscritos</h4>
                          {enrolledStudents.length === 0 ? (
                            <p className="text-gray-500">Nenhum aluno inscrito.</p>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="min-w-full bg-white border border-gray-200">
                                <thead>
                                  <tr>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Nome
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Turma
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Ano Letivo
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Ações
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {enrolledStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-100">
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.studentName}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.className}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.ano_letivo}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                          onClick={() => handleRemoveStudent(student.id)}
                                          className="text-red-600 hover:text-red-800"
                                          title="Remover Aluno"
                                        >
                                          <Trash className="w-5 h-5" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-md font-semibold text-gray-700 mb-2">Adicionar Alunos</h4>
                          {formData.turma_id ? (
                            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                              {getClassStudents().length === 0 ? (
                                <p className="text-gray-500">Nenhum aluno disponível na turma selecionada.</p>
                              ) : (
                                getClassStudents()
                                  .filter((student) => !enrolledStudents.some((es) => es.aluno_id === student.id))
                                  .map((student) => (
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
                          ) : (
                            <p className="text-gray-500">Selecione uma turma para adicionar alunos.</p>
                          )}
                        </div>
                      </>
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
                        {isCreateMode ? 'Criar' : 'Salvar'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectModal;
