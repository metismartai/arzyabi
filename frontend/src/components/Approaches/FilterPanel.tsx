// import React, { useState, useEffect } from 'react';
// import { X, ChevronDown, ChevronUp } from 'lucide-react';
// import './FilterPanel.css';

// interface FilterPanelProps {
//   filters: {
//     criteria: string[];
//     subCriteria: string[];
//     strategies: string[];
//     strategicObjectives: string[];
//     processes: string[];
//   };
//   onFiltersChange: (filters: any) => void;
//   approaches: any[];
// }

// interface FilterOption {
//   id: string;
//   name: string;
//   count: number;
// }

// const FilterPanel: React.FC<FilterPanelProps> = ({
//   filters,
//   onFiltersChange,
//   approaches
// }) => {
//   // State برای گزینه‌های فیلتر
//   const [criteriaOptions, setCriteriaOptions] = useState<FilterOption[]>([]);
//   const [subCriteriaOptions, setSubCriteriaOptions] = useState<FilterOption[]>([]);
//   const [strategiesOptions, setStrategiesOptions] = useState<FilterOption[]>([]);
//   const [objectivesOptions, setObjectivesOptions] = useState<FilterOption[]>([]);
//   const [processesOptions, setProcessesOptions] = useState<FilterOption[]>([]);

//   // State برای باز/بسته بودن بخش‌ها
//   const [expandedSections, setExpandedSections] = useState({
//     criteria: true,
//     subCriteria: true,
//     strategies: true,
//     objectives: true,
//     processes: true
//   });

//   // بارگذاری گزینه‌های فیلتر از API
//   useEffect(() => {
//     fetchFilterOptions();
//   }, []);

//   // به‌روزرسانی گزینه‌های فیلتر بر اساس فیلترهای فعال
//   useEffect(() => {
//     updateFilterOptions();
//   }, [filters, approaches]);

//   const fetchFilterOptions = async () => {
//     try {
//       // بارگذاری معیارها
//       const criteriaRes = await fetch('/api/criteria');
//       const criteria = await criteriaRes.json();
//       setCriteriaOptions(criteria.map((c: any) => ({
//         id: c.id,
//         name: c.name,
//         count: 0
//       })));

//       // بارگذاری سایر گزینه‌ها...
//       // (کد مشابه برای سایر فیلترها)
      
//     } catch (error) {
//       console.error('خطا در بارگذاری گزینه‌های فیلتر:', error);
//     }
//   };

//   const updateFilterOptions = () => {
//     // به‌روزرسانی تعداد هر گزینه بر اساس رویکردهای فیلتر شده
//     // پیاده‌سازی منطق AND برای فیلترها
//   };

//   const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
//     const newFilters = { ...filters };
    
//     if (checked) {
//       newFilters[filterType as keyof typeof filters].push(value);
//     } else {
//       newFilters[filterType as keyof typeof filters] = 
//         newFilters[filterType as keyof typeof filters].filter((item: string) => item !== value);
//     }
    
//     onFiltersChange(newFilters);
//   };

//   const clearAllFilters = () => {
//     onFiltersChange({
//       criteria: [],
//       subCriteria: [],
//       strategies: [],
//       strategicObjectives: [],
//       processes: []
//     });
//   };

//   const toggleSection = (section: string) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [section]: !prev[section as keyof typeof prev]
//     }));
//   };

//   const renderFilterSection = (
//     title: string,
//     filterType: string,
//     options: FilterOption[],
//     selectedValues: string[]
//   ) => {
//     const isExpanded = expandedSections[filterType as keyof typeof expandedSections];
    
//     return (
//       <div className="filter-section">
//         <div 
//           className="filter-section-header"
//           onClick={() => toggleSection(filterType)}
//         >
//           <h4>{title}</h4>
//           {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//         </div>
        
//         {isExpanded && (
//           <div className="filter-options">
//             {options.map(option => (
//               <label key={option.id} className="filter-option">
//                 <input
//                   type="checkbox"
//                   checked={selectedValues.includes(option.id)}
//                   onChange={(e) => handleFilterChange(filterType, option.id, e.target.checked)}
//                   disabled={option.count === 0}
//                 />
//                 <span className="checkmark"></span>
//                 <span className="option-text">
//                   {option.name}
//                   <span className="option-count">({option.count})</span>
//                 </span>
//               </label>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="filter-panel">
//       <div className="filter-header">
//         <h3>فیلتر رویکردها</h3>
//         <button 
//           className="clear-filters-btn"
//           onClick={clearAllFilters}
//           title="حذف همه فیلترها"
//         >
//           <X size={16} />
//           حذف فیلتر
//         </button>
//       </div>

//       <div className="filter-content">
//         {renderFilterSection('معیار', 'criteria', criteriaOptions, filters.criteria)}
//         {renderFilterSection('زیرمعیار', 'subCriteria', subCriteriaOptions, filters.subCriteria)}
//         {renderFilterSection('استراتژی', 'strategies', strategiesOptions, filters.strategies)}
//         {renderFilterSection('اهداف راهبردی', 'strategicObjectives', objectivesOptions, filters.strategicObjectives)}
//         {renderFilterSection('فرایند', 'processes', processesOptions, filters.processes)}
//       </div>
//     </div>
//   );
// };

// export default FilterPanel;


// src/components/FilterPanel.tsx
import React, { useState, useEffect } from 'react';
import type { ApproachData, ApiResponse, FilterOptions, FilterState } from '../types/interfaces';

interface FilterPanelProps {
  onFiltersChange: (filters: FilterState) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFiltersChange }) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    معیارها: [],
    زیرمعیارها: [],
    اهدافراهبردی: [],
    شاخصها: []
  });
  
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    معیار: '',
    زیرمعیار: '',
    اهدافراهبردی: '',
    searchTerm: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:5000/api/approache');
        
        if (!response.ok) {
          throw new Error(`خطا در دریافت داده‌ها: ${response.status}`);
        }
        
        const apiData: ApiResponse = await response.json();
        
        if (apiData.success && Array.isArray(apiData.data)) {
          const approaches = apiData.data;
          
          // استخراج گزینه‌های فیلتر از داده‌ها
          const معیارها = [...new Set(approaches.map(item => item["معیار"]))].filter(Boolean);
          const زیرمعیارها = [...new Set(approaches.map(item => item["زیرمعیار"]))].filter(Boolean);
          
          // استخراج اهداف راهبردی (با تقسیم بر اساس |)
          const اهدافراهبردی = [...new Set(
            approaches.flatMap(item => {
              if (!item["اهداف راهبردی مرتبط"]) return [];
              return item["اهداف راهبردی مرتبط"]
                .split('|')
                .map(goal => goal.trim())
                .filter(goal => goal.length > 0);
            })
          )];
          
          // استخراج شاخص‌ها
          const شاخصها = [...new Set(
            approaches.flatMap(item => {
              if (!item["شاخص‌های مرتبط از بانک شاخص‌ها"]) return [];
              return item["شاخص‌های مرتبط از بانک شاخص‌ها"]
                .split('|')
                .map(indicator => indicator.trim())
                .filter(indicator => indicator.length > 0);
            })
          )];

          setFilterOptions({
            معیارها: معیارها.sort(),
            زیرمعیارها: زیرمعیارها.sort(),
            اهدافراهبردی: اهدافراهبردی.sort(),
            شاخصها: شاخصها.sort()
          });
        } else {
          throw new Error('ساختار داده‌های دریافتی نامعتبر است');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'خطا در بارگذاری گزینه‌های فیلتر';
        setError(errorMessage);
        console.error('خطا در بارگذاری فیلترها:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    const newFilters = { ...selectedFilters, [filterType]: value };
    setSelectedFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      معیار: '',
      زیرمعیار: '',
      اهدافراهبردی: '',
      searchTerm: ''
    };
    setSelectedFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  if (loading) {
    return (
      <div className="filter-panel loading">
        <h3>فیلترها</h3>
        <div className="loading-spinner small"></div>
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="filter-panel error">
        <h3>فیلترها</h3>
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>فیلترها و جستجو</h3>
        <button 
          className="clear-filters-btn" 
          onClick={clearFilters}
          disabled={!Object.values(selectedFilters).some(value => value)}
        >
          پاک کردن همه
        </button>
      </div>

      <div className="filter-section">
        <label htmlFor="search" className="filter-label">
          <span className="label-icon">🔍</span>
          جستجو:
        </label>
        <input
          type="text"
          id="search"
          className="filter-input"
          placeholder="جستجو در عنوان، هدف یا کد رویکرد..."
          value={selectedFilters.searchTerm || ''}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
        />
      </div>

      <div className="filter-section">
        <label htmlFor="معیار" className="filter-label">
          <span className="label-icon">📋</span>
          معیار:
        </label>
        <select
          id="معیار"
          className="filter-select"
          value={selectedFilters.معیار || ''}
          onChange={(e) => handleFilterChange('معیار', e.target.value)}
        >
          <option value="">همه معیارها ({filterOptions.معیارها.length})</option>
          {filterOptions.معیارها.map((معیار) => (
            <option key={معیار} value={معیار}>
              {معیار}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label htmlFor="زیرمعیار" className="filter-label">
          <span className="label-icon">📝</span>
          زیرمعیار:
        </label>
        <select
          id="زیرمعیار"
          className="filter-select"
          value={selectedFilters.زیرمعیار || ''}
          onChange={(e) => handleFilterChange('زیرمعیار', e.target.value)}
        >
          <option value="">همه زیرمعیارها ({filterOptions.زیرمعیارها.length})</option>
          {filterOptions.زیرمعیارها.map((زیرمعیار) => (
            <option key={زیرمعیار} value={زیرمعیار}>
              {زیرمعیار}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label htmlFor="اهدافراهبردی" className="filter-label">
          <span className="label-icon">🎯</span>
          اهداف راهبردی:
        </label>
        <select
          id="اهدافراهبردی"
          className="filter-select"
          value={selectedFilters.اهدافراهبردی || ''}
          onChange={(e) => handleFilterChange('اهدافراهبردی', e.target.value)}
        >
          <option value="">همه اهداف راهبردی ({filterOptions.اهدافراهبردی.length})</option>
          {filterOptions.اهدافراهبردی.map((هدف) => (
            <option key={هدف} value={هدف}>
              {هدف}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-stats">
        <h4>آمار داده‌ها:</h4>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">{filterOptions.معیارها.length}</span>
            <span className="stat-label">معیار</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{filterOptions.زیرمعیارها.length}</span>
            <span className="stat-label">زیرمعیار</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{filterOptions.اهدافراهبردی.length}</span>
            <span className="stat-label">هدف راهبردی</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{filterOptions.شاخصها.length}</span>
            <span className="stat-label">شاخص</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
