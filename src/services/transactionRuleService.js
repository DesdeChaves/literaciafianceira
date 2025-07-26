import { getTransactionRules as apiGetTransactionRules, createTransactionRule as apiCreateTransactionRule, updateTransactionRule as apiUpdateTransactionRule, deleteTransactionRule as apiDeleteTransactionRule } from './api';

export const getTransactionRules = async () => {
  try {
    const response = await apiGetTransactionRules();
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction rules:', error);
    throw error;
  }
};

export const createTransactionRule = async (rule) => {
  try {
    const response = await apiCreateTransactionRule(rule);
    return response.data;
  } catch (error) {
    console.error('Error creating transaction rule:', error);
    throw error;
  }
};

export const updateTransactionRule = async (id, rule) => {
  try {
    const response = await apiUpdateTransactionRule(id, rule);
    return response.data;
  } catch (error) {
    console.error('Error updating transaction rule:', error);
    throw error;
  }
};

export const deleteTransactionRule = async (id) => {
  try {
    const response = await apiDeleteTransactionRule(id);
    return response.data;
  } catch (error) {
    console.error('Error deleting transaction rule:', error);
    throw error;
  }
};
