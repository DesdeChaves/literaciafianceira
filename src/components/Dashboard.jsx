import React from 'react';
import { TrendingUp, Users, Coins, Wallet } from 'lucide-react';
import { dashboardStats } from '../data/mockData'; // Ensure correct import

const Dashboard = () => {
  // Add fallback in case dashboardStats is undefined
  const stats = dashboardStats || {
    totalUsers: 0,
    totalTransactions: 0,
    totalVC: 0,
    activeWallets: 0,
    pendingTransactions: 0,
    monthlyGrowth: 0,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">Total de Utilizadores</p>
            <p className="text-lg font-semibold">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
          <Coins className="w-8 h-8 text-green-600" />
          <div>
            <p className="text-sm text-gray-600">Total de Transações</p>
            <p className="text-lg font-semibold">{stats.totalTransactions}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
          <Wallet className="w-8 h-8 text-yellow-600" />
          <div>
            <p className="text-sm text-gray-600">Total de VC</p>
            <p className="text-lg font-semibold">{stats.totalVC}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
          <Users className="w-8 h-8 text-purple-600" />
          <div>
            <p className="text-sm text-gray-600">Carteiras Ativas</p>
            <p className="text-lg font-semibold">{stats.activeWallets}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
          <TrendingUp className="w-8 h-8 text-red-600" />
          <div>
            <p className="text-sm text-gray-600">Transações Pendentes</p>
            <p className="text-lg font-semibold">{stats.pendingTransactions}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
          <TrendingUp className="w-8 h-8 text-teal-600" />
          <div>
            <p className="text-sm text-gray-600">Crescimento Mensal</p>
            <p className="text-lg font-semibold">{stats.monthlyGrowth}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
