'use client';

import { List, Grid } from 'lucide-react';

interface ViewToggleProps {
  onViewChange: (view: 'list' | 'grid') => void;
  currentView: 'list' | 'grid';
}

export default function ViewToggle({ onViewChange, currentView }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onViewChange('list')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
          currentView === 'list'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <List className="w-4 h-4" />
        <span className="text-sm font-medium">List</span>
      </button>
      <button
        onClick={() => onViewChange('grid')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
          currentView === 'grid'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Grid className="w-4 h-4" />
        <span className="text-sm font-medium">Grid</span>
      </button>
    </div>
  );
}
