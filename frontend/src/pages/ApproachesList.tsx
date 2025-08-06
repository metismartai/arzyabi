import React, { useState, useEffect, useMemo } from 'react';
import { Search, Grid, List, Table, RefreshCw, Filter } from 'lucide-react';
import FilterPanel from '../components/Approaches/FilterPanel';
import ApproachCard from '../components/Approaches/ApproachCard';
import ApproachTable from '../components/Approaches/ApproacheTable';
import './ApproachesList.css';

// انواع نمایش
type ViewMode = 'list' | 'grid' | 'table';

// نوع داده رویکرد
interface Approach {
  id: string;
  code: string;
  title: string;
  objective: string;
  implementation: string;
  criterion_id: string;
  sub_criterion_id: string;
  strategies: string[];
  processes: string[];
  strategic_objectives: string[];
  indicators_count: number;
  documents_count: number;
}

// نوع فیلترها
interface Filters {
  criteria: string[];
  subCriteria: string[];
  strategies: string[];
  strategicObjectives: string[];
  processes: string[];
}

const ApproachesList: React.FC = () => {
  // State ها
  const [approaches, setApproaches] = useState<Approach[]>([]);
  const [filteredApproaches, setFilteredApproaches] = useState<Approach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<Filters>({
    criteria: [],
    subCriteria: [],
    strategies: [],
    strategicObjectives: [],
    processes: []
  });
  const [showFilters, setShowFilters] = useState(true);

  // بارگذاری داده‌ها از API
  useEffect(() => {
    fetchApproaches();
  }, []);

  const fetchApproaches = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/approaches');
      if (!response.ok) throw new Error('خطا در بارگذاری رویکردها');
      const data = await response.json();
      setApproaches(data);
      setFilteredApproaches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای نامشخص');
    } finally {
      setLoading(false);
    }
  };

  // فیلتر کردن رویکردها
  const filteredAndSearchedApproaches = useMemo(() => {
    let result = [...approaches];

    // اعمال فیلترها
    if (filters.criteria.length > 0) {
      result = result.filter(approach => 
        filters.criteria.includes(approach.criterion_id)
      );
    }

    if (filters.subCriteria.length > 0) {
      result = result.filter(approach => 
        filters.subCriteria.includes(approach.sub_criterion_id)
      );
    }

    if (filters.strategies.length > 0) {
      result = result.filter(approach => 
        approach.strategies.some(strategy => filters.strategies.includes(strategy))
      );
    }

    if (filters.strategicObjectives.length > 0) {
      result = result.filter(approach => 
        approach.strategic_objectives.some(obj => filters.strategicObjectives.includes(obj))
      );
    }

    if (filters.processes.length > 0) {
      result = result.filter(approach => 
        approach.processes.some(process => filters.processes.includes(process))
      );
    }

    // اعمال جستجو
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(approach =>
        approach.title.toLowerCase().includes(searchLower) ||
        approach.objective.toLowerCase().includes(searchLower) ||
        approach.implementation.toLowerCase().includes(searchLower) ||
        approach.code.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [approaches, filters, searchTerm]);

  // حذف همه فیلترها
  const clearAllFilters = () => {
    setFilters({
      criteria: [],
      subCriteria: [],
      strategies: [],
      strategicObjectives: [],
      processes: []
    });
    setSearchTerm('');
  };

  // رندر محتوای اصلی
  const renderContent = () => {
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
          <p className="error-message">{error}</p>
          <button onClick={fetchApproaches} className="retry-btn">
            <RefreshCw size={16} />
            تلاش مجدد
          </button>
        </div>
      );
    }

    if (filteredAndSearchedApproaches.length === 0) {
      return (
        <div className="empty-state">
          <p>هیچ رویکردی یافت نشد</p>
          <button onClick={clearAllFilters} className="clear-filters-btn">
            حذف فیلترها
          </button>
        </div>
      );
    }

    // نمایش بر اساس حالت انتخابی
    switch (viewMode) {
      case 'table':
        return <ApproachTable approaches={filteredAndSearchedApproaches} />;
      case 'list':
        return (
          <div className="approaches-list-view">
            {filteredAndSearchedApproaches.map(approach => (
              <ApproachCard 
                key={approach.id} 
                approach={approach} 
                viewMode="list"
              />
            ))}
          </div>
        );
      case 'grid':
      default:
        return (
          <div className="approaches-grid-view">
            {filteredAndSearchedApproaches.map(approach => (
              <ApproachCard 
                key={approach.id} 
                approach={approach} 
                viewMode="grid"
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="approaches-page">
      {/* سایدبار فیلتر */}
      <div className={`filter-sidebar ${!showFilters ? 'hidden' : ''}`}>
        <FilterPanel 
          filters={filters}
          onFiltersChange={setFilters}
          approaches={approaches}
        />
      </div>

      {/* محتوای اصلی */}
      <div className={`main-content ${!showFilters ? 'full-width' : ''}`}>
        {/* هدر صفحه */}
        <div className="page-header">
          <h1>مدیریت رویکردها</h1>
          
          {/* نوار ابزار */}
          <div className="toolbar">
            {/* دکمه نمایش/پنهان کردن فیلتر */}
            <button 
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              {showFilters ? 'پنهان کردن فیلتر' : 'نمایش فیلتر'}
            </button>

            {/* جستجو */}
            <div className="search-container">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="جستجو در رویکردها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {/* تعداد نتایج */}
            <div className="results-count">
              {filteredAndSearchedApproaches.length} از {approaches.length} رویکرد
            </div>

            {/* حالت‌های نمایش */}
            <div className="view-modes">
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="نمایش لیستی"
              >
                <List size={16} />
              </button>
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="نمایش شبکه‌ای"
              >
                <Grid size={16} />
              </button>
              <button
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="نمایش جدولی"
              >
                <Table size={16} />
              </button>
            </div>

            {/* دکمه نمایش همه */}
            <button 
              className="show-all-btn"
              onClick={clearAllFilters}
            >
              <RefreshCw size={16} />
              کل رویکردها
            </button>
          </div>
        </div>

        {/* محتوای رویکردها */}
        <div className="approaches-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ApproachesList;
