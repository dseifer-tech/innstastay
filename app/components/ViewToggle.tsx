'use client';

import { List, Grid } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

interface ViewToggleProps {
  onViewChange: (view: 'list' | 'grid') => void;
  currentView: 'list' | 'grid';
}

export default function ViewToggle({ onViewChange, currentView }: ViewToggleProps) {
  return (
    <div role="radiogroup" aria-label="View toggle" className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <Button
        role="radio"
        aria-checked={currentView === 'list'}
        variant={currentView === 'list' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className="gap-2"
      >
        <List className="w-4 h-4" />
        <span className="text-sm font-medium">List</span>
      </Button>
      <Button
        role="radio"
        aria-checked={currentView === 'grid'}
        variant={currentView === 'grid' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className="gap-2"
      >
        <Grid className="w-4 h-4" />
        <span className="text-sm font-medium">Grid</span>
      </Button>
    </div>
  );
}
