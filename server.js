const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

let mockData = {
  users: [
    {
      id: '1e4f2a3b-4c5d-6e7f-8a9b-0c1d2e3f4a5b',
      numero_mecanografico: '2024001',
      nome: 'João Silva',
      email: 'joao@valpacos.edu.pt',
      password_hash: '$2a$10$...hashedpassword...',
      tipo_utilizador: 'ALUNO',
      ativo: true,
      data_criacao: '2024-07-08T10:00:00Z',
      data_atualizacao: '2024-07-08T10:00:00Z',
      ultimo_login: null,
      consentimento_rgpd: true,
      data_consentimento_rgpd: '2024-07-08T10:00:00Z',
    },
    {
      id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
      numero_mecanografico: '2024002',
      nome: 'Maria Santos',
      email: 'maria@valpacos.edu.pt',
      password_hash: '$2a$10$...hashedpassword...',
      tipo_utilizador: 'PROFESSOR',
      ativo: true,
      data_criacao: '2024-07-08T10:00:00Z',
      data_atualizacao: '2024-07-08T10:00:00Z',
      ultimo_login: '2024-07-08T12:00:00Z',
      consentimento_rgpd: true,
      data_consentimento_rgpd: '2024-07-08T10:00:00Z',
    },
    {
      id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
      numero_mecanografico: '2024003',
      nome: 'Ana Costa',
      email: 'ana@valpacos.edu.pt',
      password_hash: '$2a$10$...hashedpassword...',
      tipo_utilizador: 'ALUNO',
      ativo: true,
      data_criacao: '2024-07-08T10:00:00Z',
      data_atualizacao: '2024-07-08T10:00:00Z',
      ultimo_login: null,
      consentimento_rgpd: true,
      data_consentimento_rgpd: '2024-07-08T10:00:00Z',
    },
    {
      id: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
      numero_mecanografico: '2024004',
      nome: 'Pedro Almeida',
      email: 'pedro@valpacos.edu.pt',
      password_hash: '$2a$10$...hashedpassword...',
      tipo_utilizador: 'ALUNO',
      ativo: true,
      data_criacao: '2024-07-10T10:00:00Z',
      data_atualizacao: '2024-07-10T10:00:00Z',
      ultimo_login: null,
      consentimento_rgpd: true,
      data_consentimento_rgpd: '2024-07-10T10:00:00Z',
    },
  ],
  transactions: [
    {
      id: 't1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c',
      utilizador_origem_id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
      utilizador_destino_id: '1e4f2a3b-4c5d-6e7f-8a9b-0c1d2e3f4a5b',
      montante: 100,
      tipo: 'CREDITO',
      descricao: 'Participação em aula',
      data_transacao: '2024-07-08T10:00:00Z',
      status: 'APROVADA'
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
      id: 'cr1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c',
      nome: 'Participação',
      valor: 50,
      ativo: true,
    },
  ],
  aluno_disciplina: [
    // Example entry
    {
      id: 'ad1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c',
      aluno_id: '1e4f2a3b-4c5d-6e7f-8a9b-0c1d2e3f4a5b', // João Silva
      disciplina_id: 's1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c', // Matemática
      ano_letivo: '2024/2025',
      ativo: true,
    },
  ],
  transactionRules: [
    {
      id: 'tr1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c',
      nome: 'Presença em Evento',
      tipo: 'CREDITO',
      valor: 10,
      ativo: true,
    },
  ],
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

// Helper function to generate unique ID
const generateId = () => {
  return String(Date.now() + Math.random());
};

// Helper function to create inverse transaction for double-entry accounting
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
    descricao: `[Contrapartida] ${originalTransaction.descricao}`
  };
};

// Helper function to validate transaction data
const validateTransaction = (transactionData) => {
  const errors = [];
  
  console.log('=== TRANSACTION VALIDATION DEBUG ===');
  console.log('Received transaction data:', JSON.stringify(transactionData, null, 2));
  console.log('Available users:', mockData.users.map(u => ({ 
    id: u.id, 
    idType: typeof u.id, 
    nome: u.nome, 
    ativo: u.ativo 
  })));
  
  if (!transactionData.utilizador_origem_id) {
    errors.push('Utilizador origem é obrigatório');
  }
  
  if (!transactionData.utilizador_destino_id) {
    errors.push('Utilizador destino é obrigatório');
  }
  
  if (transactionData.utilizador_origem_id === transactionData.utilizador_destino_id) {
    errors.push('Utilizador destino deve ser diferente do utilizador origem');
  }
  
  if (!transactionData.montante || isNaN(transactionData.montante) || parseFloat(transactionData.montante) <= 0) {
    errors.push('Montante é obrigatório e deve ser um número positivo');
  }
  
  if (!transactionData.descricao || transactionData.descricao.trim() === '') {
    errors.push('Descrição é obrigatória');
  }
  
  // Only validate users if IDs are provided
  if (transactionData.utilizador_origem_id && transactionData.utilizador_destino_id) {
    // Try multiple comparison strategies
    const origemUserId = transactionData.utilizador_origem_id;
    const destinoUserId = transactionData.utilizador_destino_id;
    
    console.log('Origem ID:', origemUserId, 'Type:', typeof origemUserId);
    console.log('Destino ID:', destinoUserId, 'Type:', typeof destinoUserId);
    
    // Try exact match first
    let origemUser = mockData.users.find(u => u.id === origemUserId);
    let destinoUser = mockData.users.find(u => u.id === destinoUserId);
    
    // If exact match fails, try string comparison
    if (!origemUser) {
      origemUser = mockData.users.find(u => String(u.id) === String(origemUserId));
    }
    
    if (!destinoUser) {
      destinoUser = mockData.users.find(u => String(u.id) === String(destinoUserId));
    }
    
    // If still not found, try trimming and string comparison
    if (!origemUser) {
      origemUser = mockData.users.find(u => String(u.id).trim() === String(origemUserId).trim());
    }
    
    if (!destinoUser) {
      destinoUser = mockData.users.find(u => String(u.id).trim() === String(destinoUserId).trim());
    }
    
    console.log('Found origem user:', origemUser ? { id: origemUser.id, nome: origemUser.nome } : 'NOT FOUND');
    console.log('Found destino user:', destinoUser ? { id: destinoUser.id, nome: destinoUser.nome } : 'NOT FOUND');
    
    if (!origemUser) {
      console.log('ORIGEM USER NOT FOUND - Available IDs:', mockData.users.map(u => `"${u.id}"`));
      errors.push('Utilizador origem não encontrado');
    }
    
    if (!destinoUser) {
      console.log('DESTINO USER NOT FOUND - Available IDs:', mockData.users.map(u => `"${u.id}"`));
      errors.push('Utilizador destino não encontrado');
    }
    
    // Additional validation: check if users are active
    if (origemUser && !origemUser.ativo) {
      errors.push('Utilizador origem não está ativo');
    }
    
    if (destinoUser && !destinoUser.ativo) {
      errors.push('Utilizador destino não está ativo');
    }
  }
  
  console.log('Validation errors:', errors);
  console.log('=== END VALIDATION DEBUG ===');
  
  return errors;
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
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/api/users', (req, res) => {
  const newUser = { id: generateId(), ...req.body };
  mockData.users.push(newUser);
  res.status(201).json(newUser);
});

app.put('/api/users/:id', (req, res) => {
  const index = mockData.users.findIndex(u => u.id === req.params.id);
  if (index !== -1) {
    mockData.users[index] = { ...mockData.users[index], ...req.body };
    res.json(mockData.users[index]);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.delete('/api/users/:id', (req, res) => {
  const index = mockData.users.findIndex(u => u.id === req.params.id);
  if (index !== -1) {
    mockData.users.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Transactions
app.get('/api/transactions', (req, res) => {
  // Filter out inverse transactions, so the frontend only sees the primary transaction
  const primaryTransactions = mockData.transactions.filter(t => t.descricao && !t.descricao.includes('[Contrapartida]'));
  const enrichedTransactions = enrichTransactions(primaryTransactions);
  res.json(enrichedTransactions);
});

app.get('/api/transactions/group/:groupId', (req, res) => {
  const groupTransactions = mockData.transactions.filter(t => t.transaction_group_id === req.params.groupId);
  if (groupTransactions.length > 0) {
    const enrichedTransactions = enrichTransactions(groupTransactions);
    res.json(enrichedTransactions);
  } else {
    res.status(404).json({ error: 'Transactions not found for this group' });
  }
});

app.get('/api/transactions/:id', (req, res) => {
  const transaction = mockData.transactions.find(t => t.id === req.params.id);
  if (transaction) {
    const enrichedTransaction = enrichTransactions([transaction])[0];
    res.json(enrichedTransaction);
  } else {
    res.status(404).json({ error: 'Transaction not found' });
  }
});

app.post('/api/transactions', (req, res) => {
  try {
    console.log('Received transaction data:', req.body);
    
    // Validate transaction data
    const validationErrors = validateTransaction(req.body);
    if (validationErrors.length > 0) {
      console.log('Validation errors:', validationErrors);
      return res.status(400).json({ error: validationErrors.join(', ') });
    }

    // Create the main transaction
    const transaction_group_id = generateId();
    const newTransaction = { 
      id: generateId(), 
      transaction_group_id,
      data_transacao: new Date().toISOString(),
      status: req.body.status || 'PENDENTE',
      ...req.body,
      montante: parseFloat(req.body.montante)
    };

    // Create the inverse transaction for double-entry accounting
    const inverseTransaction = createInverseTransaction(newTransaction);

    // Add both transactions to the data
    mockData.transactions.push(newTransaction);
    mockData.transactions.push(inverseTransaction);

    // Enrich transactions with user names
    const enrichedTransactions = enrichTransactions([newTransaction, inverseTransaction]);
    
    console.log('Created transactions:', enrichedTransactions);
    
    // Always return an array, even if something goes wrong
    if (!Array.isArray(enrichedTransactions)) {
      console.error('enrichedTransactions is not an array:', enrichedTransactions);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    // Return both transactions as expected by the frontend
    res.status(201).json(enrichedTransactions);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.put('/api/transactions/:id', (req, res) => {
  try {
    const index = mockData.transactions.findIndex(t => t.id === req.params.id);
    if (index !== -1) {
      // Validate updated transaction data
      const validationErrors = validateTransaction(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({ error: validationErrors.join(', ') });
      }

      // Get the group ID from the original transaction
      const { transaction_group_id } = mockData.transactions[index];

      // Update the primary transaction (the one with the matching ID)
      const updatedTransaction = { 
        ...mockData.transactions[index], 
        ...req.body, 
        montante: parseFloat(req.body.montante) 
      };
      mockData.transactions[index] = updatedTransaction;

      // Find, remove, and recreate the inverse transaction
      const inverseIndex = mockData.transactions.findIndex(t => t.transaction_group_id === transaction_group_id && t.id !== req.params.id);
      if (inverseIndex !== -1) {
        mockData.transactions.splice(inverseIndex, 1);
        const newInverseTransaction = createInverseTransaction(updatedTransaction);
        mockData.transactions.push(newInverseTransaction);
      }

      const enrichedTransaction = enrichTransactions([updatedTransaction])[0];
      res.json(enrichedTransaction);
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.delete('/api/transactions/:id', (req, res) => {
  try {
    const index = mockData.transactions.findIndex(t => t.id === req.params.id);
    if (index !== -1) {
      const transactionToDelete = mockData.transactions[index];
      const { transaction_group_id } = transactionToDelete;

      // Remove all transactions in the same group
      mockData.transactions = mockData.transactions.filter(t => t.transaction_group_id !== transaction_group_id);

      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Subjects
app.get('/api/subjects', (req, res) => {
  res.json(mockData.subjects);
});

app.post('/api/subjects', (req, res) => {
  const newSubject = { id: generateId(), ...req.body };
  mockData.subjects.push(newSubject);
  res.status(201).json(newSubject);
});

app.put('/api/subjects/:id', (req, res) => {
  const index = mockData.subjects.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    mockData.subjects[index] = { ...mockData.subjects[index], ...req.body };
    res.json(mockData.subjects[index]);
  } else {
    res.status(404).json({ error: 'Subject not found' });
  }
});

app.delete('/api/subjects/:id', (req, res) => {
  const index = mockData.subjects.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    mockData.subjects.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Subject not found' });
  }
});

// Classes
app.get('/api/classes', (req, res) => {
  res.json(mockData.classes);
});

app.post('/api/classes', (req, res) => {
  const newClass = { id: generateId(), ...req.body };
  mockData.classes.push(newClass);
  res.status(201).json(newClass);
});

app.put('/api/classes/:id', (req, res) => {
  const index = mockData.classes.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    mockData.classes[index] = { ...mockData.classes[index], ...req.body };
    res.json(mockData.classes[index]);
  } else {
    res.status(404).json({ error: 'Class not found' });
  }
});

app.delete('/api/classes/:id', (req, res) => {
  const index = mockData.classes.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    mockData.classes.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Class not found' });
  }
});

// Criteria
app.get('/api/criteria', (req, res) => {
  res.json(mockData.criteria);
});

app.post('/api/criteria', (req, res) => {
  const newCriteria = { id: generateId(), ...req.body };
  mockData.criteria.push(newCriteria);
  res.status(201).json(newCriteria);
});

app.put('/api/criteria/:id', (req, res) => {
  const index = mockData.criteria.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    mockData.criteria[index] = { ...mockData.criteria[index], ...req.body };
    res.json(mockData.criteria[index]);
  } else {
    res.status(404).json({ error: 'Criteria not found' });
  }
});

app.delete('/api/criteria/:id', (req, res) => {
  const index = mockData.criteria.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    mockData.criteria.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Criteria not found' });
  }
});

// Enroll
app.post('/api/enroll', (req, res) => {
  const newEnrollment = { id: generateId(), ...req.body };
  mockData.aluno_disciplina.push(newEnrollment);
  res.status(201).json(newEnrollment);
});

// Transaction Rules
app.get('/api/transaction-rules', (req, res) => {
  res.json(mockData.transactionRules);
});

app.post('/api/transaction-rules', (req, res) => {
  const newRule = { id: generateId(), ...req.body };
  mockData.transactionRules.push(newRule);
  res.status(201).json(newRule);
});

app.put('/api/transaction-rules/:id', (req, res) => {
  const index = mockData.transactionRules.findIndex(r => r.id === req.params.id);
  if (index !== -1) {
    mockData.transactionRules[index] = { ...mockData.transactionRules[index], ...req.body };
    res.json(mockData.transactionRules[index]);
  } else {
    res.status(404).json({ error: 'Transaction rule not found' });
  }
});

app.delete('/api/transaction-rules/:id', (req, res) => {
  const index = mockData.transactionRules.findIndex(r => r.id === req.params.id);
  if (index !== -1) {
    mockData.transactionRules.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Transaction rule not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});