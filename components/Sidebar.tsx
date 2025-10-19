'use client';

import { useState, useMemo, useEffect } from 'react';
import { Element, SystemType, SYSTEM_NAMES, SYSTEM_COLORS } from '@/lib/types';
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
  const [selectedSystems, setSelectedSystems] = useState<Set<SystemType>>(
    new Set(Object.keys(SYSTEM_NAMES) as SystemType[])
  );
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Only shuffle after client-side hydration to avoid mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSystem = (system: SystemType) => {
    const newSelected = new Set(selectedSystems);
    if (newSelected.has(system)) {
      newSelected.delete(system);
    } else {
      newSelected.add(system);
    }
    setSelectedSystems(newSelected);
  };

  // Get only systems that have elements
  const availableSystems = useMemo(() => {
    const systems = new Set<SystemType>();
    allElements.forEach((el) => systems.add(el.system));
    return Array.from(systems).sort((a, b) =>
      SYSTEM_NAMES[a].localeCompare(SYSTEM_NAMES[b])
    );
  }, [allElements]);

  const toggleAll = () => {
    if (selectedSystems.size === availableSystems.length) {
      // All available systems selected, clear all
      setSelectedSystems(new Set());
    } else {
      // Select all available systems
      setSelectedSystems(new Set(availableSystems));
    }
  };

  const filteredElements = useMemo(() => {
    let filtered = allElements.filter((el) => selectedSystems.has(el.system));

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((el) =>
        el.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Only shuffle on client after mount to avoid hydration mismatch
    return isMounted ? shuffleArray(filtered) : filtered;
  }, [allElements, selectedSystems, isMounted, searchQuery]);

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

        <div className="mb-2">
          <div className="text-xs font-medium text-gray-600 mb-2">Filter by System</div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={toggleAll}
              className={`
                inline-flex px-2 py-1 rounded-lg border-2 text-xs font-medium transition-all
                ${selectedSystems.size === availableSystems.length
                  ? 'bg-gray-600 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              All
            </button>
            {availableSystems.map((system) => {
              const isSelected = selectedSystems.has(system);
              const color = SYSTEM_COLORS[system];
              return (
                <button
                  key={system}
                  onClick={() => toggleSystem(system)}
                  style={{
                    borderColor: color,
                    backgroundColor: isSelected ? color : 'white',
                    color: isSelected ? 'white' : color,
                  }}
                  className="inline-flex px-2 py-1 rounded-lg border-2 text-xs font-medium transition-all hover:shadow-md"
                >
                  {SYSTEM_NAMES[system]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
          <span>
            {filteredElements.length} showing · {discoveries.length} discovered
          </span>
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
              Create &quot;{searchQuery.trim()}&quot;
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
