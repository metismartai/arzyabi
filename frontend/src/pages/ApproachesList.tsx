// import React, { useState, useEffect, useMemo } from 'react';
// import { Search, Grid, List, Table, RefreshCw, Filter } from 'lucide-react';
// import FilterPanel from '../components/Approaches/FilterPanel';
// import ApproachCard from '../components/Approaches/ApproachCard';
// import ApproachTable from '../components/Approaches/ApproacheTable';
// import './ApproachesList.css';

// // انواع نمایش
// type ViewMode = 'list' | 'grid' | 'table';

// // نوع داده رویکرد
// interface Approach {
//   id: string;
//   code: string;
//   title: string;
//   objective: string;
//   implementation: string;
//   criterion_id: string;
//   sub_criterion_id: string;
//   strategies: string[];
//   processes: string[];
//   strategic_objectives: string[];
//   indicators_count: number;
//   documents_count: number;
// }

// // نوع فیلترها
// interface Filters {
//   id: number;
//   title: string;
//   description: string;
//   criteria: string[];
//   subCriteria: string[];
//   strategies: string[];
//   strategicObjectives: string[];
//   processes: string[];
// }

// const ApproachesList: React.FC = () => {
//   // State ها
//   const [approaches, setApproaches] = useState<Approach[]>([]);
//   const [filteredApproaches, setFilteredApproaches] = useState<Approach[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [viewMode, setViewMode] = useState<ViewMode>('grid');
//   const [filters, setFilters] = useState<Filters>({
//     criteria: [],
//     subCriteria: [],
//     strategies: [],
//     strategicObjectives: [],
//     processes: []
//   });
//   const [showFilters, setShowFilters] = useState(true);

//   // بارگذاری داده‌ها از API
//   useEffect(() => {
//     fetchApproaches();
//   }, []);

//   const fetchApproaches = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/approaches');
//       if (!response.ok) throw new Error('خطا در بارگذاری رویکردها');
//       const data = await response.json();
//       setApproaches(data);
//       setFilteredApproaches(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'خطای نامشخص');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // فیلتر کردن رویکردها
//   const filteredAndSearchedApproaches = useMemo(() => {
//     let result = [...approaches];

//     // اعمال فیلترها
//     if (filters.criteria.length > 0) {
//       result = result.filter(approach => 
//         filters.criteria.includes(approach.criterion_id)
//       );
//     }

//     if (filters.subCriteria.length > 0) {
//       result = result.filter(approach => 
//         filters.subCriteria.includes(approach.sub_criterion_id)
//       );
//     }

//     if (filters.strategies.length > 0) {
//       result = result.filter(approach => 
//         approach.strategies.some(strategy => filters.strategies.includes(strategy))
//       );
//     }

//     if (filters.strategicObjectives.length > 0) {
//       result = result.filter(approach => 
//         approach.strategic_objectives.some(obj => filters.strategicObjectives.includes(obj))
//       );
//     }

//     if (filters.processes.length > 0) {
//       result = result.filter(approach => 
//         approach.processes.some(process => filters.processes.includes(process))
//       );
//     }

//     // اعمال جستجو
//     if (searchTerm.trim()) {
//       const searchLower = searchTerm.toLowerCase();
//       result = result.filter(approach =>
//         approach.title.toLowerCase().includes(searchLower) ||
//         approach.objective.toLowerCase().includes(searchLower) ||
//         approach.implementation.toLowerCase().includes(searchLower) ||
//         approach.code.toLowerCase().includes(searchLower)
//       );
//     }

//     return result;
//   }, [approaches, filters, searchTerm]);

//   // حذف همه فیلترها
//   const clearAllFilters = () => {
//     setFilters({
//       criteria: [],
//       subCriteria: [],
//       strategies: [],
//       strategicObjectives: [],
//       processes: []
//     });
//     setSearchTerm('');
//   };

//   // رندر محتوای اصلی
//   const renderContent = () => {
//     if (loading) {
//       return (
//         <div className="loading-container">
//           <div className="loading-spinner"></div>
//           <p>در حال بارگذاری رویکردها...</p>
//         </div>
//       );
//     }

//     if (error) {
//       return (
//         <div className="error-container">
//           <p className="error-message">{error}</p>
//           <button onClick={fetchApproaches} className="retry-btn">
//             <RefreshCw size={16} />
//             تلاش مجدد
//           </button>
//         </div>
//       );
//     }

//     if (filteredAndSearchedApproaches.length === 0) {
//       return (
//         <div className="empty-state">
//           <p>هیچ رویکردی یافت نشد</p>
//           <button onClick={clearAllFilters} className="clear-filters-btn">
//             حذف فیلترها
//           </button>
//         </div>
//       );
//     }

//     // نمایش بر اساس حالت انتخابی
//     switch (viewMode) {
//       case 'table':
//         return <ApproachTable approaches={filteredAndSearchedApproaches} />;
//       case 'list':
//         return (
//           <div className="approaches-list-view">
//             {filteredAndSearchedApproaches.map(approach => (
//               <ApproachCard 
//                 key={approach.id} 
//                 approach={approach} 
//                 viewMode="list"
//               />
//             ))}
//           </div>
//         );
//       case 'grid':
//       default:
//         return (
//           <div className="approaches-grid-view">
//             {filteredAndSearchedApproaches.map(approach => (
//               <ApproachCard 
//                 key={approach.id} 
//                 approach={approach} 
//                 viewMode="grid"
//               />
//             ))}
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="approaches-page">
//       {/* سایدبار فیلتر */}
//       <div className={`filter-sidebar ${!showFilters ? 'hidden' : ''}`}>
//         <FilterPanel 
//           filters={filters}
//           onFiltersChange={setFilters}
//           approaches={approaches}
//         />
//       </div>

//       {/* محتوای اصلی */}
//       <div className={`main-content ${!showFilters ? 'full-width' : ''}`}>
//         {/* هدر صفحه */}
//         <div className="page-header">
//           <h1>مدیریت رویکردها</h1>
          
//           {/* نوار ابزار */}
//           <div className="toolbar">
//             {/* دکمه نمایش/پنهان کردن فیلتر */}
//             <button 
//               className="filter-toggle-btn"
//               onClick={() => setShowFilters(!showFilters)}
//             >
//               <Filter size={16} />
//               {showFilters ? 'پنهان کردن فیلتر' : 'نمایش فیلتر'}
//             </button>

//             {/* جستجو */}
//             <div className="search-container">
//               <Search className="search-icon" size={16} />
//               <input
//                 type="text"
//                 placeholder="جستجو در رویکردها..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="search-input"
//               />
//             </div>

//             {/* تعداد نتایج */}
//             <div className="results-count">
//               {filteredAndSearchedApproaches.length} از {approaches.length} رویکرد
//             </div>

//             {/* حالت‌های نمایش */}
//             <div className="view-modes">
//               <button
//                 className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
//                 onClick={() => setViewMode('list')}
//                 title="نمایش لیستی"
//               >
//                 <List size={16} />
//               </button>
//               <button
//                 className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
//                 onClick={() => setViewMode('grid')}
//                 title="نمایش شبکه‌ای"
//               >
//                 <Grid size={16} />
//               </button>
//               <button
//                 className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
//                 onClick={() => setViewMode('table')}
//                 title="نمایش جدولی"
//               >
//                 <Table size={16} />
//               </button>
//             </div>

//             {/* دکمه نمایش همه */}
//             <button 
//               className="show-all-btn"
//               onClick={clearAllFilters}
//             >
//               <RefreshCw size={16} />
//               کل رویکردها
//             </button>
//           </div>
//         </div>

//         {/* محتوای رویکردها */}
//         <div className="approaches-content">
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApproachesList;



// src/components/ApproachesList.tsx
import React, { useState, useEffect, useMemo } from 'react';
import type { ApproachData, ApiResponse, FilterState } from '../types/interfaces';

interface ApproachesListProps {
  filters?: FilterState;
}

const ApproachesList: React.FC<ApproachesListProps> = ({ filters = {} }) => {
  const [approaches, setApproaches] = useState<ApproachData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const fetchApproaches = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:5000/api/approache');
        
        if (!response.ok) {
          throw new Error(`خطا در دریافت داده‌ها: ${response.status}`);
        }
        
        const apiData: ApiResponse = await response.json();
        
        if (apiData.success && Array.isArray(apiData.data)) {
          setApproaches(apiData.data);
          setTotalRecords(apiData.totalRecords);
        } else {
          throw new Error('ساختار داده‌های دریافتی نامعتبر است');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'خطا در بارگذاری رویکردها';
        setError(errorMessage);
        setApproaches([]);
        console.error('خطا در بارگذاری رویکردها:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApproaches();
  }, []);

  const filteredApproaches = useMemo(() => {
    if (!Array.isArray(approaches)) return [];

    return approaches.filter((approach) => {
      // فیلتر معیار
      if (filters.معیار && approach["معیار"] !== filters.معیار) {
        return false;
      }
      
      // فیلتر زیرمعیار
      if (filters.زیرمعیار && approach["زیرمعیار"] !== filters.زیرمعیار) {
        return false;
      }
      
      // فیلتر اهداف راهبردی
      if (filters.اهدافراهبردی && 
          !approach["اهداف راهبردی مرتبط"].includes(filters.اهدافراهبردی)) {
        return false;
      }
      
      // جستجوی متنی
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const searchFields = [
          approach["عنوان رویکرد"],
          approach["هدف رویکرد"],
          approach["کد رویکرد"]
        ];
        
        if (!searchFields.some(field => 
          field.toLowerCase().includes(searchLower)
        )) {
          return false;
        }
      }
      
      return true;
    });
  }, [approaches, filters]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>در حال بارگذاری رویکردها...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>خطا در بارگذاری داده‌ها</h3>
        <p>{error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="approaches-container">
      <div className="approaches-header">
        <h2>لیست رویکردها</h2>
        <div className="approaches-stats">
          <span className="stat-item">تعداد کل: {totalRecords}</span>
          <span className="stat-item">نمایش: {filteredApproaches.length}</span>
        </div>
      </div>

      {filteredApproaches.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>هیچ رویکردی یافت نشد</h3>
          <p>لطفاً فیلترهای خود را تغییر دهید یا جستجوی جدیدی انجام دهید</p>
        </div>
      ) : (
        <div className="approaches-grid">
          {filteredApproaches.map((approach, index) => (
            <ApproachCard 
              key={`${approach["کد رویکرد"]}-${index}`} 
              approach={approach} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

// کامپوننت کارت رویکرد
interface ApproachCardProps {
  approach: ApproachData;
}

const ApproachCard: React.FC<ApproachCardProps> = ({ approach }) => {
  const [expanded, setExpanded] = useState(false);

  const parseListItems = (text: string): string[] => {
    if (!text || typeof text !== 'string') return [];
    return text.split('|').map(item => item.trim()).filter(item => item.length > 0);
  };

  const truncateText = (text: string, maxLength: number = 150): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="approach-card">
      <div className="card-header">
        <div className="approach-code">{approach["کد رویکرد"]}</div>
        <h3 className="approach-title">{approach["عنوان رویکرد"]}</h3>
      </div>
      
      <div className="card-content">
        <div className="approach-meta">
          <div className="meta-item">
            <span className="meta-label">معیار:</span>
            <span className="meta-value">{approach["معیار"]}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">زیرمعیار:</span>
            <span className="meta-value">{approach["زیرمعیار"]}</span>
          </div>
        </div>
        
        <div className="approach-goal">
          <span className="section-title">هدف رویکرد:</span>
          <p className="goal-text">
            {expanded ? approach["هدف رویکرد"] : truncateText(approach["هدف رویکرد"])}
          </p>
        </div>

        {expanded && (
          <div className="expanded-content">
            {approach["مصادیق مستندات"] && (
              <div className="detail-section">
                <span className="section-title">مصادیق مستندات:</span>
                <ul className="detail-list">
                  {parseListItems(approach["مصادیق مستندات"]).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {approach["فرایندهای مرتبط"] && (
              <div className="detail-section">
                <span className="section-title">فرایندهای مرتبط:</span>
                <ul className="detail-list">
                  {parseListItems(approach["فرایندهای مرتبط"]).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {approach["اهداف و استراتژی های مرتبط"] && (
              <div className="detail-section">
                <span className="section-title">اهداف و استراتژی‌های مرتبط:</span>
                <ul className="detail-list">
                  {parseListItems(approach["اهداف و استراتژی های مرتبط"]).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {approach["اهداف راهبردی مرتبط"] && (
              <div className="detail-section">
                <span className="section-title">اهداف راهبردی مرتبط:</span>
                <ul className="detail-list">
                  {parseListItems(approach["اهداف راهبردی مرتبط"]).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {approach["شاخص‌های مرتبط از بانک شاخص‌ها"] && (
              <div className="detail-section">
                <span className="section-title">شاخص‌های مرتبط:</span>
                <ul className="detail-list">
                  {parseListItems(approach["شاخص‌های مرتبط از بانک شاخص‌ها"]).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {approach["شرح جاری سازی"] && (
              <div className="detail-section">
                <span className="section-title">شرح جاری‌سازی:</span>
                <p className="detail-text">{approach["شرح جاری سازی"]}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card-footer">
        <button 
          className="expand-btn"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? 'نمایش کمتر' : 'نمایش بیشتر'}
        >
          {expanded ? (
            <>
              <span>نمایش کمتر</span>
              <span className="btn-icon">▲</span>
            </>
          ) : (
            <>
              <span>نمایش بیشتر</span>
              <span className="btn-icon">▼</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ApproachesList;
