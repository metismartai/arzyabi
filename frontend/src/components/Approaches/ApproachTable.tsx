// src/components/Approaches/ApproachTable.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Approach {
  code: string;
  title: string;
  goal: string;
  implementation: string;
}

interface Props {
  approaches: Approach[];
}

const ApproachTable: React.FC<Props> = ({ approaches }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کد رویکرد</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عنوان رویکرد</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">هدف رویکرد</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">جاری‌سازی</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {approaches.map((approach) => (
            <tr key={approach.code} onClick={() => navigate(`/approaches/${approach.code}`)} className="hover:bg-gray-50 cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{approach.code}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{approach.title}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{approach.goal}</td>
              <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{approach.implementation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApproachTable;
