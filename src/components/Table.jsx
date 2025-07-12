import React from 'react';
import { Eye, Edit, Trash } from 'lucide-react';

const Table = ({ data, columns, openModal, additionalActions }) => {
  console.log('Table component received data:', data); // Debug

  if (!data || data.length === 0) {
    return <p className="text-gray-500">Nenhum dado disponível.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-100">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render ? column.render(item[column.key], item) : item[column.key]}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => openModal('view', item)}
                  className="text-blue-600 hover:text-blue-800 mr-4"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => openModal('edit', item)}
                  className="text-yellow-600 hover:text-yellow-800 mr-4"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => openModal('delete', item)}
                  className="text-red-600 hover:text-red-800 mr-4"
                >
                  <Trash className="w-5 h-5" />
                </button>
                {additionalActions && additionalActions(item)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
