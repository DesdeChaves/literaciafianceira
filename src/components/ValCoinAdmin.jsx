import React, { useState, useEffect, useMemo } from 'react';
import { mockData, tabs } from '../data/mockData';
import Sidebar from './Sidebar';
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
import {
  getUsers,
  getClasses,
  getTransactions,
  getSubjects,
  getTransactionRules,
  getEnrollments,
} from '../services';

const ValCoinAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [transactionRules, setTransactionRules] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [alunoDisciplina, setAlunoDisciplina] = useState([]);
  const [disciplinaTurma, setDisciplinaTurma] = useState([]);
  const [professorDisciplinaTurma, setProfessorDisciplinaTurma] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);
  const [customModal, setCustomModal] = useState(null);
  
  // Add state for search and filter functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usersData,
          classesData,
          transactionsData,
          subjectsData,
          transactionRulesData,
          enrollmentsData,
        ] = await Promise.all([
          getUsers(),
          getClasses(),
          getTransactions(),
          getSubjects(),
          getTransactionRules(),
          getEnrollments(),
        ]);
        console.log('Fetched data:', {
          users: usersData,
          classes: classesData,
          subjects: subjectsData,
          enrollments: enrollmentsData,
          alunoDisciplina: mockData.aluno_disciplina,
          disciplinaTurma: mockData.disciplina_turma,
          professorDisciplinaTurma: mockData.professor_disciplina_turma,
        }); // Debug
        setUsers(usersData.data || []);
        setClasses(classesData.data || []);
        setTransactions(transactionsData.data || []);
        setSubjects(subjectsData.data || []);
        setTransactionRules(transactionRulesData.data || []);
        setEnrollments(enrollmentsData.data || []);
        setAlunoDisciplina(mockData.aluno_disciplina || []);
        setDisciplinaTurma(mockData.disciplina_turma || []);
        setProfessorDisciplinaTurma(mockData.professor_disciplina_turma || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log('State updated:', { users, subjects, enrollments, alunoDisciplina, disciplinaTurma, professorDisciplinaTurma }); // Debug
  }, [users, subjects, enrollments, alunoDisciplina, disciplinaTurma, professorDisciplinaTurma]);

  const openModal = (type, item = null) => {
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
    setShowModal(false);
    setSelectedItem(null);
    setCustomModal(null);
  };

  const memoizedUsers = useMemo(() => users, [users]);
  const memoizedClasses = useMemo(() => classes, [classes]);
  const memoizedEnrollments = useMemo(() => enrollments, [enrollments]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <Users users={memoizedUsers} setUsers={setUsers} openModal={openModal} />;
      case 'transactions':
        return (
          <Transactions
            transactions={transactions}
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
            subjects={subjects}
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
          />
        );
      case 'enrollments':
        return (
          <Enrollments
            enrollments={memoizedEnrollments}
            setEnrollments={setEnrollments}
            users={memoizedUsers}
            classes={memoizedClasses}
            openModal={openModal}
          />
        );
      case 'transactionRules':
        return (
          <TransactionRules />
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
          setAlunoDisciplina={setAlunoDisciplina}
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
            selectedItem={selectedItem}
            setUsers={setUsers}
          />
        );
      case 'transactions':
        return (
          <TransactionModal
            showModal={showModal}
            closeModal={closeModal}
            modalType={modalType}
            selectedItem={selectedItem}
            setTransactions={setTransactions}
            users={memoizedUsers}
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
            setAlunoDisciplina={setAlunoDisciplina}
            setDisciplinaTurma={setDisciplinaTurma}
            setProfessorDisciplinaTurma={setProfessorDisciplinaTurma}
          />
        );
      case 'classes':
        return (
          <ClassModal
            showModal={showModal}
            closeModal={closeModal}
            modalType={modalType}
            selectedItem={selectedItem}
            setClasses={setClasses}
            users={memoizedUsers}
          />
        );
      case 'enrollments':
        return (
          <EnrollmentModal
            showModal={showModal}
            closeModal={closeModal}
            modalType={modalType}
            selectedItem={selectedItem}
            setEnrollments={setEnrollments}
            users={memoizedUsers}
            classes={memoizedClasses}
          />
        );
      case 'transactionRules':
        return (
          <TransactionRuleModal
            showModal={showModal}
            closeModal={closeModal}
            modalType={modalType}
            selectedItem={selectedItem}
            setRules={setTransactionRules}
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
        {renderContent()}
        {renderModal()}
      </div>
    </div>
  );
};

export default ValCoinAdmin;
