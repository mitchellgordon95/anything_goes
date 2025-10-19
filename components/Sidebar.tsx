'use client';

import { useState, useMemo } from 'react';
import { Element, SystemType, SYSTEM_NAMES } from '@/lib/types';
import { SidebarElement } from './SidebarElement';

interface SidebarProps {
  allElements: Element[];
  discoveries: Element[];
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

export function Sidebar({ allElements, discoveries }: SidebarProps) {
  const [filter, setFilter] = useState<SystemType | 'all'>('all');

  const filteredElements = useMemo(() => {
    const filtered =
      filter === 'all'
        ? allElements
        : allElements.filter((el) => el.system === filter);

    return shuffleArray(filtered);
  }, [allElements, filter]);

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Elements</h2>

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

        <div className="mt-3 text-xs text-gray-500">
          {discoveries.length} discovered
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-wrap gap-2">
          {filteredElements.map((element) => (
            <SidebarElement key={element.id} element={element} />
          ))}
        </div>
      </div>
    </div>
  );
}
