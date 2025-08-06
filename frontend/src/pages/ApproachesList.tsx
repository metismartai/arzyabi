// src/components/Approaches/ApproachesList.tsx
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import FilterPanel from '../components/Approaches/FilterPanel';
import ApproachCard from '../components/Approaches/ApproachCard';
import ApproachTable from '../components/Approaches/ApproachTable';

// Define types
// (These should ideally be in a separate types.ts file)
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
  criteria: string;
  subcriteria: string;
}

interface FilterOptions {
  criteria: string[];
  subcriteria: string[];
  strategies: string[];
  strategicObjectives: string[];
  processes: string[];
}

interface ActiveFilters {
  criteria: string[];
  subcriteria: string[];
  strategies: string[];
  strategicObjectives: string[];
  processes: string[];
}

const initialFilters: ActiveFilters = {
  criteria: [],
  subcriteria: [],
  strategies: [],
  strategicObjectives: [],
  processes: [],
};

type ViewMode = 'grid' | 'list' | 'table';

const ApproachesList: React.FC = () => {
  const [allApproaches, setAllApproaches] = useState<Approach[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(initialFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [approachesRes, filtersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/approaches'),
          axios.get('http://localhost:5000/api/filters'),
        ]);
        setAllApproaches(approachesRes.data);
        setFilterOptions(filtersRes.data);
        setError(null);
        console.log('data received', filtersRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('خطا در دریافت اطلاعات از سرور.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (filterType: keyof ActiveFilters, value: string) => {
    setActiveFilters(prev => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };
  
  const resetAll = () => {
    setActiveFilters(initialFilters);
    setSearchQuery('');
  };

  const filteredApproaches = useMemo(() => {
    return allApproaches.filter(app => {
      // Search Query Filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        app.title.toLowerCase().includes(searchLower) ||
        app.goal.toLowerCase().includes(searchLower) ||
        app.code.toLowerCase().includes(searchLower) ||
        app.implementation.toLowerCase().includes(searchLower);
        
      if (!matchesSearch) return false;

      // Checkbox Filters (AND logic)
      const matchesCriteria = activeFilters.criteria.length === 0 || activeFilters.criteria.includes(app.criteria);
      const matchesSubcriteria = activeFilters.subcriteria.length === 0 || activeFilters.subcriteria.includes(app.subcriteria);
      
      const matchesStrategies = activeFilters.strategies.length === 0 || activeFilters.strategies.every(s => app.strategies.includes(s));
      const matchesProcesses = activeFilters.processes.length === 0 || activeFilters.processes.every(p => app.processes.includes(p));
      const matchesObjectives = activeFilters.strategicObjectives.length === 0 || activeFilters.strategicObjectives.every(o => app.strategicObjectives.includes(o));

      return matchesCriteria && matchesSubcriteria && matchesStrategies && matchesProcesses && matchesObjectives;
    });
  }, [allApproaches, activeFilters, searchQuery]);

  if (loading) return <div className="text-center p-10">در حال بارگذاری...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">مدیریت رویکردها</h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Panel */}
        <div className="lg:w-1/4 xl:w-1/5">
          <FilterPanel
        
          filterOptions={filterOptions}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onResetFilters={resetAll}
          approaches={allApproaches} // Pass all approaches for cascading logic
        />
        </div>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header Bar */}
          <div className="bg-white p-3 rounded-lg shadow-md mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex-grow sm:flex-grow-0">
              <input
                type="text"
                placeholder="جستجو در رویکردها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-sm text-gray-600">
              نمایش {filteredApproaches.length} از کل {allApproaches.length} رویکرد
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">نمایش:</span>
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>شبکه‌ای</button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>لیستی</button>
              <button onClick={() => setViewMode('table')} className={`p-2 rounded ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>جدولی</button>
            </div>
            <button
              onClick={resetAll}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              کل رویکردها
            </button>
          </div>

          {/* Approaches Display */}
          {filteredApproaches.length > 0 ? (
            viewMode === 'table' ? (
              <ApproachTable approaches={filteredApproaches} />
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : 'grid-cols-1'
                }`}
              >
                {filteredApproaches.map((approach) => (
                  <ApproachCard key={approach.code} approach={approach} />
                ))}
              </div>
            )
          ) : (
            <div className="text-center p-10 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold">هیچ رویکردی یافت نشد!</h3>
              <p className="text-gray-500 mt-2">لطفاً فیلترها یا عبارت جستجوی خود را تغییر دهید.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ApproachesList;
