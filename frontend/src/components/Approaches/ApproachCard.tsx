import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Settings, TrendingUp, BarChart3, FileText } from 'lucide-react';
import './ApproacheCard.css';

interface ApproachCardProps {
  approach: {
    id: string;
    code: string;
    title: string;
    objective: string;
    implementation: string;
    strategies: string[];
    processes: string[];
    strategic_objectives: string[];
    indicators_count: number;
    documents_count: number;
  };
  viewMode: 'list' | 'grid';
}

const ApproachCard: React.FC<ApproachCardProps> = ({ approach, viewMode }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/approaches/${approach.id}`);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div 
      className={`approach-card ${viewMode}`}
      onClick={handleCardClick}
    >
      {/* هدر کارت */}
      <div className="card-header">
        <h3 className="approach-title">{approach.title}</h3>
        <span className="approach-code">{approach.code}</span>
      </div>

      {/* هدف رویکرد */}
      <div className="approach-objective">
        <p>{approach.objective}</p>
      </div>

      <div className="card-divider"></div>

      {/* جاری‌سازی */}
      <div className="approach-implementation">
        <p>{truncateText(approach.implementation, viewMode === 'grid' ? 100 : 200)}</p>
      </div>

      {/* آمار و اطلاعات */}
      <div className="approach-stats">
        <div className="stat-item">
          <Target className="stat-icon" size={16} />
          <span>استراتژی‌ها: {approach.strategies.length}</span>
        </div>
        
        <div className="stat-item">
          <Settings className="stat-icon" size={16} />
          <span>فرایندها: {approach.processes.length}</span>
        </div>
        
        <div className="stat-item">
          <TrendingUp className="stat-icon" size={16} />
          <span>اهداف راهبردی: {approach.strategic_objectives.length}</span>
        </div>
        
        <div className="stat-item">
          <BarChart3 className="stat-icon" size={16} />
          <span>شاخص‌ها: {approach.indicators_count}</span>
        </div>
        
        <div className="stat-item">
          <FileText className="stat-icon" size={16} />
          <span>مستندات: {approach.documents_count}</span>
        </div>
      </div>

      {/* فوتر کارت */}
      <div className="card-footer">
        <span className="view-details">جهت مشاهده کامل کلیک کنید</span>
      </div>
    </div>
  );
};

export default ApproachCard;
