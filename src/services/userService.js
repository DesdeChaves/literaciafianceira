import { mockData } from '../data/mockData';
import { v4 as uuidv4 } from 'uuid';

export const getUsers = async () => {
  console.log('getUsers called, returning:', mockData.users); // Debug
  return [...mockData.users]; // Return a copy to avoid mutation issues
};

export const createUser = async (userData) => {
  console.log('Creating user:', userData); // Debug
  const existingUser = mockData.users.find(
    (user) =>
      user.numero_mecanografico === userData.numero_mecanografico ||
      user.email === userData.email
  );
  if (existingUser) throw new Error('Número mecanográfico ou email já está em uso.');

  const newUser = {
    ...userData,
    id: uuidv4(),
    data_criacao: new Date().toISOString(),
    data_atualizacao: new Date().toISOString(),
    ultimo_login: null,
    consentimento_rgpd: true,
    data_consentimento_rgpd: new Date().toISOString(),
  };
  mockData.users = [...mockData.users, newUser];
  console.log('Updated mockData.users:', mockData.users); // Debug
  return newUser;
};

export const updateUser = async (id, userData) => {
  const index = mockData.users.findIndex((user) => user.id === id);
  if (index === -1) throw new Error('Utilizador não encontrado.');

  const existingUser = mockData.users.find(
    (user) =>
      (user.numero_mecanografico === userData.numero_mecanografico ||
        user.email === userData.email) &&
      user.id !== id
  );
  if (existingUser) throw new Error('Número mecanográfico ou email já está em uso.');

  const updatedUser = {
    ...mockData.users[index],
    ...userData,
    id,
    data_atualizacao: new Date().toISOString(),
  };
  mockData.users[index] = updatedUser;
  console.log('Updated mockData.users:', mockData.users); // Debug
  return updatedUser;
};

export const deleteUser = async (id) => {
  const index = mockData.users.findIndex((user) => user.id === id);
  if (index === -1) throw new Error('Utilizador não encontrado.');
  mockData.users.splice(index, 1);
  console.log('Updated mockData.users:', mockData.users); // Debug
};
