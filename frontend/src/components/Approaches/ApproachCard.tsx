// src/components/Approaches/ApproachCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Approach {
  code: string;
  title: string;
  goal: string;
  implementation: string;
  strategies: string[];
  processes: string[];
  strategicObjectives: string[];
  indicators: string[];
  evident_documents: string;
}

interface Props {
  approach: Approach;
}

const ApproachCard: React.FC<Props> = ({ approach }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/approaches/${approach.code}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer border border-gray-200 flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">{approach.code}</span>
          <h3 className="text-center font-bold text-lg flex-grow mx-4">{approach.title}</h3>
        </div>
        <p className="text-gray-600 text-sm mb-3 text-center italic">"{approach.goal}"</p>
        <hr className="my-3" />
        <div>
          <p className="text-sm text-gray-800" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {approach.implementation}
          </p>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-700 mt-4 pt-2 border-t">
          <span>استراتژی‌ها: <strong>{approach.strategies.length}</strong></span>
          <span>فرایندها: <strong>{approach.processes.length}</strong></span>
          <span>اهداف راهبردی: <strong>{approach.strategicObjectives.length}</strong></span>
          <span>شاخص‌ها: <strong>{approach.indicators.length}</strong></span>
          <span className="col-span-2">مصادیق مستندات: <strong>{approach.evident_documents.length > 0 ? 1 : 0}</strong></span>
        </div>
        <p className="text-center text-xs text-blue-500 mt-4">جهت مشاهده کامل کلیک کنید</p>
      </div>
    </div>
  );
};

export default ApproachCard;
