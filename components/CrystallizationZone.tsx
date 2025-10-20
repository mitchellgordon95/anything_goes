'use client';

import { useDroppable, useDraggable } from '@dnd-kit/core';
import { Element, SystemType, SYSTEM_COLORS, SYSTEM_NAMES } from '@/lib/types';

interface CrystallizationZoneProps {
  elementsInZone: Element[];
  onCrystallize: (type: SystemType) => void;
  onRemoveFromZone: (elementId: string) => void;
  outputElement: Element | null;
  shouldConsumeInputs: boolean;
  onConsumeInputsChange: (value: boolean) => void;
  onHoverElement: (element: Element | null) => void;
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

// Draggable output element component
function OutputElement({
  outputElement,
  onHover
}: {
  outputElement: Element;
  onHover: (element: Element | null) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `crystallization-output-${outputElement.id}`,
    data: { element: outputElement, source: 'crystallization-output' },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        borderColor: SYSTEM_COLORS[outputElement.system],
        opacity: isDragging ? 0.5 : 1,
      }}
      title={outputElement.description}
      onMouseEnter={() => onHover(outputElement)}
      className="px-2 py-1 rounded border-2 bg-white shadow-sm cursor-grab hover:shadow-md transition-all"
    >
      <div className="font-medium text-gray-900 text-xs mb-0.5">
        {outputElement.name}
      </div>
      <div className="text-xs text-gray-500">
        {SYSTEM_NAMES[outputElement.system]}
      </div>
      <div className="text-xs text-purple-600 mt-1 italic">
        Drag to canvas →
      </div>
    </div>
  );
}

export function CrystallizationZone({
  elementsInZone,
  onCrystallize,
  onRemoveFromZone,
  outputElement,
  shouldConsumeInputs,
  onConsumeInputsChange,
  onHoverElement,
}: CrystallizationZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'crystallization-zone',
  });

  const canCrystallize = elementsInZone.length >= 1;

  return (
    <div className="border-t-2 border-purple-300 bg-purple-50 p-2">
      <div className="flex items-center gap-3">
        {/* Left: Inputs */}
        <div className="flex-1">
          <div className="text-xs font-medium text-purple-700 mb-1">Inputs</div>
          <div
            ref={setNodeRef}
            className={`
              min-h-16 border-2 border-dashed rounded-lg p-2
              transition-all
              ${isOver ? 'border-purple-600 bg-purple-100' : 'border-purple-300 bg-white'}
            `}
          >
            {elementsInZone.length === 0 ? (
              <div className="text-center text-purple-400 text-xs py-2">
                Drag elements here
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {elementsInZone.map((element) => (
                  <div
                    key={element.id}
                    style={{ borderColor: SYSTEM_COLORS[element.system] }}
                    title={element.description}
                    className="px-2 py-1 rounded border-2 bg-white shadow-sm flex items-center gap-1"
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
        </div>

        {/* Middle: Buttons + Arrow */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-1">
            <div className="text-xs font-medium text-purple-700 text-center mb-0.5">Create</div>
            <div className="grid grid-cols-4 gap-1">
              {CONCRETE_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => canCrystallize && onCrystallize(type)}
                  disabled={!canCrystallize}
                  className={`
                    px-2 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap
                    ${canCrystallize
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                  title={SYSTEM_NAMES[type]}
                >
                  {SYSTEM_NAMES[type]}
                </button>
              ))}
            </div>
          </div>
          <div className="text-purple-600 text-xl font-bold">→</div>
        </div>

        {/* Right: Output + Consume Checkbox */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs font-medium text-purple-700">Output</div>
            <label className="flex items-center gap-1 text-xs text-purple-700 cursor-pointer">
              <input
                type="checkbox"
                checked={shouldConsumeInputs}
                onChange={(e) => onConsumeInputsChange(e.target.checked)}
                className="cursor-pointer"
              />
              Consume inputs
            </label>
          </div>
          <div className="min-h-16 border-2 border-dashed border-purple-300 bg-white rounded-lg p-2">
            {outputElement ? (
              <OutputElement outputElement={outputElement} onHover={onHoverElement} />
            ) : (
              <div className="text-center text-purple-400 text-xs py-2">
                No output yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
