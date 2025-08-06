import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpDown, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import './ApproachTable.css';

interface ApproachTableProps {
  approaches: Array<{
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
  }>;
}

type SortField = 'code' | 'title' | 'objective' | 'implementation';
type SortDirection = 'asc' | 'desc' | null;

const ApproachTable: React.FC<ApproachTableProps> = ({ approaches }) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedApproaches = React.useMemo(() => {
    if (!sortField || !sortDirection) return approaches;

    return [...approaches].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue, 'fa');
      } else {
        return bValue.localeCompare(aValue, 'fa');
      }
    });
  }, [approaches, sortField, sortDirection]);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={14} />;
    if (sortDirection === 'asc') return <ArrowUp size={14} />;
    if (sortDirection === 'desc') return <ArrowDown size={14} />;
    return <ArrowUpDown size={14} />;
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleRowClick = (approachId: string) => {
    navigate(`/approaches/${approachId}`);
  };

  return (
    <div className="approach-table-container">
      <div className="table-wrapper">
        <table className="approach-table">
          <thead>
            <tr>
              <th 
                className="sortable"
                onClick={() => handleSort('code')}
              >
                <span>کد رویکرد</span>
                {getSortIcon('code')}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('title')}
              >
                <span>عنوان رویکرد</span>
                {getSortIcon('title')}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('objective')}
              >
                <span>هدف رویکرد</span>
                {getSortIcon('objective')}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('implementation')}
              >
                <span>جاری‌سازی</span>
                {getSortIcon('implementation')}
              </th>
              <th className="actions-column">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {sortedApproaches.map((approach) => (
              <tr 
                key={approach.id}
                className="table-row"
                onClick={() => handleRowClick(approach.id)}
              >
                <td className="code-cell">
                  <span className="code-badge">{approach.code}</span>
                </td>
                <td className="title-cell">
                  <div className="title-content">
                    <h4>{approach.title}</h4>
                  </div>
                </td>
                <td className="objective-cell">
                  <p title={approach.objective}>
                    {truncateText(approach.objective, 80)}
                  </p>
                </td>
                <td className="implementation-cell">
                  <p title={approach.implementation}>
                    {truncateText(approach.implementation, 80)}
                  </p>
                </td>
                <td className="actions-cell">
                  <button 
                    className="view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(approach.id);
                    }}
                    title="مشاهده جزئیات"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedApproaches.length === 0 && (
        <div className="empty-table">
          <p>هیچ رویکردی برای نمایش وجود ندارد</p>
        </div>
      )}
    </div>
  );
};

export default ApproachTable;
