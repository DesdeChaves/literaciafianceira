const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

let mockData = {
  users: [
    { id: '1', numero_mecanografico: '2024001', nome: 'João Silva', email: 'joao@valpacos.edu.pt', tipo_utilizador: 'ALUNO', ativo: true, turma_id: '1', turma: '7A', saldo_vc: 45.50 },
    { id: '2', numero_mecanografico: '2024002', nome: 'Maria Santos', email: 'maria@valpacos.edu.pt', tipo_utilizador: 'PROFESSOR', ativo: true, departamento: 'Matemática', plafond_mensal: 200 },
    { id: '3', numero_mecanografico: '2024003', nome: 'Pedro Costa', email: 'pedro@valpacos.edu.pt', tipo_utilizador: 'ALUNO', ativo: true, turma_id: '2', turma: '8B', saldo_vc: 23.75 },
    { id: '4', numero_mecanografico: '2024004', nome: 'Ana Ferreira', email: 'ana@valpacos.edu.pt', tipo_utilizador: 'DIRETOR_TURMA', ativo: true, turma_id: '3', turma: '9C', departamento: 'Português' }
  ],
  transactions: [
    { 
      id: '1', 
      utilizador_origem_id: '2', 
      utilizador_destino_id: '1', 
      montante: 10.0, 
      tipo: 'CREDITO', 
      status: 'APROVADA', 
      data_transacao: '2024-07-08T10:30:00Z', 
      descricao: 'Participação exemplar na aula de matemática' 
    },
    { 
      id: '2', 
      utilizador_origem_id: '1', 
      utilizador_destino_id: '3', 
      montante: 5.0, 
      tipo: 'DEBITO', 
      status: 'PENDENTE', 
      data_transacao: '2024-07-08T14:15:00Z', 
      descricao: 'Serviço de impressão' 
    },
    { 
      id: '3', 
      utilizador_origem_id: '4', 
      utilizador_destino_id: '1', 
      montante: 15.0, 
      tipo: 'CREDITO', 
      status: 'APROVADA', 
      data_transacao: '2024-07-07T16:45:00Z', 
      descricao: 'Tutoria de matemática para colegas' 
    },
    { 
      id: '4', 
      utilizador_origem_id: '3', 
      utilizador_destino_id: '2', 
      montante: 8.0, 
      tipo: 'DEBITO', 
      status: 'APROVADA', 
      data_transacao: '2024-07-09T09:20:00Z', 
      descricao: 'Material escolar' 
    }
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
};

// Helper function to get user name by ID
const getUserNameById = (userId) => {
  const user = mockData.users.find(u => u.id === userId);
  return user ? user.nome : 'Utilizador não encontrado';
};

// Helper function to enrich transactions with user names
const enrichTransactions = (transactions) => {
  return transactions.map(transaction => ({
    ...transaction,
    utilizador_origem_nome: getUserNameById(transaction.utilizador_origem_id),
    utilizador_destino_nome: getUserNameById(transaction.utilizador_destino_id)
  }));
};

// Users
app.get('/api/users', (req, res) => {
  res.json(mockData.users);
});

app.get('/api/users/:id', (req, res) => {
  const user = mockData.users.find(u => u.id === req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

app.post('/api/users', (req, res) => {
  const newUser = { id: String(mockData.users.length + 1), ...req.body };
  mockData.users.push(newUser);
  res.status(201).json(newUser);
});

app.put('/api/users/:id', (req, res) => {
  const index = mockData.users.findIndex(u => u.id === req.params.id);
  if (index !== -1) {
    mockData.users[index] = { ...mockData.users[index], ...req.body };
    res.json(mockData.users[index]);
  } else {
    res.status(404).send('User not found');
  }
});

app.delete('/api/users/:id', (req, res) => {
  const index = mockData.users.findIndex(u => u.id === req.params.id);
  if (index !== -1) {
    mockData.users.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('User not found');
  }
});

// Transactions
app.get('/api/transactions', (req, res) => {
  const enrichedTransactions = enrichTransactions(mockData.transactions);
  res.json(enrichedTransactions);
});

app.get('/api/transactions/:id', (req, res) => {
  const transaction = mockData.transactions.find(t => t.id === req.params.id);
  if (transaction) {
    const enrichedTransaction = enrichTransactions([transaction])[0];
    res.json(enrichedTransaction);
  } else {
    res.status(404).send('Transaction not found');
  }
});

app.post('/api/transactions', (req, res) => {
  const newTransaction = { 
    id: String(mockData.transactions.length + 1), 
    data_transacao: new Date().toISOString(),
    status: 'PENDENTE',
    ...req.body 
  };
  mockData.transactions.push(newTransaction);
  const enrichedTransaction = enrichTransactions([newTransaction])[0];
  res.status(201).json(enrichedTransaction);
});

app.put('/api/transactions/:id', (req, res) => {
  const index = mockData.transactions.findIndex(t => t.id === req.params.id);
  if (index !== -1) {
    mockData.transactions[index] = { ...mockData.transactions[index], ...req.body };
    const enrichedTransaction = enrichTransactions([mockData.transactions[index]])[0];
    res.json(enrichedTransaction);
  } else {
    res.status(404).send('Transaction not found');
  }
});

app.delete('/api/transactions/:id', (req, res) => {
  const index = mockData.transactions.findIndex(t => t.id === req.params.id);
  if (index !== -1) {
    mockData.transactions.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Transaction not found');
  }
});

// Subjects
app.get('/api/subjects', (req, res) => {
  res.json(mockData.subjects);
});

app.post('/api/subjects', (req, res) => {
  const newSubject = { id: String(mockData.subjects.length + 1), ...req.body };
  mockData.subjects.push(newSubject);
  res.status(201).json(newSubject);
});

app.put('/api/subjects/:id', (req, res) => {
  const index = mockData.subjects.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    mockData.subjects[index] = { ...mockData.subjects[index], ...req.body };
    res.json(mockData.subjects[index]);
  } else {
    res.status(404).send('Subject not found');
  }
});

app.delete('/api/subjects/:id', (req, res) => {
  const index = mockData.subjects.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    mockData.subjects.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Subject not found');
  }
});

// Classes
app.get('/api/classes', (req, res) => {
  res.json(mockData.classes);
});

app.post('/api/classes', (req, res) => {
  const newClass = { id: String(mockData.classes.length + 1), ...req.body };
  mockData.classes.push(newClass);
  res.status(201).json(newClass);
});

app.put('/api/classes/:id', (req, res) => {
  const index = mockData.classes.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    mockData.classes[index] = { ...mockData.classes[index], ...req.body };
    res.json(mockData.classes[index]);
  } else {
    res.status(404).send('Class not found');
  }
});

app.delete('/api/classes/:id', (req, res) => {
  const index = mockData.classes.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    mockData.classes.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Class not found');
  }
});

// Criteria
app.get('/api/criteria', (req, res) => {
  res.json(mockData.criteria);
});

app.post('/api/criteria', (req, res) => {
  const newCriteria = { id: String(mockData.criteria.length + 1), ...req.body };
  mockData.criteria.push(newCriteria);
  res.status(201).json(newCriteria);
});

app.put('/api/criteria/:id', (req, res) => {
  const index = mockData.criteria.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    mockData.criteria[index] = { ...mockData.criteria[index], ...req.body };
    res.json(mockData.criteria[index]);
  } else {
    res.status(404).send('Criteria not found');
  }
});

app.delete('/api/criteria/:id', (req, res) => {
  const index = mockData.criteria.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    mockData.criteria.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Criteria not found');
  }
});

// Enroll
app.post('/api/enroll', (req, res) => {
  const newEnrollment = { id: String(mockData.aluno_disciplina.length + 1), ...req.body };
  mockData.aluno_disciplina.push(newEnrollment);
  res.status(201).json(newEnrollment);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
