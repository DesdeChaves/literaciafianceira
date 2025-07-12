import { mockData } from '../data/mockData';
import { v4 as uuidv4 } from 'uuid';

export const getTransactions = async () => {
  return mockData.transactions; // Replace with: await axios.get('/api/transactions');
};

export const createTransaction = async (transactionData) => {
  const newTransaction = {
    ...transactionData,
    id: uuidv4(),
    date: new Date().toISOString(),
  };
  mockData.transactions.push(newTransaction); // Replace with: await axios.post('/api/transactions', transactionData);
  return newTransaction;
};

export const updateTransaction = async (id, transactionData) => {
  const index = mockData.transactions.findIndex((txn) => txn.id === id);
  if (index === -1) throw new Error('Transaction not found');
  const updatedTransaction = { ...transactionData, id };
  mockData.transactions[index] = updatedTransaction; // Replace with: await axios.put(`/api/transactions/${id}`, transactionData);
  return updatedTransaction;
};

export const deleteTransaction = async (id) => {
  const index = mockData.transactions.findIndex((txn) => txn.id === id);
  if (index === -1) throw new Error('Transaction not found');
  mockData.transactions.splice(index, 1); // Replace with: await axios.delete(`/api/transactions/${id}`);
};
