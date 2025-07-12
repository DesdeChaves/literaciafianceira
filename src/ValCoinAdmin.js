import React, { useState, useEffect } from 'react';
import {
  Users,
  Coins,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Settings,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Award,
  Building,
  Calendar,
  User,
  Mail,
  Phone
} from 'lucide-react';

const ValCoinAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentData, setCurrentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState('view');
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});

  // Mock data
  const [mockData, setMockData] = useState({
    users: [
      { id: '1', numero_mecanografico: '2024001', nome: 'João Silva', email: 'joao@valpacos.edu.pt', tipo_utilizador: 'ALUNO', ativo: true, turma_id: '1', turma: '7A', saldo_vc: 45.50 },
      { id: '2', numero_mecanografico: '2024002', nome: 'Maria Santos', email: 'maria@valpacos.edu.pt', tipo_utilizador: 'PROFESSOR', ativo: true, departamento: 'Matemática', plafond_mensal: 200 },
      { id: '3', numero_mecanografico: '2024003', nome: 'Pedro Costa', email: 'pedro@valpacos.edu.pt', tipo_utilizador: 'ALUNO', ativo: true, turma_id: '2', turma: '8B', saldo_vc: 23.75 },
      { id: '4', numero_mecanografico: '2024004', nome: 'Ana Ferreira', email: 'ana@valpacos.edu.pt', tipo_utilizador: 'DIRETOR_TURMA', ativo: true, turma_id: '3', turma: '9C', departamento: 'Português' }
    ],
    transactions: [
      { id: '1', aluno_origem: 'João Silva', aluno_destino: 'Maria Santos', valor: 10.0, tipo: 'GANHO', status: 'APROVADA', data_transacao: '2024-07-08T10:30:00', descricao: 'Participação exemplar' },
      { id: '2', aluno_origem: 'João Silva', aluno_destino: 'Maria Santos', valor: 5.0, tipo: 'GASTO', status: 'PENDENTE', data_transacao: '2024-07-08T14:15:00', descricao: 'Serviço de impressão' },
      { id: '3', aluno_origem: 'Ana Ferreira', aluno_destino: 'João Silva', valor: 15.0, tipo: 'TRANSFERENCIA', status: 'APROVADA', data_transacao: '2024-07-07T16:45:00', descricao: 'Tutoria matemática' }
    ],
    subjects: [
      { id: '1', codigo: 'MAT', nome: 'Matemática', ciclo_id: '3_CICLO', ativo: true },
      { id: '2', codigo: 'POR', nome: 'Português', ciclo_id: '3_CICLO', ativo: true },
      { id: '3', codigo: 'HIS', nome: 'História', ciclo_id: '3_CICLO', ativo: true },
      { id: '4', codigo: 'ING', nome: 'Inglês', ciclo_id: '3_CICLO', ativo: true }
    ],
    classes: [
      { id: '1', codigo: '7A', nome: '7º A', ano_letivo: '2024/2025', ciclo_id: '3_CICLO', diretor_turma_id: '4', diretor_turma: 'Prof. Silva', numero_alunos: 25, ativo: true },
      { id: '2', codigo: '8B', nome: '8º B', ano_letivo: '2024/2025', ciclo_id: '3_CICLO', diretor_turma_id: '2', diretor_turma: 'Prof. Santos', numero_alunos: 23, ativo: true },
      { id: '3', codigo: '9C', nome: '9º C', ano_letivo: '2024/2025', ciclo_id: '3_CICLO', diretor_turma_id: '4', diretor_turma: 'Prof. Costa', numero_alunos: 22, ativo: true }
    ],
    criteria: [
      { id: '1', nome: 'Participação Ativa', descricao: 'Participação exemplar na aula', valor_vc: 2, limite_mensal: 10, ciclo_id: '3_CICLO', ativo: true },
      { id: '2', nome: 'Trabalho Extra', descricao: 'Trabalho adicional de qualidade', valor_vc: 5, limite_mensal: 5, ciclo_id: '3_CICLO', ativo: true },
      { id: '3', nome: 'Ajuda Colegas', descricao: 'Ajuda a colegas com dificuldades', valor_vc: 3, limite_mensal: 8, ciclo_id: '3_CICLO', ativo: true }
    ],
    aluno_disciplina: []
  });

  const dashboardStats = {
    totalUsers: 1247,
    totalTransactions: 5689,
    totalVC: 12340.50,
    activeWallets: 1156,
    pendingTransactions: 23,
    monthlyGrowth: 15.3
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'users', label: 'Utilizadores', icon: Users },
    { id: 'transactions', label: 'Transações', icon: Coins },
    { id: 'subjects', label: 'Disciplinas', icon: BookOpen },
    { id: 'classes', label: 'Turmas', icon: GraduationCap },
    { id: 'criteria', label: 'Critérios', icon: Award },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  // Initialize data with mockData
  useEffect(() => {
    setCurrentData(mockData.users);
    setLoading(false);
  }, [mockData.users]);

  const openModal = (type, item = null, tab = activeTab) => {
    setModalType(type);
    setSelectedItem(item);
    setActiveTab(tab);
    setFormData(item || {});
    setShowModal(true);
    setError(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setFormData({});
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APROVADA': return 'text-green-600 bg-green-100';
      case 'PENDENTE': return 'text-yellow-600 bg-yellow-100';
      case 'REJEITADA': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUserTypeColor = (type) => {
    switch (type) {
      case 'ALUNO': return 'text-blue-600 bg-blue-100';
      case 'PROFESSOR': return 'text-purple-600 bg-purple-100';
      case 'DIRETOR_TURMA': return 'text-orange-600 bg-orange-100';
      case 'ADMIN': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Handle form submission for creating/editing classes, students, and subjects
  const handleSubmit = async (overrideFormData = formData) => {
    setLoading(true);
    setError(null);
    try {
      if (modalType === 'create' || modalType === 'edit') {
        if (activeTab === 'classes') {
          const classData = {
            id: modalType === 'create' ? String(mockData.classes.length + 1) : formData.id,
            codigo: formData.codigo,
            nome: formData.nome,
            ano_letivo: formData.ano_letivo,
            ciclo_id: formData.ciclo_id,
            diretor_turma_id: formData.diretor_turma_id,
            diretor_turma: mockData.users.find(u => u.id === formData.diretor_turma_id)?.nome || 'N/A',
            numero_alunos: formData.numero_alunos || 0,
            ativo: formData.ativo === 'true'
          };
          if (modalType === 'create') {
            setMockData(prev => ({
              ...prev,
              classes: [...prev.classes, classData]
            }));
          } else {
            setMockData(prev => ({
              ...prev,
              classes: prev.classes.map(c => c.id === formData.id ? { ...c, ...classData } : c)
            }));
          }
        } else if (activeTab === 'users' && formData.tipo_utilizador === 'ALUNO') {
          const studentData = {
            id: modalType === 'create' ? String(mockData.users.length + 1) : formData.id,
            numero_mecanografico: formData.numero_mecanografico,
            nome: formData.nome,
            email: formData.email,
            tipo_utilizador: 'ALUNO',
            ativo: formData.ativo === 'true',
            numero_aluno: formData.numero_aluno,
            turma_id: formData.turma_id,
            ciclo_id: formData.ciclo_id,
            data_nascimento: formData.data_nascimento,
            encarregado_educacao: formData.encarregado_educacao,
            telefone_ee: formData.telefone_ee,
            email_ee: formData.email_ee,
            turma: mockData.classes.find(c => c.id === formData.turma_id)?.nome || 'N/A',
            saldo_vc: formData.saldo_vc || 0
          };
          if (modalType === 'create') {
            setMockData(prev => ({
              ...prev,
              users: [...prev.users, studentData]
            }));
            setCurrentData(prev => [...prev, studentData]);
          } else {
            setMockData(prev => ({
              ...prev,
              users: prev.users.map(u => u.id === formData.id ? { ...u, ...studentData } : u)
            }));
            setCurrentData(prev => prev.map(u => u.id === formData.id ? { ...u, ...studentData } : u));
          }
        } else if (activeTab === 'subjects') {
          const subjectData = {
            id: modalType === 'create' ? String(mockData.subjects.length + 1) : formData.id,
            codigo: formData.codigo,
            nome: formData.nome,
            ciclo_id: formData.ciclo_id,
            ativo: formData.ativo === 'true'
          };
          if (modalType === 'create') {
            setMockData(prev => ({
              ...prev,
              subjects: [...prev.subjects, subjectData]
            }));
          } else {
            setMockData(prev => ({
              ...prev,
              subjects: prev.subjects.map(s => s.id === formData.id ? { ...s, ...subjectData } : s)
            }));
          }
        } else if (activeTab === 'aluno_disciplina') {
          const enrollmentData = {
            id: String(mockData.aluno_disciplina.length + 1),
            aluno_id: overrideFormData.aluno_id,
            disciplina_id: overrideFormData.disciplina_id,
            ano_letivo: overrideFormData.ano_letivo,
            ativo: overrideFormData.ativo === 'true'
          };
          setMockData(prev => ({
            ...prev,
            aluno_disciplina: [...prev.aluno_disciplina, enrollmentData]
          }));
        } else if (activeTab === 'transactions') {
          const transactionData = {
            id: modalType === 'create' ? String(mockData.transactions.length + 1) : formData.id,
            aluno_origem: formData.aluno_origem,
            aluno_destino: formData.aluno_destino,
            valor: parseFloat(formData.valor),
            tipo: formData.tipo,
            status: formData.status,
            data_transacao: formData.data_transacao || new Date().toISOString(),
            descricao: formData.descricao
          };
          if (modalType === 'create') {
            setMockData(prev => ({
              ...prev,
              transactions: [...prev.transactions, transactionData]
            }));
          } else {
            setMockData(prev => ({
              ...prev,
              transactions: prev.transactions.map(t => t.id === formData.id ? { ...t, ...transactionData } : t)
            }));
          }
        }
      } else if (modalType === 'delete') {
        if (activeTab === 'classes') {
          setMockData(prev => ({
            ...prev,
            classes: prev.classes.filter(c => c.id !== formData.id)
          }));
        } else if (activeTab === 'users') {
          setMockData(prev => ({
            ...prev,
            users: prev.users.filter(u => u.id !== formData.id)
          }));
          setCurrentData(prev => prev.filter(u => u.id !== formData.id));
        } else if (activeTab === 'subjects') {
          setMockData(prev => ({
            ...prev,
            subjects: prev.subjects.filter(s => s.id !== formData.id)
          }));
        } else if (activeTab === 'transactions') {
          setMockData(prev => ({
            ...prev,
            transactions: prev.transactions.filter(t => t.id !== formData.id)
          }));
        }
      }
      closeModal();
    } catch (err) {
      setError('Erro ao processar a operação: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Utilizadores</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        {/* Other dashboard stats remain unchanged */}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Transações Recentes</h3>
          <div className="space-y-3">
            {mockData.transactions.slice(0, 5).map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{transaction.aluno_origem}</p>
                  <p className="text-sm text-gray-600">{transaction.descricao}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{transaction.valor} VC</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Atividade por Ciclo</h3>
          {/* Activity by cycle remains unchanged */}
        </div>
      </div>
    </div>
  );

  const renderTable = (data, columns, actions = true, customActions) => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column.label}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render ? column.render(item[column.key], item) : item[column.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {customActions ? (
                        customActions(item)
                      ) : (
                        <>
                          <button
                            onClick={() => openModal('view', item)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openModal('edit', item)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openModal('delete', item)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsers = () => {
    const columns = [
      { key: 'numero_mecanografico', label: 'Nº Mecanográfico' },
      { key: 'nome', label: 'Nome' },
      { key: 'email', label: 'Email' },
      {
        key: 'tipo_utilizador',
        label: 'Tipo',
        render: (value) => (
          <span className={`px-2 py-1 rounded-full text-xs ${getUserTypeColor(value)}`}>
            {value}
          </span>
        )
      },
      {
        key: 'ativo',
        label: 'Estado',
        render: (value) => (
          <span className={`px-2 py-1 rounded-full text-xs ${value ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
            {value ? 'Ativo' : 'Inativo'}
          </span>
        )
      },
      { key: 'turma', label: 'Turma/Departamento' }
    ];

    const filteredUsers = mockData.users.filter(user =>
      (filterStatus === 'all' || user.tipo_utilizador === filterStatus) &&
      (user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.numero_mecanografico.includes(searchTerm))
    );

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Utilizadores</h2>
          <button
            onClick={() => openModal('create', null, 'users')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Utilizador</span>
          </button>
        </div>
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar utilizadores..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="ALUNO">Alunos</option>
            <option value="PROFESSOR">Professores</option>
            <option value="DIRETOR_TURMA">Diretores de Turma</option>
          </select>
        </div>
        {renderTable(filteredUsers, columns)}
      </div>
    );
  };

  const renderClasses = () => {
    const columns = [
      { key: 'codigo', label: 'Código' },
      { key: 'nome', label: 'Nome' },
      { key: 'ano_letivo', label: 'Ano Letivo' },
      { key: 'ciclo_id', label: 'Ciclo' },
      { key: 'diretor_turma', label: 'Diretor de Turma' },
      { key: 'numero_alunos', label: 'Nº Alunos' },
      {
        key: 'ativo',
        label: 'Estado',
        render: (value) => (
          <span className={`px-2 py-1 rounded-full text-xs ${value ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
            {value ? 'Ativo' : 'Inativo'}
          </span>
        )
      }
    ];

    const customActions = (item) => (
      <>
        <button
          onClick={() => openModal('view', item)}
          className="text-blue-600 hover:text-blue-900"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => openModal('edit', item)}
          className="text-green-600 hover:text-green-900"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => openModal('delete', item)}
          className="text-red-600 hover:text-red-900"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => openModal('enroll', item, 'aluno_disciplina')}
          className="text-purple-600 hover:text-purple-900"
        >
          <BookOpen className="w-4 h-4" />
        </button>
      </>
    );

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Turmas</h2>
          <button
            onClick={() => openModal('create', null, 'classes')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Turma</span>
          </button>
        </div>
        {renderTable(mockData.classes, columns, true, customActions)}
      </div>
    );
  };

  const renderSubjects = () => {
    const columns = [
      { key: 'codigo', label: 'Código' },
      { key: 'nome', label: 'Nome' },
      { key: 'ciclo_id', label: 'Ciclo' },
      {
        key: 'ativo',
        label: 'Estado',
        render: (value) => (
          <span className={`px-2 py-1 rounded-full text-xs ${value ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
            {value ? 'Ativo' : 'Inativo'}
          </span>
        )
      }
    ];

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Disciplinas</h2>
          <button
            onClick={() => openModal('create', null, 'subjects')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Disciplina</span>
          </button>
        </div>
        {renderTable(mockData.subjects, columns)}
      </div>
    );
  };

  const renderAlunoDisciplina = () => {
    const columns = [
      { key: 'aluno_nome', label: 'Aluno' },
      { key: 'disciplina_nome', label: 'Disciplina' },
      { key: 'ano_letivo', label: 'Ano Letivo' },
      {
        key: 'ativo',
        label: 'Estado',
        render: (value) => (
          <span className={`px-2 py-1 rounded-full text-xs ${value ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
            {value ? 'Ativo' : 'Inativo'}
          </span>
        )
      }
    ];

    const alunoDisciplinaData = mockData.aluno_disciplina.map(enrollment => ({
      ...enrollment,
      aluno_nome: mockData.users.find(u => u.id === enrollment.aluno_id)?.nome || 'N/A',
      disciplina_nome: mockData.subjects.find(s => s.id === enrollment.disciplina_id)?.nome || 'N/A'
    }));

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Matrículas em Disciplinas</h2>
          <button
            onClick={() => openModal('create', null, 'aluno_disciplina')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Matrícula</span>
          </button>
        </div>
        {renderTable(alunoDisciplinaData, columns)}
      </div>
    );
  };

  const renderModal = () => {
    if (!showModal) return null;

    const isViewMode = modalType === 'view';
    const isEditMode = modalType === 'edit';
    const isCreateMode = modalType === 'create';
    const isDeleteMode = modalType === 'delete';
    const isEnrollMode = modalType === 'enroll';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {isViewMode && 'Visualizar'}
                {isEditMode && 'Editar'}
                {isCreateMode && 'Criar Novo'}
                {isDeleteMode && 'Confirmar Exclusão'}
                {isEnrollMode && 'Matricular Alunos em Disciplinas'}
                {activeTab === 'users' && ' Utilizador'}
                {activeTab === 'transactions' && ' Transação'}
                {activeTab === 'subjects' && ' Disciplina'}
                {activeTab === 'classes' && ' Turma'}
                {activeTab === 'criteria' && ' Critério'}
                {activeTab === 'aluno_disciplina' && ' Matrícula'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            {isDeleteMode ? (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    disabled={loading}
                  >
                    {loading ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              </div>
            ) : isEnrollMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disciplina
                  </label>
                  <select
                    name="disciplina_id"
                    value={formData.disciplina_id || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isViewMode}
                  >
                    <option value="">Selecione uma disciplina</option>
                    {mockData.subjects.filter(s => s.ciclo_id === selectedItem.ciclo_id).map(subject => (
                      <option key={subject.id} value={subject.id}>{subject.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alunos
                  </label>
                  <select
                    name="aluno_id"
                    multiple
                    value={formData.aluno_id || []}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions).map(option => option.value);
                      setFormData(prev => ({ ...prev, aluno_id: selected }));
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isViewMode}
                  >
                    {mockData.users
                      .filter(u => u.tipo_utilizador === 'ALUNO' && u.turma_id === selectedItem.id)
                      .map(student => (
                        <option key={student.id} value={student.id}>{student.nome}</option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ano Letivo
                  </label>
                  <input
                    type="text"
                    name="ano_letivo"
                    value={formData.ano_letivo || selectedItem.ano_letivo}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isViewMode}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={async () => {
                      for (const aluno_id of formData.aluno_id) {
                        await handleSubmit({ ...formData, aluno_id });
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    disabled={loading || !formData.disciplina_id || !formData.aluno_id?.length}
                  >
                    {loading ? 'Matriculando...' : 'Matricular'}
                  </button>
                </div>
              </div>
            ) : activeTab === 'transactions' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aluno Origem
                  </label>
                  <input
                    type="text"
                    name="aluno_origem"
                    value={formData.aluno_origem || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isViewMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aluno Destino
                  </label>
                  <input
                    type="text"
                    name="aluno_destino"
                    value={formData.aluno_destino || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isViewMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor
                  </label>
                  <input
                    type="number"
                    name="valor"
                    value={formData.valor || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isViewMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    name="tipo"
                    value={formData.tipo || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isViewMode}
                  >
                    <option value="GANHO">Ganho</option>
                    <option value="GASTO">Gasto</option>
                    <option value="TRANSFERENCIA">Transferência</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isViewMode}
                  >
                    <option value="APROVADA">Aprovada</option>
                    <option value="PENDENTE">Pendente</option>
                    <option value="REJEITADA">Rejeitada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <input
                    type="text"
                    name="descricao"
                    value={formData.descricao || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isViewMode}
                  />
                </div>
                {!isViewMode && (
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      disabled={loading}
                    >
                      {loading ? 'Salvando...' : isCreateMode ? 'Criar' : 'Salvar'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {activeTab === 'users' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número Mecanográfico
                      </label>
                      <input
                        type="text"
                        name="numero_mecanografico"
                        value={formData.numero_mecanografico || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isViewMode}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isViewMode}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isViewMode}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Utilizador
                      </label>
                      <select
                        name="tipo_utilizador"
                        value={formData.tipo_utilizador || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isViewMode}
                      >
                        <option value="ALUNO">Aluno</option>
                        <option value="PROFESSOR">Professor</option>
                        <option value="DIRETOR_TURMA">Diretor de Turma</option>
                        <option value="DIRECAO">Direção</option>
                        <option value="ADMIN">Administrador</option>
                      </select>
                    </div>
                    {formData.tipo_utilizador === 'ALUNO' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Número de Aluno
                          </label>
                          <input
                            type="text"
                            name="numero_aluno"
                            value={formData.numero_aluno || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isViewMode}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Turma
                          </label>
                          <select
                            name="turma_id"
                            value={formData.turma_id || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isViewMode}
                          >
                            <option value="">Selecione uma turma</option>
                            {mockData.classes.map(turma => (
                              <option key={turma.id} value={turma.id}>{turma.nome}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ciclo
                          </label>
                          <select
                            name="ciclo_id"
                            value={formData.ciclo_id || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isViewMode}
                          >
                            <option value="1_CICLO">1º Ciclo</option>
                            <option value="2_CICLO">2º Ciclo</option>
                            <option value="3_CICLO">3º Ciclo</option>
                            <option value="SECUNDARIO">Secundário</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Data de Nascimento
                          </label>
                          <input
                            type="date"
                            name="data_nascimento"
                            value={formData.data_nascimento || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isViewMode}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Encarregado de Educação
                          </label>
                          <input
                            type="text"
                            name="encarregado_educacao"
                            value={formData.encarregado_educacao || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isViewMode}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Telefone EE
                          </label>
                          <input
                            type="text"
                            name="telefone_ee"
                            value={formData.telefone_ee || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isViewMode}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email EE
                          </label>
                          <input
                            type="email"
                            name="email_ee"
                            value={formData.email_ee || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isViewMode}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
                {activeTab === 'classes' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código
                      </label>
                      <input
                        type="text"
                        name="codigo"
                        value={formData.codigo || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isViewMode}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome
                      </label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isViewMode}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ano Letivo
                      </label>
                      <input
                        type="text"
                        name="ano_letivo"
                        value={formData.ano_letivo || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isViewMode}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ciclo
                      </label>
                      <select
                        name="ciclo_id"
                        value={formData.ciclo_id || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isViewMode}
                      >
                        <option value="1_CICLO">1º Ciclo</option>
                        <option value="2_CICLO">2º Ciclo</option>
                        <option value="3_CICLO">3º Ciclo</option>
                        <option value="SECUNDARIO">Secundário</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Diretor de Turma
                      </label>
                      <select
                        name="diretor_turma_id"
                        value={formData.diretor_turma_id || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isViewMode}
                      >
                        <option value="">Selecione um diretor</option>
                        {mockData.users
                          .filter(u => u.tipo_utilizador === 'DIRETOR_TURMA' || u.tipo_utilizador === 'PROFESSOR')
                          .map(teacher => (
                            <option key={teacher.id} value={teacher.id}>{teacher.nome}</option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                      </label>
                      <select
                        name="ativo"
                        value={formData.ativo === undefined ? '' : formData.ativo.toString()}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isViewMode}
                      >
                        <option value="true">Ativo</option>
                        <option value="false">Inativo</option>
                      </select>
                    </div>
                  </div>
                )}
                {activeTab === 'subjects' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código
                      </label>
                      <input
                        type="text"
                        name="codigo"
                        value={formData.codigo || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isViewMode}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome
                      </label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isViewMode}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ciclo
                      </label>
                      <select
                        name="ciclo_id"
                        value={formData.ciclo_id || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isViewMode}
                      >
                        <option value="1_CICLO">1º Ciclo</option>
                        <option value="2_CICLO">2º Ciclo</option>
                        <option value="3_CICLO">3º Ciclo</option>
                        <option value="SECUNDARIO">Secundário</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                      </label>
                      <select
                        name="ativo"
                        value={formData.ativo === undefined ? '' : formData.ativo.toString()}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isViewMode}
                      >
                        <option value="true">Ativo</option>
                        <option value="false">Inativo</option>
                      </select>
                    </div>
                  </div>
                )}
                {!isViewMode && (
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      disabled={loading}
                    >
                      {loading ? 'Salvando...' : isCreateMode ? 'Criar' : 'Salvar'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsers();
      case 'transactions':
        return renderTransactions();
      case 'subjects':
        return renderSubjects();
      case 'classes':
        return renderClasses();
      case 'criteria':
        return renderTable(mockData.criteria, [
          { key: 'nome', label: 'Nome' },
          { key: 'descricao', label: 'Descrição' },
          { key: 'valor_vc', label: 'Valor VC', render: (value) => `${value} VC` },
          { key: 'limite_mensal', label: 'Limite Mensal' },
          { key: 'ciclo_id', label: 'Ciclo' },
          { key: 'ativo', label: 'Estado', render: (value) => (
            <span className={`px-2 py-1 rounded-full text-xs ${value ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
              {value ? 'Ativo' : 'Inativo'}
            </span>
          )}
        ]);
      case 'aluno_disciplina':
        return renderAlunoDisciplina();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  const renderTransactions = () => {
    const columns = [
      { key: 'aluno_origem', label: 'Origem' },
      { key: 'aluno_destino', label: 'Destino' },
      { key: 'valor', label: 'Valor', render: (value) => `${value} VC` },
      { key: 'tipo', label: 'Tipo', render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'GANHO' ? 'text-green-600 bg-green-100' :
          value === 'GASTO' ? 'text-red-600 bg-red-100' :
          'text-blue-600 bg-blue-100'
        }`}>
          {value}
        </span>
      )},
      { key: 'status', label: 'Estado', render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(value)}`}>
          {value}
        </span>
      )},
      { key: 'data_transacao', label: 'Data', render: (value) => new Date(value).toLocaleDateString('pt-PT') },
      { key: 'descricao', label: 'Descrição' }
    ];

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Transações</h2>
          <div className="flex space-x-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            <button
              onClick={() => openModal('create', null, 'transactions')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Transação</span>
            </button>
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar transações..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos os Estados</option>
            <option value="PENDENTE">Pendentes</option>
            <option value="APROVADA">Aprovadas</option>
            <option value="REJEITADA">Rejeitadas</option>
          </select>
        </div>
        {renderTable(mockData.transactions, columns)}
      </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Configurações do Sistema</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Configurações Gerais</h3>
        <p className="text-gray-600">Configure as opções do sistema aqui.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Coins className="w-8 h-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">ValCoin Admin</h1>
              </div>
              <div className="hidden md:block">
                <span className="text-sm text-gray-500">Agrupamento de Escolas de Valpaços</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Admin</span>
              </div>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm">
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          <div className="w-64 mr-8">
            <nav className="space-y-2">
              {tabs.concat({ id: 'aluno_disciplina', label: 'Matrículas', icon: BookOpen }).map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </div>
      </div>
      {renderModal()}
    </div>
  );
};

export default ValCoinAdmin;
