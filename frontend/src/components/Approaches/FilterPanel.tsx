import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import './FilterPanel.css';

interface FilterPanelProps {
  filters: {
    criteria: string[];
    subCriteria: string[];
    strategies: string[];
    strategicObjectives: string[];
    processes: string[];
  };
  onFiltersChange: (filters: any) => void;
  approaches: any[];
}

interface FilterOption {
  id: string;
  name: string;
  count: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  approaches
}) => {
  // State برای گزینه‌های فیلتر
  const [criteriaOptions, setCriteriaOptions] = useState<FilterOption[]>([]);
  const [subCriteriaOptions, setSubCriteriaOptions] = useState<FilterOption[]>([]);
  const [strategiesOptions, setStrategiesOptions] = useState<FilterOption[]>([]);
  const [objectivesOptions, setObjectivesOptions] = useState<FilterOption[]>([]);
  const [processesOptions, setProcessesOptions] = useState<FilterOption[]>([]);

  // State برای باز/بسته بودن بخش‌ها
  const [expandedSections, setExpandedSections] = useState({
    criteria: true,
    subCriteria: true,
    strategies: true,
    objectives: true,
    processes: true
  });

  // بارگذاری گزینه‌های فیلتر از API
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // به‌روزرسانی گزینه‌های فیلتر بر اساس فیلترهای فعال
  useEffect(() => {
    updateFilterOptions();
  }, [filters, approaches]);

  const fetchFilterOptions = async () => {
    try {
      // بارگذاری معیارها
      const criteriaRes = await fetch('/api/criteria');
      const criteria = await criteriaRes.json();
      setCriteriaOptions(criteria.map((c: any) => ({
        id: c.id,
        name: c.name,
        count: 0
      })));

      // بارگذاری سایر گزینه‌ها...
      // (کد مشابه برای سایر فیلترها)
      
    } catch (error) {
      console.error('خطا در بارگذاری گزینه‌های فیلتر:', error);
    }
  };

  const updateFilterOptions = () => {
    // به‌روزرسانی تعداد هر گزینه بر اساس رویکردهای فیلتر شده
    // پیاده‌سازی منطق AND برای فیلترها
  };

  const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
    const newFilters = { ...filters };
    
    if (checked) {
      newFilters[filterType as keyof typeof filters].push(value);
    } else {
      newFilters[filterType as keyof typeof filters] = 
        newFilters[filterType as keyof typeof filters].filter((item: string) => item !== value);
    }
    
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      criteria: [],
      subCriteria: [],
      strategies: [],
      strategicObjectives: [],
      processes: []
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const renderFilterSection = (
    title: string,
    filterType: string,
    options: FilterOption[],
    selectedValues: string[]
  ) => {
    const isExpanded = expandedSections[filterType as keyof typeof expandedSections];
    
    return (
      <div className="filter-section">
        <div 
          className="filter-section-header"
          onClick={() => toggleSection(filterType)}
        >
          <h4>{title}</h4>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        
        {isExpanded && (
          <div className="filter-options">
            {options.map(option => (
              <label key={option.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.id)}
                  onChange={(e) => handleFilterChange(filterType, option.id, e.target.checked)}
                  disabled={option.count === 0}
                />
                <span className="checkmark"></span>
                <span className="option-text">
                  {option.name}
                  <span className="option-count">({option.count})</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>فیلتر رویکردها</h3>
        <button 
          className="clear-filters-btn"
          onClick={clearAllFilters}
          title="حذف همه فیلترها"
        >
          <X size={16} />
          حذف فیلتر
        </button>
      </div>

      <div className="filter-content">
        {renderFilterSection('معیار', 'criteria', criteriaOptions, filters.criteria)}
        {renderFilterSection('زیرمعیار', 'subCriteria', subCriteriaOptions, filters.subCriteria)}
        {renderFilterSection('استراتژی', 'strategies', strategiesOptions, filters.strategies)}
        {renderFilterSection('اهداف راهبردی', 'strategicObjectives', objectivesOptions, filters.strategicObjectives)}
        {renderFilterSection('فرایند', 'processes', processesOptions, filters.processes)}
      </div>
    </div>
  );
};

export default FilterPanel;
