'use client';

import { useState, useMemo, useEffect } from 'react';
import { Element, SystemType, SYSTEM_NAMES } from '@/lib/types';
import { SidebarElement } from './SidebarElement';

interface SidebarProps {
  allElements: Element[];
  discoveries: Element[];
  onResetDiscoveries: () => void;
  onCreateElement: (name: string) => void;
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function Sidebar({ allElements, discoveries, onResetDiscoveries, onCreateElement }: SidebarProps) {
  const [filter, setFilter] = useState<SystemType | 'all'>('all');
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Only shuffle after client-side hydration to avoid mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredElements = useMemo(() => {
    let filtered =
      filter === 'all'
        ? allElements
        : allElements.filter((el) => el.system === filter);

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((el) =>
        el.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Only shuffle on client after mount to avoid hydration mismatch
    return isMounted ? shuffleArray(filtered) : filtered;
  }, [allElements, filter, isMounted, searchQuery]);

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Elements</h2>

        <input
          type="text"
          placeholder="Search or create elements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as SystemType | 'all')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Systems ({allElements.length})</option>
          {(Object.keys(SYSTEM_NAMES) as SystemType[]).map((system) => {
            const count = allElements.filter((el) => el.system === system).length;
            return (
              <option key={system} value={system}>
                {SYSTEM_NAMES[system]} ({count})
              </option>
            );
          })}
        </select>

        <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
          <span>{discoveries.length} discovered</span>
          {discoveries.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all discovered elements? This cannot be undone.')) {
                  onResetDiscoveries();
                }
              }}
              className="text-red-500 hover:text-red-700 underline"
            >
              reset
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {searchQuery.trim() && filteredElements.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm mb-4">No elements found</p>
            <button
              onClick={() => onCreateElement(searchQuery.trim())}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              Create "{searchQuery.trim()}"
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {filteredElements.map((element) => (
              <SidebarElement key={element.id} element={element} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
