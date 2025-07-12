import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Menu } from 'lucide-react';
import SubjectModal from './SubjectModal';
import StudentEnrollmentModal from './StudentEnrollmentModal';
import TeacherAssignmentModal from './TeacherAssignmentModal';
import Subjects from './Subjects';
import Users from './Users';
import Table from './Table';
import {
  getUsers,
  getClasses,
  getTransactions,
  getSubjects,
  getCriteria,
  getEnrollments,
} from '../services';
import { mockData } from '../data/mockData';

const ValCoinAdmin = () => {
  const [activeTab, setActiveTab] = useState('subjects');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [customModal, setCustomModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [alunoDisciplina, setAlunoDisciplina] = useState([]);
  const [disciplinaTurma, setDisciplinaTurma] = useState([]);
  const [professorDisciplinaTurma, setProfessorDisciplinaTurma] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Memoize data to prevent unnecessary re-renders
  const memoizedUsers = useMemo(() => users, [users]);
  const memoizedClasses = useMemo(() => classes, [classes]);
  const memoizedTransactions = useMemo(() => transactions, [transactions]);
  const memoizedSubjects = useMemo(() => subjects, [subjects]);
  const memoizedCriteria = useMemo(() => criteria, [criteria]);
  const memoizedEnrollments = useMemo(() => enrollments, [enrollments]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usersData,
          classesData,
          transactionsData,
          subjectsData,
          criteriaData,
          enrollmentsData,
        ] = await Promise.all([
          getUsers(),
          getClasses(),
          getTransactions(),
          getSubjects(),
          getCriteria(),
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
        setUsers(usersData || []);
        setClasses(classesData || []);
        setTransactions(transactionsData || []);
        setSubjects(subjectsData || []);
        setCriteria(criteriaData || []);
        setEnrollments(enrollmentsData || []);
        setAlunoDisciplina(mockData.aluno_disciplina || []);
        setDisciplinaTurma(mockData.disciplina_turma || []);
        setProfessorDisciplinaTurma(mockData.professor_disciplina_turma || []);
        console.log('State updated:', {
          users: usersData,
          classes: classesData,
          subjects: subjectsData,
          enrollments: enrollmentsData,
          alunoDisciplina: mockData.aluno_disciplina,
          disciplinaTurma: mockData.disciplina_turma,
          professorDisciplinaTurma: mockData.professor_disciplina_turma,
        }); // Debug
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Erro ao carregar dados.');
      }
    };
    fetchData();
  }, []);

  const openModal = (type, item = null, customType = null) => {
    setModalType(type);
    setSelectedItem(item);
    setCustomModal(customType);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('create');
    setSelectedItem(null);
    setCustomModal(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
          />
        );
      case 'users':
        return null; // Add UserModal here if implemented
      default:
        return null;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'subjects':
        return (
          <Subjects
            subjects={memoizedSubjects}
            setSubjects={setSubjects}
            openModal={openModal}
          />
        );
      case 'users':
        return (
          <Users
            users={memoizedUsers}
            setUsers={setUsers}
            openModal={openModal}
          />
        );
      case 'classes':
        return (
          <Table
            data={memoizedClasses}
            columns={[
              { key: 'nome', label: 'Nome' },
              { key: 'ano_letivo', label: 'Ano Letivo' },
              { key: 'numero_alunos', label: 'Número de Alunos' },
              {
                key: 'ativo',
                label: 'Estado',
                render: (value) => (value ? 'Ativo' : 'Inativo'),
              },
            ]}
            openModal={openModal}
          />
        );
      case 'transactions':
        return (
          <Table
            data={memoizedTransactions}
            columns={[
              { key: 'id', label: 'ID' },
              {
                key: 'data_criacao',
                label: 'Data',
                render: (value) => new Date(value).toLocaleDateString('pt-PT'),
              },
              { key: 'valor', label: 'Valor' },
              { key: 'motivo', label: 'Motivo' },
            ]}
            openModal={openModal}
          />
        );
      case 'criteria':
        return (
          <Table
            data={memoizedCriteria}
            columns=[
              { key: 'nome', label: 'Nome' },
              { key: 'valor', label: 'Valor' },
              { key: 'tipo', label: 'Tipo' },
              {
                key: 'ativo',
                label: 'Estado',
                render: (value) => (value ? 'Ativo' : 'Inativo'),
              },
            ]
            openModal={openModal}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-16'
        } bg-white shadow-lg transition-all duration-300`}
      >
        <div className="p-4 flex items-center justify-between">
          <h1 className={`text-xl font-bold ${isSidebarOpen ? 'block' : 'hidden'}`}>
            ValCoin Admin
          </h1>
          <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-800">
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-4">
          <ul>
            <li>
              <button
                className={`w-full text-left p-4 flex items-center space-x-2 ${
                  activeTab === 'subjects'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('subjects')}
              >
                <span className="material-icons">school</span>
                {isSidebarOpen && <span>Disciplinas</span>}
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-4 flex items-center space-x-2 ${
                  activeTab === 'users'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('users')}
              >
                <span className="material-icons">people</span>
                {isSidebarOpen && <span>Utilizadores</span>}
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-4 flex items-center space-x-2 ${
                  activeTab === 'classes'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('classes')}
              >
                <span className="material-icons">class</span>
                {isSidebarOpen && <span>Turmas</span>}
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-4 flex items-center space-x-2 ${
                  activeTab === 'transactions'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('transactions')}
              >
                <span className="material-icons">attach_money</span>
                {isSidebarOpen && <span>Transações</span>}
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-4 flex items-center space-x-2 ${
                  activeTab === 'criteria'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('criteria')}
              >
                <span className="material-icons">checklist</span>
                {isSidebarOpen && <span>Critérios</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          {renderTabContent()}
        </div>
        {renderModal()}
      </div>
    </div>
  );
};

export default ValCoinAdmin;
