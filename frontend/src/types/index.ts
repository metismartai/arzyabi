export interface Approach {
  id: string;
  code: string;
  title: string;
  goal: string;
  implementation: string;
  criteria: string;
  subCriteria: string;
  strategies: string;
  processes: string;
  objectives: string;
  indicators: string;
  documents: string;
}

export interface FilterState {
  criteria: string[];
  subCriteria: string[];
  strategies: string[];
  processes: string[];
  objectives: string[];
  search: string;
}

export type ViewMode = 'grid' | 'list' | 'table';
