// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

let mockData = {
  users: [
    {
      id: '1e4f2a3b-4c5d-6e7f-8a9b-0c1d2e3f4a5b',
      numero_mecanografico: '123456',
      nome: 'João Ferreira',
      email: 'joao.ferreira@example.com',
      tipo_utilizador: 'ALUNO',
      password_hash: 'hashed_password_123',
      ativo: true,
      data_criacao: '2023-10-01T10:00:00Z',
      data_atualizacao: '2023-10-01T10:00:00Z',
      ultimo_login: null,
      consentimento_rgpd: true,
      data_consentimento_rgpd: '2023-10-01T10:00:00Z',
    },
    {
      id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
      numero_mecanografico: '789012',
      nome: 'Maria Silva',
      email: 'maria.silva@example.com',
      tipo_utilizador: 'PROFESSOR',
      password_hash: 'hashed_password_456',
      ativo: true,
      data_criacao: '2023-10-01T10:00:00Z',
      data_atualizacao: '2023-10-01T10:00:00Z',
      ultimo_login: null,
      consentimento_rgpd: true,
      data_consentimento_rgpd: '2023-10-01T10:00:00Z',
    },
    {
      id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
      numero_mecanografico: '345678',
      nome: 'Admin User',
      email: 'admin@example.com',
      tipo_utilizador: 'ADMIN',
      password_hash: 'hashed_password_789',
      ativo: true,
      data_criacao: '2023-10-01T10:00:00Z',
      data_atualizacao: '2023-10-01T10:00:00Z',
      ultimo_login: null,
      consentimento_rgpd: true,
      data_consentimento_rgpd: '2023-10-01T10:00:00Z',
    },
  ],
  transactions: [
    {
      id: 't1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c',
      transaction_group_id: 'tg1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c',
      utilizador_origem_id: '1e4f2a3b-4c5d-6e7f-8a9b-0c1d2e3f4a5b',
      utilizador_destino_id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
      montante: 100,
      tipo: 'CREDITO',
      status: 'CONCLUIDA',
      data_transacao: '2023-10-01T12:00:00Z',
      descricao: 'Pagamento de aula',
    },
  ],
  subjects: [
    {
      id: 's1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c',
      nome: 'Matemática',
      codigo: 'MAT',
      ativo: true,
    },
  ],
  criteria: [
    {
      id: 'c1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c',
      nome: 'Participação em Aula',
      ativo: true,
    },
  ],
  aluno_disciplina: [
    {
      id: 'ad1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c',
      aluno_id: '1e4f2a3b-4c5d-6e7f-8a9b-0c1d2e3f4a5b',
      disciplina_id: 's1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c',
      ano_letivo: '2024/2025',
      ativo: true,
    },
  ],
  aluno_turma: [
    {
      id: 'at1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c',
      aluno_id: '1e4f2a3b-4c5d-6e7f-8a9b-0c1d2e3f4a5b',
      turma_id: 'cl1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c',
      ativo: true,
    },
  ],
  transactionRules: [
    {
      id: 'tr1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c',
      nome: 'Recompensa por Participação',
      criterio_id: 'c1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c',
      montante: 50,
      tipo_transacao: 'CREDITO',
      ativo: true,
    },
  ],
  classes: [
    {
      id: 'cl1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c',
      nome: 'Turma A',
      ciclo_id: 'ciclo1',
      ativo: true,
    },
  ],
  ciclos_ensino: [
    {
      id: 'ciclo1',
      nome: '1º Ciclo',
      ativo: true,
    },
  ],
  disciplina_turma: [],
  professor_disciplina_turma: [],
};

const generateId = () => uuidv4();

const getUserNameById = (userId) => {
  const user = mockData.users.find((u) => u.id === userId);
  return user ? user.nome : 'Utilizador não encontrado';
};

const enrichTransactions = (transactions) => {
  return transactions.map((transaction) => ({
    ...transaction,
    utilizador_origem_nome: getUserNameById(transaction.utilizador_origem_id),
    utilizador_destino_nome: getUserNameById(transaction.utilizador_destino_id),
  }));
};

const validateTransaction = (transactionData) => {
  const errors = [];
  if (!transactionData.utilizador_origem_id)
    errors.push('Utilizador origem é obrigatório');
  if (!transactionData.utilizador_destino_id)
    errors.push('Utilizador destino é obrigatório');
  if (
    transactionData.utilizador_origem_id ===
    transactionData.utilizador_destino_id
  ) {
    errors.push('Utilizador destino deve ser diferente do utilizador origem');
  }
  if (
    !transactionData.montante ||
    isNaN(transactionData.montante) ||
    parseFloat(transactionData.montante) <= 0
  ) {
    errors.push('Montante é obrigatório e deve ser um número positivo');
  }
  if (
    !transactionData.descricao ||
    typeof transactionData.descricao !== 'string' ||
    transactionData.descricao.trim() === ''
  ) {
    errors.push('Descrição é obrigatória e deve ser uma string não vazia');
  }
  if (
    transactionData.utilizador_origem_id &&
    transactionData.utilizador_destino_id
  ) {
    const origemUser = mockData.users.find(
      (u) => u.id === transactionData.utilizador_origem_id
    );
    const destinoUser = mockData.users.find(
      (u) => u.id === transactionData.utilizador_destino_id
    );
    if (!origemUser) errors.push('Utilizador origem não encontrado');
    if (!destinoUser) errors.push('Utilizador destino não encontrado');
    if (origemUser && !origemUser.ativo)
      errors.push('Utilizador origem não está ativo');
    if (destinoUser && !destinoUser.ativo)
      errors.push('Utilizador destino não está ativo');
  }
  return errors;
};

const createInverseTransaction = (originalTransaction) => {
  return {
    id: generateId(),
    transaction_group_id: originalTransaction.transaction_group_id,
    utilizador_origem_id: originalTransaction.utilizador_destino_id,
    utilizador_destino_id: originalTransaction.utilizador_origem_id,
    montante: originalTransaction.montante,
    tipo: originalTransaction.tipo === 'CREDITO' ? 'DEBITO' : 'CREDITO',
    status: originalTransaction.status,
    data_transacao: originalTransaction.data_transacao,
    descricao: `[Contrapartida] ${originalTransaction.descricao}`,
  };
};

// Users
app.get('/api/users', (req, res) => {
  console.log('GET /api/users - Returning:', mockData.users);
  res.json(mockData.users);
});

app.get('/api/users/:id', (req, res) => {
  const user = mockData.users.find((u) => u.id === req.params.id);
  if (user) {
    console.log(`GET /api/users/${req.params.id} - Returning:`, user);
    res.json(user);
  } else {
    console.log(`GET /api/users/${req.params.id} - User not found`);
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/api/users', (req, res) => {
  const { numero_mecanografico, nome, email, tipo_utilizador, password } =
    req.body;
  if (
    !numero_mecanografico ||
    !nome ||
    !email ||
    !tipo_utilizador ||
    !password
  ) {
    console.log('POST /api/users - Missing required fields:', req.body);
    return res
      .status(400)
      .json({
        error:
          'All fields (numero_mecanografico, nome, email, tipo_utilizador, password) are required',
      });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    console.log('POST /api/users - Invalid email:', email);
    return res.status(400).json({ error: 'Invalid email format' });
  }
  const validTypes = ['ALUNO', 'PROFESSOR', 'ADMIN'];
  if (!validTypes.includes(tipo_utilizador)) {
    console.log('POST /api/users - Invalid tipo_utilizador:', tipo_utilizador);
    return res
      .status(400)
      .json({ error: 'tipo_utilizador must be one of: ' + validTypes.join(', ') });
  }
  const newUser = {
    id: generateId(),
    numero_mecanografico,
    nome,
    email,
    tipo_utilizador,
    password_hash: password,
    ativo: true,
    data_criacao: new Date().toISOString(),
    data_atualizacao: new Date().toISOString(),
    ultimo_login: null,
    consentimento_rgpd: true,
    data_consentimento_rgpd: new Date().toISOString(),
  };
  mockData.users.push(newUser);
  console.log('POST /api/users - Created:', newUser);
  res.status(201).json(newUser);
});

app.put('/api/users/:id', (req, res) => {
  const index = mockData.users.findIndex((u) => u.id === req.params.id);
  if (index !== -1) {
    const { numero_mecanografico, nome, email, tipo_utilizador } = req.body;
    if (!numero_mecanografico || !nome || !email || !tipo_utilizador) {
      console.log(`PUT /api/users/${req.params.id} - Missing required fields:`, req.body);
      return res
        .status(400)
        .json({
          error:
            'All fields (numero_mecanografico, nome, email, tipo_utilizador) are required',
        });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      console.log(`PUT /api/users/${req.params.id} - Invalid email:`, email);
      return res.status(400).json({ error: 'Invalid email format' });
    }
    const validTypes = ['ALUNO', 'PROFESSOR', 'ADMIN'];
    if (!validTypes.includes(tipo_utilizador)) {
      console.log(`PUT /api/users/${req.params.id} - Invalid tipo_utilizador:`, tipo_utilizador);
      return res
        .status(400)
        .json({ error: 'tipo_utilizador must be one of: ' + validTypes.join(', ') });
    }
    mockData.users[index] = {
      ...mockData.users[index],
      numero_mecanografico,
      nome,
      email,
      tipo_utilizador,
      ativo: req.body.ativo ?? mockData.users[index].ativo,
      data_atualizacao: new Date().toISOString(),
    };
    console.log(`PUT /api/users/${req.params.id} - Updated:`, mockData.users[index]);
    res.json(mockData.users[index]);
  } else {
    console.log(`PUT /api/users/${req.params.id} - User not found`);
    res.status(404).json({ error: 'User not found' });
  }
});

app.delete('/api/users/:id', (req, res) => {
  const index = mockData.users.findIndex((u) => u.id === req.params.id);
  if (index !== -1) {
    mockData.users.splice(index, 1);
    console.log(`DELETE /api/users/${req.params.id} - Deleted`);
    res.status(204).send();
  } else {
    console.log(`DELETE /api/users/${req.params.id} - User not found`);
    res.status(404).json({ error: 'User not found' });
  }
});

// Transactions
app.get('/api/transactions', (req, res) => {
  console.log('GET /api/transactions - Raw transactions:', mockData.transactions);
  const primaryTransactions = mockData.transactions.filter(
    (t) => !t.descricao.includes('[Contrapartida]')
  );
  const enrichedTransactions = enrichTransactions(primaryTransactions);
  console.log('GET /api/transactions - Returning:', enrichedTransactions);
  res.json(enrichedTransactions);
});

app.post('/api/transactions', (req, res) => {
  const transactionData = req.body;
  const errors = validateTransaction(transactionData);
  if (errors.length > 0) {
    console.log('POST /api/transactions - Validation errors:', errors);
    return res.status(400).json({ error: errors.join(', ') });
  }
  const transactionGroupId = generateId();
  const newTransaction = {
    id: generateId(),
    transaction_group_id: transactionGroupId,
    utilizador_origem_id: transactionData.utilizador_origem_id,
    utilizador_destino_id: transactionData.utilizador_destino_id,
    montante: parseFloat(transactionData.montante),
    tipo: transactionData.tipo,
    status: 'CONCLUIDA',
    data_transacao: new Date().toISOString(),
    descricao: transactionData.descricao,
  };
  const inverseTransaction = createInverseTransaction(newTransaction);
  mockData.transactions.push(newTransaction, inverseTransaction);
  console.log('POST /api/transactions - Created:', newTransaction);
  console.log('POST /api/transactions - Inverse created:', inverseTransaction);
  res.status(201).json(newTransaction);
});

// Subjects
app.get('/api/subjects', (req, res) => {
  console.log('GET /api/subjects - Returning:', mockData.subjects);
  res.json(mockData.subjects);
});

app.post('/api/subjects', (req, res) => {
  const { nome, codigo, ativo } = req.body;
  if (!nome || !codigo) {
    console.log('POST /api/subjects - Missing required fields:', req.body);
    return res.status(400).json({ error: 'nome and codigo are required' });
  }
  const existingSubject = mockData.subjects.find(
    (s) => s.nome === nome || s.codigo === codigo
  );
  if (existingSubject) {
    console.log('POST /api/subjects - Subject already exists:', req.body);
    return res
      .status(400)
      .json({ error: 'Nome ou código da disciplina já está em uso' });
  }
  const newSubject = { id: generateId(), nome, codigo, ativo: ativo ?? true };
  mockData.subjects.push(newSubject);
  console.log('POST /api/subjects - Created:', newSubject);
  res.status(201).json(newSubject);
});

app.put('/api/subjects/:id', (req, res) => {
  const index = mockData.subjects.findIndex((s) => s.id === req.params.id);
  if (index !== -1) {
    const { nome, codigo, ativo } = req.body;
    if (!nome || !codigo) {
      console.log(`PUT /api/subjects/${req.params.id} - Missing required fields:`, req.body);
      return res.status(400).json({ error: 'nome and codigo are required' });
    }
    const existingSubject = mockData.subjects.find(
      (s) => (s.nome === nome || s.codigo === codigo) && s.id !== req.params.id
    );
    if (existingSubject) {
      console.log(`PUT /api/subjects/${req.params.id} - Subject already exists:`, req.body);
      return res
        .status(400)
        .json({ error: 'Nome ou código da disciplina já está em uso' });
    }
    mockData.subjects[index] = { ...mockData.subjects[index], nome, codigo, ativo };
    console.log(`PUT /api/subjects/${req.params.id} - Updated:`, mockData.subjects[index]);
    res.json(mockData.subjects[index]);
  } else {
    console.log(`PUT /api/subjects/${req.params.id} - Subject not found`);
    res.status(404).json({ error: 'Subject not found' });
  }
});

app.delete('/api/subjects/:id', (req, res) => {
  const index = mockData.subjects.findIndex((s) => s.id === req.params.id);
  if (index !== -1) {
    mockData.subjects.splice(index, 1);
    console.log(`DELETE /api/subjects/${req.params.id} - Deleted`);
    res.status(204).send();
  } else {
    console.log(`DELETE /api/subjects/${req.params.id} - Subject not found`);
    res.status(404).json({ error: 'Subject not found' });
  }
});

// Enrollments (aluno_disciplina)
app.get('/api/enrollments', (req, res) => {
  console.log('GET /api/enrollments - Returning:', mockData.aluno_disciplina);
  res.json(mockData.aluno_disciplina);
});

app.get('/api/enrollments/:id', (req, res) => {
  const enrollment = mockData.aluno_disciplina.find(
    (e) => e.id === req.params.id
  );
  if (enrollment) {
    console.log(`GET /api/enrollments/${req.params.id} - Returning:`, enrollment);
    res.json(enrollment);
  } else {
    console.log(`GET /api/enrollments/${req.params.id} - Enrollment not found`);
    res.status(404).json({ error: 'Enrollment not found' });
  }
});

app.post('/api/enroll', (req, res) => {
  const { aluno_id, disciplina_id, ano_letivo } = req.body;
  if (!aluno_id || !disciplina_id || !ano_letivo) {
    console.log('POST /api/enroll - Missing required fields:', req.body);
    return res
      .status(400)
      .json({ error: 'aluno_id, disciplina_id, and ano_letivo are required' });
  }
  const aluno = mockData.users.find(
    (u) => u.id === aluno_id && u.tipo_utilizador === 'ALUNO'
  );
  const disciplina = mockData.subjects.find((s) => s.id === disciplina_id);
  if (!aluno) {
    console.log('POST /api/enroll - Invalid aluno_id:', aluno_id);
    return res
      .status(400)
      .json({ error: 'Invalid aluno_id: Student not found or not an ALUNO' });
  }
  if (!disciplina) {
    console.log('POST /api/enroll - Invalid disciplina_id:', disciplina_id);
    return res
      .status(400)
      .json({ error: 'Invalid disciplina_id: Subject not found' });
  }
  const existingEnrollment = mockData.aluno_disciplina.find(
    (ad) =>
      ad.aluno_id === aluno_id &&
      ad.disciplina_id === disciplina_id &&
      ad.ano_letivo === ano_letivo &&
      ad.ativo
  );
  if (existingEnrollment) {
    console.log('POST /api/enroll - Enrollment already exists:', req.body);
    return res
      .status(400)
      .json({
        error: 'Aluno já está inscrito nesta disciplina para o ano letivo',
      });
  }
  const newEnrollment = {
    id: generateId(),
    aluno_id,
    disciplina_id,
    ano_letivo,
    ativo: true,
  };
  mockData.aluno_disciplina.push(newEnrollment);
  console.log('POST /api/enroll - Created:', newEnrollment);
  res.status(201).json(newEnrollment);
});

app.put('/api/enrollments/:id', (req, res) => {
  const index = mockData.aluno_disciplina.findIndex(
    (e) => e.id === req.params.id
  );
  if (index !== -1) {
    const { aluno_id, disciplina_id, ano_letivo, ativo } = req.body;
    if (!aluno_id || !disciplina_id || !ano_letivo) {
      console.log(`PUT /api/enrollments/${req.params.id} - Missing required fields:`, req.body);
      return res
        .status(400)
        .json({ error: 'aluno_id, disciplina_id, and ano_letivo are required' });
    }
    const aluno = mockData.users.find(
      (u) => u.id === aluno_id && u.tipo_utilizador === 'ALUNO'
    );
    const disciplina = mockData.subjects.find((s) => s.id === disciplina_id);
    if (!aluno) {
      console.log(`PUT /api/enrollments/${req.params.id} - Invalid aluno_id:`, aluno_id);
      return res
        .status(400)
        .json({ error: 'Invalid aluno_id: Student not found or not an ALUNO' });
    }
    if (!disciplina) {
      console.log(`PUT /api/enrollments/${req.params.id} - Invalid disciplina_id:`, disciplina_id);
      return res
        .status(400)
        .json({ error: 'Invalid disciplina_id: Subject not found' });
    }
    const existingEnrollment = mockData.aluno_disciplina.find(
      (ad) =>
        ad.aluno_id === aluno_id &&
        ad.disciplina_id === disciplina_id &&
        ad.ano_letivo === ano_letivo &&
        ad.ativo &&
        ad.id !== req.params.id
    );
    if (existingEnrollment) {
      console.log(`PUT /api/enrollments/${req.params.id} - Enrollment already exists:`, req.body);
      return res
        .status(400)
        .json({
          error: 'Aluno já está inscrito nesta disciplina para o ano letivo',
        });
    }
    mockData.aluno_disciplina[index] = {
      ...mockData.aluno_disciplina[index],
      aluno_id,
      disciplina_id,
      ano_letivo,
      ativo,
    };
    console.log(`PUT /api/enrollments/${req.params.id} - Updated:`, mockData.aluno_disciplina[index]);
    res.json(mockData.aluno_disciplina[index]);
  } else {
    console.log(`PUT /api/enrollments/${req.params.id} - Enrollment not found`);
    res.status(404).json({ error: 'Enrollment not found' });
  }
});

app.delete('/api/enrollments/:id', (req, res) => {
  const index = mockData.aluno_disciplina.findIndex(
    (e) => e.id === req.params.id
  );
  if (index !== -1) {
    mockData.aluno_disciplina[index] = {
      ...mockData.aluno_disciplina[index],
      ativo: false,
    };
    console.log(`DELETE /api/enrollments/${req.params.id} - Deactivated`);
    res.status(204).send();
  } else {
    console.log(`DELETE /api/enrollments/${req.params.id} - Enrollment not found`);
    res.status(404).json({ error: 'Enrollment not found' });
  }
});

// Professor-Disciplina-Turma
app.get('/api/professor_disciplina_turma', (req, res) => {
  console.log('GET /api/professor_disciplina_turma - Returning:', mockData.professor_disciplina_turma);
  res.json(mockData.professor_disciplina_turma);
});

app.post('/api/professor_disciplina_turma', (req, res) => {
  const { professor_id, disciplina_id, turma_id, ano_letivo } = req.body;
  if (!professor_id || !disciplina_id || !turma_id || !ano_letivo) {
    console.log('POST /api/professor_disciplina_turma - Missing required fields:', req.body);
    return res
      .status(400)
      .json({
        error: 'professor_id, disciplina_id, turma_id, and ano_letivo are required',
      });
  }
  const professor = mockData.users.find(
    (u) => u.id === professor_id && u.tipo_utilizador === 'PROFESSOR'
  );
  const disciplina = mockData.subjects.find((s) => s.id === disciplina_id);
  const turma = mockData.classes.find((c) => c.id === turma_id);
  if (!professor) {
    console.log('POST /api/professor_disciplina_turma - Invalid professor_id:', professor_id);
    return res
      .status(400)
      .json({
        error: 'Invalid professor_id: Teacher not found or not a PROFESSOR',
      });
  }
  if (!disciplina) {
    console.log('POST /api/professor_disciplina_turma - Invalid disciplina_id:', disciplina_id);
    return res
      .status(400)
      .json({ error: 'Invalid disciplina_id: Subject not found' });
  }
  if (!turma) {
    console.log('POST /api/professor_disciplina_turma - Invalid turma_id:', turma_id);
    return res
      .status(400)
      .json({ error: 'Invalid turma_id: Class not found' });
  }
  const existingAssignment = mockData.professor_disciplina_turma.find(
    (pdt) =>
      pdt.professor_id === professor_id &&
      pdt.disciplina_id === disciplina_id &&
      pdt.turma_id === turma_id &&
      pdt.ano_letivo === ano_letivo &&
      pdt.ativo
  );
  if (existingAssignment) {
    console.log('POST /api/professor_disciplina_turma - Assignment already exists:', req.body);
    return res
      .status(400)
      .json({
        error:
          'Professor já está atribuído a esta disciplina e turma para o ano letivo',
      });
  }
  const newAssignment = {
    id: generateId(),
    professor_id,
    disciplina_id,
    turma_id,
    ano_letivo,
    ativo: true,
  };
  mockData.professor_disciplina_turma.push(newAssignment);
  console.log('POST /api/professor_disciplina_turma - Created:', newAssignment);
  res.status(201).json(newAssignment);
});

app.delete('/api/professor_disciplina_turma/:id', (req, res) => {
  const index = mockData.professor_disciplina_turma.findIndex(
    (pdt) => pdt.id === req.params.id
  );
  if (index !== -1) {
    mockData.professor_disciplina_turma[index] = {
      ...mockData.professor_disciplina_turma[index],
      ativo: false,
    };
    console.log(`DELETE /api/professor_disciplina_turma/${req.params.id} - Deactivated`);
    res.status(204).send();
  } else {
    console.log(`DELETE /api/professor_disciplina_turma/${req.params.id} - Assignment not found`);
    res.status(404).json({ error: 'Assignment not found' });
  }
});

// Disciplina-Turma
app.get('/api/disciplina_turma', (req, res) => {
  console.log('GET /api/disciplina_turma - Returning:', mockData.disciplina_turma);
  res.json(mockData.disciplina_turma);
});

app.post('/api/disciplina_turma', (req, res) => {
  const { disciplina_id, turma_id, ano_letivo } = req.body;
  if (!disciplina_id || !turma_id || !ano_letivo) {
    console.log('POST /api/disciplina_turma - Missing required fields:', req.body);
    return res
      .status(400)
      .json({ error: 'disciplina_id, turma_id, and ano_letivo are required' });
  }
  const disciplina = mockData.subjects.find((s) => s.id === disciplina_id);
  const turma = mockData.classes.find((c) => c.id === turma_id);
  if (!disciplina) {
    console.log('POST /api/disciplina_turma - Invalid disciplina_id:', disciplina_id);
    return res
      .status(400)
      .json({ error: 'Invalid disciplina_id: Subject not found' });
  }
  if (!turma) {
    console.log('POST /api/disciplina_turma - Invalid turma_id:', turma_id);
    return res
      .status(400)
      .json({ error: 'Invalid turma_id: Class not found' });
  }
  const existingDisciplinaTurma = mockData.disciplina_turma.find(
    (dt) =>
      dt.disciplina_id === disciplina_id &&
      dt.turma_id === turma_id &&
      dt.ano_letivo === ano_letivo &&
      dt.ativo
  );
  if (existingDisciplinaTurma) {
    console.log('POST /api/disciplina_turma - Assignment already exists:', req.body);
    return res
      .status(400)
      .json({
        error: 'Disciplina já está associada a esta turma para o ano letivo',
      });
  }
  const newDisciplinaTurma = {
    id: generateId(),
    disciplina_id,
    turma_id,
    ano_letivo,
    ativo: true,
    data_criacao: new Date().toISOString(),
  };
  mockData.disciplina_turma.push(newDisciplinaTurma);
  console.log('POST /api/disciplina_turma - Created:', newDisciplinaTurma);
  res.status(201).json(newDisciplinaTurma);
});

// Classes
app.get('/api/classes', (req, res) => {
  console.log('GET /api/classes - Returning:', mockData.classes);
  res.json(mockData.classes);
});

app.post('/api/classes', (req, res) => {
  const { nome, ciclo_id } = req.body;
  if (!nome || !ciclo_id) {
    console.log('POST /api/classes - Missing required fields:', req.body);
    return res.status(400).json({ error: 'nome and ciclo_id are required' });
  }
  const ciclo = mockData.ciclos_ensino.find((c) => c.id === ciclo_id);
  if (!ciclo) {
    console.log('POST /api/classes - Invalid ciclo_id:', ciclo_id);
    return res.status(400).json({ error: 'Invalid ciclo_id: Ciclo not found' });
  }
  const existingClass = mockData.classes.find((c) => c.nome === nome);
  if (existingClass) {
    console.log('POST /api/classes - Class already exists:', req.body);
    return res.status(400).json({ error: 'Nome da turma já está em uso' });
  }
  const newClass = {
    id: generateId(),
    nome,
    ciclo_id,
    ativo: true,
  };
  mockData.classes.push(newClass);
  console.log('POST /api/classes - Created:', newClass);
  res.status(201).json(newClass);
});

app.put('/api/classes/:id', (req, res) => {
  const index = mockData.classes.findIndex((c) => c.id === req.params.id);
  if (index !== -1) {
    const { nome, ciclo_id } = req.body;
    if (!nome || !ciclo_id) {
      console.log(`PUT /api/classes/${req.params.id} - Missing required fields:`, req.body);
      return res.status(400).json({ error: 'nome and ciclo_id are required' });
    }
    const ciclo = mockData.ciclos_ensino.find((c) => c.id === ciclo_id);
    if (!ciclo) {
      console.log(`PUT /api/classes/${req.params.id} - Invalid ciclo_id:`, ciclo_id);
      return res.status(400).json({ error: 'Invalid ciclo_id: Ciclo not found' });
    }
    const existingClass = mockData.classes.find(
      (c) => c.nome === nome && c.id !== req.params.id
    );
    if (existingClass) {
      console.log(`PUT /api/classes/${req.params.id} - Class already exists:`, req.body);
      return res.status(400).json({ error: 'Nome da turma já está em uso' });
    }
    mockData.classes[index] = {
      ...mockData.classes[index],
      nome,
      ciclo_id,
      ativo: req.body.ativo ?? mockData.classes[index].ativo,
    };
    console.log(`PUT /api/classes/${req.params.id} - Updated:`, mockData.classes[index]);
    res.json(mockData.classes[index]);
  } else {
    console.log(`PUT /api/classes/${req.params.id} - Class not found`);
    res.status(404).json({ error: 'Class not found' });
  }
});

app.delete('/api/classes/:id', (req, res) => {
  const index = mockData.classes.findIndex((c) => c.id === req.params.id);
  if (index !== -1) {
    mockData.classes.splice(index, 1);
    console.log(`DELETE /api/classes/${req.params.id} - Deleted`);
    res.status(204).send();
  } else {
    console.log(`DELETE /api/classes/${req.params.id} - Class not found`);
    res.status(404).json({ error: 'Class not found' });
  }
});

// Ciclos
app.get('/api/ciclos', (req, res) => {
  console.log('GET /api/ciclos - Returning:', mockData.ciclos_ensino);
  res.json(mockData.ciclos_ensino);
});

// Aluno-Turma
app.get('/api/aluno_turma', (req, res) => {
  console.log('GET /api/aluno_turma - Returning:', mockData.aluno_turma);
  res.json(mockData.aluno_turma);
});

app.post('/api/aluno_turma', (req, res) => {
  const { aluno_id, turma_id } = req.body;
  if (!aluno_id || !turma_id) {
    console.log('POST /api/aluno_turma - Missing required fields:', req.body);
    return res.status(400).json({ error: 'aluno_id and turma_id are required' });
  }
  const aluno = mockData.users.find(
    (u) => u.id === aluno_id && u.tipo_utilizador === 'ALUNO'
  );
  const turma = mockData.classes.find((c) => c.id === turma_id);
  if (!aluno) {
    console.log('POST /api/aluno_turma - Invalid aluno_id:', aluno_id);
    return res
      .status(400)
      .json({ error: 'Invalid aluno_id: Student not found or not an ALUNO' });
  }
  if (!turma) {
    console.log('POST /api/aluno_turma - Invalid turma_id:', turma_id);
    return res.status(400).json({ error: 'Invalid turma_id: Class not found' });
  }
  const existingEnrollment = mockData.aluno_turma.find(
    (at) => at.aluno_id === aluno_id && at.turma_id === turma_id && at.ativo
  );
  if (existingEnrollment) {
    console.log('POST /api/aluno_turma - Enrollment already exists:', req.body);
    return res
      .status(400)
      .json({ error: 'Aluno já está inscrito nesta turma' });
  }
  const newEnrollment = {
    id: generateId(),
    aluno_id,
    turma_id,
    ativo: true,
  };
  mockData.aluno_turma.push(newEnrollment);
  console.log('POST /api/aluno_turma - Created:', newEnrollment);
  res.status(201).json(newEnrollment);
});

app.put('/api/aluno_turma/:id', (req, res) => {
  const index = mockData.aluno_turma.findIndex((at) => at.id === req.params.id);
  if (index !== -1) {
    const { aluno_id, turma_id } = req.body;
    if (!aluno_id || !turma_id) {
      console.log(`PUT /api/aluno_turma/${req.params.id} - Missing required fields:`, req.body);
      return res
        .status(400)
        .json({ error: 'aluno_id and turma_id are required' });
    }
    const aluno = mockData.users.find(
      (u) => u.id === aluno_id && u.tipo_utilizador === 'ALUNO'
    );
    const turma = mockData.classes.find((c) => c.id === turma_id);
    if (!aluno) {
      console.log(`PUT /api/aluno_turma/${req.params.id} - Invalid aluno_id:`, aluno_id);
      return res
        .status(400)
        .json({ error: 'Invalid aluno_id: Student not found or not an ALUNO' });
    }
    if (!turma) {
      console.log(`PUT /api/aluno_turma/${req.params.id} - Invalid turma_id:`, turma_id);
      return res
        .status(400)
        .json({ error: 'Invalid turma_id: Class not found' });
    }
    const existingEnrollment = mockData.aluno_turma.find(
      (at) =>
        at.aluno_id === aluno_id &&
        at.turma_id === turma_id &&
        at.ativo &&
        at.id !== req.params.id
    );
    if (existingEnrollment) {
      console.log(`PUT /api/aluno_turma/${req.params.id} - Enrollment already exists:`, req.body);
      return res
        .status(400)
        .json({ error: 'Aluno já está inscrito nesta turma' });
    }
    mockData.aluno_turma[index] = {
      ...mockData.aluno_turma[index],
      aluno_id,
      turma_id,
      ativo: req.body.ativo ?? mockData.aluno_turma[index].ativo,
    };
    console.log(`PUT /api/aluno_turma/${req.params.id} - Updated:`, mockData.aluno_turma[index]);
    res.json(mockData.aluno_turma[index]);
  } else {
    console.log(`PUT /api/aluno_turma/${req.params.id} - Enrollment not found`);
    res.status(404).json({ error: 'Enrollment not found' });
  }
});

// Transaction Rules
app.get('/api/transactionRules', (req, res) => {
  console.log('GET /api/transactionRules - Returning:', mockData.transactionRules);
  res.json(mockData.transactionRules);
});

app.post('/api/transactionRules', (req, res) => {
  const { nome, criterio_id, montante, tipo_transacao } = req.body;
  if (!nome || !criterio_id || !montante || !tipo_transacao) {
    console.log('POST /api/transactionRules - Missing required fields:', req.body);
    return res
      .status(400)
      .json({
        error: 'nome, criterio_id, montante, and tipo_transacao are required',
      });
  }
  const criterio = mockData.criteria.find((c) => c.id === criterio_id);
  if (!criterio) {
    console.log('POST /api/transactionRules - Invalid criterio_id:', criterio_id);
    return res
      .status(400)
      .json({ error: 'Invalid criterio_id: Criterion not found' });
  }
  const validTransactionTypes = ['CREDITO', 'DEBITO'];
  if (!validTransactionTypes.includes(tipo_transacao)) {
    console.log('POST /api/transactionRules - Invalid tipo_transacao:', tipo_transacao);
    return res
      .status(400)
      .json({
        error:
          'tipo_transacao must be one of: ' + validTransactionTypes.join(', '),
      });
  }
  const newRule = {
    id: generateId(),
    nome,
    criterio_id,
    montante: parseFloat(montante),
    tipo_transacao,
    ativo: true,
  };
  mockData.transactionRules.push(newRule);
  console.log('POST /api/transactionRules - Created:', newRule);
  res.status(201).json(newRule);
});

app.put('/api/transactionRules/:id', (req, res) => {
  const index = mockData.transactionRules.findIndex(
    (tr) => tr.id === req.params.id
  );
  if (index !== -1) {
    const { nome, criterio_id, montante, tipo_transacao } = req.body;
    if (!nome || !criterio_id || !montante || !tipo_transacao) {
      console.log(`PUT /api/transactionRules/${req.params.id} - Missing required fields:`, req.body);
      return res
        .status(400)
        .json({
          error: 'nome, criterio_id, montante, and tipo_transacao are required',
        });
    }
    const criterio = mockData.criteria.find((c) => c.id === criterio_id);
    if (!criterio) {
      console.log(`PUT /api/transactionRules/${req.params.id} - Invalid criterio_id:`, criterio_id);
      return res
        .status(400)
        .json({ error: 'Invalid criterio_id: Criterion not found' });
    }
    const validTransactionTypes = ['CREDITO', 'DEBITO'];
    if (!validTransactionTypes.includes(tipo_transacao)) {
      console.log(`PUT /api/transactionRules/${req.params.id} - Invalid tipo_transacao:`, tipo_transacao);
      return res
        .status(400)
        .json({
          error:
            'tipo_transacao must be one of: ' + validTransactionTypes.join(', '),
        });
    }
    mockData.transactionRules[index] = {
      ...mockData.transactionRules[index],
      nome,
      criterio_id,
      montante: parseFloat(montante),
      tipo_transacao,
      ativo: req.body.ativo ?? mockData.transactionRules[index].ativo,
    };
    console.log(`PUT /api/transactionRules/${req.params.id} - Updated:`, mockData.transactionRules[index]);
    res.json(mockData.transactionRules[index]);
  } else {
    console.log(`PUT /api/transactionRules/${req.params.id} - Rule not found`);
    res.status(404).json({ error: 'Rule not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
