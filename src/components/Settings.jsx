import React from 'react';

const Settings = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold">Configurações do Sistema</h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Configurações Gerais</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sistema Ativo</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fase Piloto</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Limite de Acumulação (VC)</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue="100"
            />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Configurações Fiscais</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Taxa IRS (%)</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue="15"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Taxa IVA (%)</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue="5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Isenção 1º Ciclo</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Plafonds e Limites</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plafond Base Mensal (VC)</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue="1000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Taxa de Inatividade (%)</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue="2"
            />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Ações do Sistema</h3>
        <div className="space-y-3">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
            Gerar Relatório Mensal
          </button>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
            Exportar Dados
          </button>
          <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700">
            Backup Sistema
          </button>
          <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700">
            Limpar Cache
          </button>
        </div>
      </div>
    </div>
    <div className="flex justify-end">
      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
        Salvar Configurações
      </button>
    </div>
  </div>
);

export default Settings;
