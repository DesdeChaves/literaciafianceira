const API_BASE_URL = 'http://localhost:3001/api';

export const createTransaction = async (transactionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao criar transação');
    }

    const result = await response.json();
    
    // Garantir que sempre retorna um array
    if (!Array.isArray(result)) {
      console.error('Expected array but got:', result);
      throw new Error('Resposta do servidor inválida');
    }
    
    return result;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

export const updateTransaction = async (id, transactionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao atualizar transação');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

export const deleteTransaction = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao excluir transação');
    }

    return true;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

export const getTransactions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    
    if (!response.ok) {
      console.error('Erro ao buscar transações');
      return [];
    }

    const result = await response.json();
    
    // Garantir que sempre retorna um array
    if (!Array.isArray(result)) {
      console.error('Expected array but got:', result);
      return [];
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const getTransaction = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao buscar transação');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
};

export const getTransactionGroup = async (groupId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/group/${groupId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao buscar grupo de transações');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching transaction group:', error);
    throw error;
  }
};

export const getTransactionsByUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/user/${userId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao buscar transações do usuário');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    throw error;
  }
};