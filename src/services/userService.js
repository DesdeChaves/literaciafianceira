import * as api from './api';

export const getUsers = async () => {
  try {
    const response = await api.getUsers();
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.createUser(userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.updateUser(id, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    await api.deleteUser(id);
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

