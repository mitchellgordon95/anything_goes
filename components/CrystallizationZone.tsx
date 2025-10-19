'use client';

import { useDroppable } from '@dnd-kit/core';
import { Element, SystemType, SYSTEM_COLORS, SYSTEM_NAMES } from '@/lib/types';
import { useState } from 'react';

interface CrystallizationZoneProps {
  elementsInZone: Element[];
  onCrystallize: (type: SystemType) => void;
  onRemoveFromZone: (elementId: string) => void;
}

const CONCRETE_TYPES: SystemType[] = [
  'character',
  'location',
  'scene',
  'beat',
  'object',
  'relationship',
  'event',
  'theme',
];

export function CrystallizationZone({
  elementsInZone,
  onCrystallize,
  onRemoveFromZone,
}: CrystallizationZoneProps) {
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: 'crystallization-zone',
  });

  const canCrystallize = elementsInZone.length >= 1;

  const handleCrystallizeClick = () => {
    setShowTypeSelector(true);
  };

  const handleTypeSelect = (type: SystemType) => {
    onCrystallize(type);
    setShowTypeSelector(false);
  };

  return (
    <div className="border-t-2 border-purple-300 bg-purple-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-purple-900">
          Crystallization Zone
        </h3>
        {canCrystallize && (
          <button
            onClick={handleCrystallizeClick}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg font-medium transition-colors"
          >
            Crystallize →
          </button>
        )}
      </div>

      <div
        ref={setNodeRef}
        className={`
          min-h-24 border-2 border-dashed rounded-lg p-3
          transition-all
          ${isOver ? 'border-purple-600 bg-purple-100' : 'border-purple-300 bg-white'}
        `}
      >
        {elementsInZone.length === 0 ? (
          <div className="text-center text-purple-400 text-sm py-4">
            Drag 1+ elements here to crystallize into a concrete story element
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {elementsInZone.map((element) => (
              <div
                key={element.id}
                style={{ borderColor: SYSTEM_COLORS[element.system] }}
                title={element.description}
                className="px-3 py-1 rounded-lg border-2 bg-white shadow-sm flex items-center gap-2"
              >
                <span className="font-medium text-gray-900 text-xs">
                  {element.name}
                </span>
                <button
                  onClick={() => onRemoveFromZone(element.id)}
                  className="text-gray-400 hover:text-red-600 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Type Selector Modal */}
      {showTypeSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Choose Concrete Type
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              What type of story element should this become?
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {CONCRETE_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  className="px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-lg font-medium transition-colors text-sm"
                >
                  {SYSTEM_NAMES[type]}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowTypeSelector(false)}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
