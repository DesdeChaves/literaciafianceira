// src/components/ValCoinAdmin.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getTransactions,
  getSubjects,
  getClasses,
  getEnrollments,
  getTransactionRules,
  getCiclos,
  getAlunoTurma,
  createAlunoTurma,
  updateAlunoTurma,
  getDisciplinaTurma,
  getProfessorDisciplinaTurma,
} from '../services';
import {
  Users,
  Classes,
  Transactions,
  Subjects,
  TransactionRules,
  Dashboard,
  Settings,
  Enrollments,
} from './index';
import {
  UserModal,
  ClassModal,
  TransactionModal,
  SubjectModal,
  TransactionRuleModal,
  EnrollmentModal,
  StudentEnrollmentModal,
  TeacherAssignmentModal,
} from './index';
import { tabs } from '../data/mockData';

const ValCoinAdmin = () => {
  const [alunoTurma, setAlunoTurma] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [transactionRules, setTransactionRules] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [ciclos, setCiclos] = useState([]);
  const [alunoDisciplina, setAlunoDisciplina] = useState([]);
  const [disciplinaTurma, setDisciplinaTurma] = useState([]);
  const [professorDisciplinaTurma, setProfessorDisciplinaTurma] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);
  const [customModal, setCustomModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [
          usersData,
          transactionsData,
          subjectsData,
          classesData,
          enrollmentsData,
          transactionRulesData,
          ciclosData,
          alunoTurmaData,
          disciplinaTurmaData,
          professorDisciplinaTurmaData,
        ] = await Promise.all([
          getUsers().catch(() => []),
          getTransactions().catch(() => []),
          getSubjects().catch(() => []),
          getClasses().catch(() => []),
          getEnrollments().catch(() => []),
          getTransactionRules().catch(() => []),
          getCiclos().catch(() => []),
          getAlunoTurma().catch(() => []),
          getDisciplinaTurma().catch(() => []),
          getProfessorDisciplinaTurma().catch(() => []),
        ]);
        console.log('Fetched data:', {
          users: usersData,
          classes: classesData,
          transactions: transactionsData,
          subjects: subjectsData,
          enrollments: enrollmentsData,
          transactionRules: transactionRulesData,
          ciclos: ciclosData,
          aluno_turma: alunoTurmaData,
          disciplina_turma: disciplinaTurmaData,
          professor_disciplina_turma: professorDisciplinaTurmaData,
        });
        setUsers(usersData);
        setTransactions(transactionsData);
        setSubjects(subjectsData);
        setClasses(classesData);
        setEnrollments(enrollmentsData);
        setTransactionRules(transactionRulesData);
        setCiclos(ciclosData);
        setAlunoTurma(alunoTurmaData);
        setAlunoDisciplina(enrollmentsData);
        setDisciplinaTurma(disciplinaTurmaData);
        setProfessorDisciplinaTurma(professorDisciplinaTurmaData);
      } catch (err) {
        setError('Failed to load data');
        console.error('Fetch error:', err);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveUser = async (formData) => {
    try {
      let updatedUsers;
      if (modalType === 'create') {
        const newUser = await createUser(formData);
        updatedUsers = [...users, newUser];
        toast.success('Utilizador criado com sucesso!');
      } else if (modalType === 'edit') {
        const updatedUser = await updateUser(selectedItem.id, formData);
        updatedUsers = users.map((user) =>
          user.id === selectedItem.id ? updatedUser : user
        );
        toast.success('Utilizador atualizado com sucesso!');
      }
      setUsers(updatedUsers);
      closeModal();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Erro ao salvar utilizador.');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(selectedItem.id);
      setUsers(users.filter((user) => user.id !== selectedItem.id));
      toast.success('Utilizador excluído com sucesso!');
      closeModal();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Erro ao excluir utilizador.');
    }
  };

  const handleSaveClass = async (formData) => {
    try {
      let updatedClasses;
      if (modalType === 'create') {
        const newClass = await createClass(formData);
        updatedClasses = [...classes, newClass];
        toast.success('Turma criada com sucesso!');
      } else if (modalType === 'edit') {
        const updatedClass = await updateClass(selectedItem.id, formData);
        updatedClasses = classes.map((cls) =>
          cls.id === selectedItem.id ? updatedClass : cls
        );
        toast.success('Turma atualizada com sucesso!');
      }
      setClasses(updatedClasses);
      closeModal();
    } catch (error) {
      console.error('Error saving class:', error);
      toast.error('Erro ao salvar turma.');
    }
  };

  const handleDeleteClass = async () => {
    try {
      await deleteClass(selectedItem.id);
      setClasses(classes.filter((cls) => cls.id !== selectedItem.id));
      toast.success('Turma excluída com sucesso!');
      closeModal();
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error('Erro ao excluir turma.');
    }
  };

  const handleSaveTransaction = async (formData) => {
    try {
      const newTransaction = await createTransaction(formData);
      setTransactions([...transactions, newTransaction]);
      toast.success('Transação criada com sucesso!');
      closeModal();
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error('Erro ao salvar transação.');
    }
  };

  const handleSaveSubject = async (formData) => {
    try {
      let updatedSubjects;
      if (modalType === 'create') {
        const newSubject = await createSubject(formData);
        updatedSubjects = [...subjects, newSubject];
        toast.success('Disciplina criada com sucesso!');
      } else if (modalType === 'edit') {
        const updatedSubject = await updateSubject(selectedItem.id, formData);
        updatedSubjects = subjects.map((subject) =>
          subject.id === selectedItem.id ? updatedSubject : subject
        );
        toast.success('Disciplina atualizada com sucesso!');
      }
      setSubjects(updatedSubjects);
      closeModal();
    } catch (error) {
      console.error('Error saving subject:', error);
      toast.error('Erro ao salvar disciplina.');
    }
  };

  const handleDeleteSubject = async () => {
    try {
      await deleteSubject(selectedItem.id);
      setSubjects(subjects.filter((subject) => subject.id !== selectedItem.id));
      toast.success('Disciplina excluída com sucesso!');
      closeModal();
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast.error('Erro ao excluir disciplina.');
    }
  };

  const handleSaveTransactionRule = async (formData) => {
    try {
      let updatedRules;
      if (modalType === 'create') {
        const newRule = await createTransactionRule(formData);
        updatedRules = [...transactionRules, newRule];
        toast.success('Regra de transação criada com sucesso!');
      } else if (modalType === 'edit') {
        const updatedRule = await updateTransactionRule(
          selectedItem.id,
          formData
        );
        updatedRules = transactionRules.map((rule) =>
          rule.id === selectedItem.id ? updatedRule : rule
        );
        toast.success('Regra de transação atualizada com sucesso!');
      }
      setTransactionRules(updatedRules);
      closeModal();
    } catch (error) {
      console.error('Error saving transaction rule:', error);
      toast.error('Erro ao salvar regra de transação.');
    }
  };

  const handleSaveEnrollment = async (formData) => {
    try {
      let updatedEnrollments;
      if (modalType === 'create') {
        const newEnrollment = await createAlunoTurma(formData);
        updatedEnrollments = [...alunoTurma, newEnrollment];
        toast.success('Inscrição criada com sucesso!');
      } else if (modalType === 'edit') {
        const updatedEnrollment = await updateAlunoTurma(
          selectedItem.id,
          formData
        );
        updatedEnrollments = alunoTurma.map((enrollment) =>
          enrollment.id === selectedItem.id ? updatedEnrollment : enrollment
        );
        toast.success('Inscrição atualizada com sucesso!');
      }
      setAlunoTurma(updatedEnrollments);
      closeModal();
    } catch (error) {
      console.error('Error saving enrollment:', error);
      toast.error('Erro ao salvar inscrição.');
    }
  };

  const openModal = (type, item = null) => {
    console.log('Opening modal:', { type, item });
    setModalType(type);
    setSelectedItem(item);
    setCustomModal(null);
    setShowModal(true);
  };

  const openStudentEnrollmentModal = (subject) => {
    setSelectedItem(subject);
    setCustomModal('studentEnrollment');
    setShowModal(true);
  };

  const openTeacherAssignmentModal = (subject) => {
    setSelectedItem(subject);
    setCustomModal('teacherAssignment');
    setShowModal(true);
  };

  const closeModal = () => {
    console.log('Closing modal');
    setShowModal(false);
    setSelectedItem(null);
    setCustomModal(null);
  };

  const memoizedUsers = useMemo(() => users, [users]);
  const memoizedClasses = useMemo(() => classes, [classes]);
  const memoizedTransactions = useMemo(() => transactions, [transactions]);
  const memoizedSubjects = useMemo(() => subjects, [subjects]);
  const memoizedEnrollments = useMemo(() => enrollments, [enrollments]);
  const memoizedTransactionRules = useMemo(() => transactionRules, [transactionRules]);
  const memoizedCiclos = useMemo(() => ciclos, [ciclos]);
  const memoizedAlunoTurma = useMemo(() => alunoTurma, [alunoTurma]);
  const memoizedAlunoDisciplina = useMemo(() => alunoDisciplina, [alunoDisciplina]);
  const memoizedDisciplinaTurma = useMemo(() => disciplinaTurma, [disciplinaTurma]);
  const memoizedProfessorDisciplinaTurma = useMemo(
    () => professorDisciplinaTurma,
    [professorDisciplinaTurma]
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <Users users={memoizedUsers} openModal={openModal} />;
      case 'transactions':
        return (
          <Transactions
            transactions={memoizedTransactions}
            setTransactions={setTransactions}
            users={memoizedUsers}
            openModal={openModal}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        );
      case 'subjects':
        return (
          <Subjects
            subjects={memoizedSubjects}
            setSubjects={setSubjects}
            openModal={openModal}
            openStudentEnrollmentModal={openStudentEnrollmentModal}
            openTeacherAssignmentModal={openTeacherAssignmentModal}
          />
        );
      case 'classes':
        return (
          <Classes
            classes={memoizedClasses}
            setClasses={setClasses}
            users={memoizedUsers}
            openModal={openModal}
            ciclos={memoizedCiclos}
            isLoading={isLoading}
            error={error}
          />
        );
      case 'enrollments':
        return (
          <Enrollments
            alunoTurma={memoizedAlunoTurma}
            setAlunoTurma={setAlunoTurma}
            users={memoizedUsers}
            classes={memoizedClasses}
            openModal={openModal}
          />
        );
      case 'transactionRules':
        return (
          <TransactionRules
            transactionRules={memoizedTransactionRules}
            setTransactionRules={setTransactionRules}
            openModal={openModal}
          />
        );
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const renderModal = () => {
    if (!showModal) return null;

    if (customModal === 'studentEnrollment') {
      return (
        <StudentEnrollmentModal
          showModal={showModal}
          closeModal={closeModal}
          subject={selectedItem}
          users={memoizedUsers}
          classes={memoizedClasses}
          setEnrollments={setEnrollments}
          alunoDisciplina={memoizedAlunoDisciplina}
          setAlunoDisciplina={setAlunoDisciplina}
          disciplinaTurma={memoizedDisciplinaTurma}
          setDisciplinaTurma={setDisciplinaTurma}
        />
      );
    }

    if (customModal === 'teacherAssignment') {
      return (
        <TeacherAssignmentModal
          showModal={showModal}
          closeModal={closeModal}
          subject={selectedItem}
          users={memoizedUsers}
          classes={memoizedClasses}
          setProfessorDisciplinaTurma={setProfessorDisciplinaTurma}
          professorDisciplinaTurma={memoizedProfessorDisciplinaTurma}
          disciplinaTurma={memoizedDisciplinaTurma}
          setDisciplinaTurma={setDisciplinaTurma}
        />
      );
    }

    switch (activeTab) {
      case 'users':
        return (
          <UserModal
            showModal={showModal}
            closeModal={closeModal}
            modalType={modalType}
            selectedInterestingItem={selectedItem}
            onSave={handleSaveUser}
            onDelete={handleDeleteUser}
          />
        );
      case 'transactions':
        return (
          <TransactionModal
            showModal={showModal}
            closeModal={closeModal}
            modalType={modalType}
            selectedItem={selectedItem}
            users={memoizedUsers}
            onSave={handleSaveTransaction}
          />
        );
      case 'subjects':
        return (
          <SubjectModal
            showModal={showModal}
            closeModal={closeModal}
            modalType={modalType}
            selectedItem={selectedItem}
            setSubjects={setSubjects}
            users={memoizedUsers}
            classes={memoizedClasses}
            setProfessorDisciplinaTurma={setProfessorDisciplinaTurma}
            setAlunoDisciplina={setAlunoDisciplina}
            setDisciplinaTurma={setDisciplinaTurma}
            professorDisciplinaTurma={memoizedProfessorDisciplinaTurma}
            alunoDisciplina={memoizedAlunoDisciplina}
            disciplinaTurma={memoizedDisciplinaTurma}
            alunoTurma={memoizedAlunoTurma}
          />
        );
      case 'classes':
        return (
          <ClassModal
            showModal={showModal}
            closeModal={closeModal}
            modalType={modalType}
            selectedItem={selectedItem}
            onSave={handleSaveClass}
            onDelete={handleDeleteClass}
            ciclos={memoizedCiclos}
          />
        );
      case 'enrollments':
        return (
          <EnrollmentModal
            showModal={showModal}
            closeModal={closeModal}
            modalType={modalType}
            selectedItem={selectedItem}
            users={memoizedUsers}
            classes={memoizedClasses}
            onSave={handleSaveEnrollment}
          />
        );
      case 'transactionRules':
        return (
          <TransactionRuleModal
            showModal={showModal}
            closeModal={closeModal}
            modalType={modalType}
            selectedItem={selectedItem}
            onSave={handleSaveTransactionRule}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-6 overflow-auto">
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {renderContent()}
        {renderModal()}
      </div>
    </div>
  );
};

export default ValCoinAdmin;
