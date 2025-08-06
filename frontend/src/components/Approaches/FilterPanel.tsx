// src/components/Approaches/FilterPanel.tsx
import React from 'react';

// Define types for filters
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

interface Props {
  filterOptions: FilterOptions | null;
  activeFilters: ActiveFilters;
  onFilterChange: (filterType: keyof ActiveFilters, value: string) => void;
  onResetFilters: () => void;
  approaches: any[]; // We need all approaches to determine dependencies
}

const FilterPanel: React.FC<Props> = ({
  filterOptions,
  activeFilters,
  onFilterChange,
  onResetFilters,
  approaches,
}) => {
  if (!filterOptions) {
    return <div>در حال بارگذاری فیلترها...</div>;
  }

  // --- Cascading Filter Logic ---
  // Determine which subcriteria are available based on selected criteria
  const availableSubcriteria = React.useMemo(() => {
    if (activeFilters.criteria.length === 0) {
      return filterOptions.subcriteria; // Show all if no criteria is selected
    }
    const relatedSubcriteria = new Set<string>();
    approaches.forEach(app => {
      if (activeFilters.criteria.includes(app.criteria)) {
        relatedSubcriteria.add(app.subcriteria);
      }
    });
    return Array.from(relatedSubcriteria).sort();
  }, [activeFilters.criteria, approaches, filterOptions.subcriteria]);

  const renderCheckboxList = (
    title: string,
    filterType: keyof ActiveFilters,
    options: string[]
  ) => (
    <div className="mb-4">
      <h4 className="font-bold mb-2">{title}</h4>
      <div className="max-h-48 overflow-y-auto pr-2">
        {options.map((option) => (
          <div key={option} className="flex items-center mb-1">
            <input
              type="checkbox"
              id={`${filterType}-${option}`}
              checked={activeFilters[filterType].includes(option)}
              onChange={() => onFilterChange(filterType, option)}
              className="ml-2"
            />
            <label htmlFor={`${filterType}-${option}`} className="text-sm">
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <aside className="w-64 bg-gray-50 p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">فیلترها</h3>
        <button
          onClick={onResetFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          حذف فیلتر
        </button>
      </div>
      <hr className="mb-4" />
      
      {renderCheckboxList('معیار', 'criteria', filterOptions.criteria)}
      {renderCheckboxList('زیرمعیار', 'subcriteria', availableSubcriteria)}
      {renderCheckboxList('استراتژی', 'strategies', filterOptions.strategies)}
      {renderCheckboxList('اهداف راهبردی', 'strategicObjectives', filterOptions.strategicObjectives)}
      {renderCheckboxList('فرایند', 'processes', filterOptions.processes)}
    </aside>
  );
};

export default FilterPanel;
