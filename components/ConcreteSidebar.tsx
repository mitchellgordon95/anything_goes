'use client';

import { useState } from 'react';
import { Element, SystemType, SYSTEM_NAMES } from '@/lib/types';
import { SidebarElement } from './SidebarElement';

interface ConcreteSidebarProps {
  concreteElements: Element[];
  onHoverElement: (element: Element | null) => void;
  elementsInLimbo: Set<string>;
}

// Concrete system types in order
const CONCRETE_TYPES: SystemType[] = [
  'character',
  'location',
  'scene',
  'object',
  'event',
];

export function ConcreteSidebar({ concreteElements, onHoverElement, elementsInLimbo }: ConcreteSidebarProps) {
  // Track which sections are collapsed
  const [collapsedSections, setCollapsedSections] = useState<Set<SystemType>>(new Set());

  const toggleSection = (system: SystemType) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(system)) {
      newCollapsed.delete(system);
    } else {
      newCollapsed.add(system);
    }
    setCollapsedSections(newCollapsed);
  };

  // Group elements by type
  const groupedElements = CONCRETE_TYPES.reduce((acc, system) => {
    acc[system] = concreteElements.filter((el) => el.system === system);
    return acc;
  }, {} as Record<SystemType, Element[]>);

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-xl font-semibold text-gray-800">Concrete Elements</h2>
        <p className="text-xs text-gray-500 mt-1">
          {concreteElements.length} total
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {CONCRETE_TYPES.map((system) => {
          const elements = groupedElements[system];
          if (elements.length === 0) return null;

          const isCollapsed = collapsedSections.has(system);

          return (
            <div key={system} className="border-b border-gray-200">
              <button
                onClick={() => toggleSection(system)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{isCollapsed ? '▶' : '▼'}</span>
                  <span className="font-medium text-gray-900">
                    {SYSTEM_NAMES[system]}
                  </span>
                  <span className="text-sm text-gray-500">({elements.length})</span>
                </div>
              </button>

              {!isCollapsed && (
                <div className="px-4 pb-3 flex flex-wrap gap-2">
                  {elements.map((element) => (
                    <SidebarElement
                      key={element.id}
                      element={element}
                      onHover={onHoverElement}
                      isInLimbo={elementsInLimbo.has(element.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {concreteElements.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <p className="text-sm">No concrete elements yet</p>
            <p className="text-xs mt-1">Crystallize elements to create them</p>
          </div>
        )}
      </div>
    </div>
  );
}
