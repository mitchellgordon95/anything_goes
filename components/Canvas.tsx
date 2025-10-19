'use client';

import { useDroppable } from '@dnd-kit/core';
import { CanvasElement, Element, SystemType } from '@/lib/types';
import { CanvasElementCard } from './CanvasElementCard';
import { CrystallizationZone } from './CrystallizationZone';

interface CanvasProps {
  canvasElements: CanvasElement[];
  onCombine: (elementId1: string, elementId2: string) => void;
  rerollableElementId: string | null;
  onReroll: (elementId: string) => void;
  crystallizationElements: Element[];
  onCrystallize: (type: SystemType) => void;
  onRemoveFromCrystallization: (elementId: string) => void;
  onInspectElement: (elementId: string) => void;
}

export function Canvas({
  canvasElements,
  onCombine,
  rerollableElementId,
  onReroll,
  crystallizationElements,
  onCrystallize,
  onRemoveFromCrystallization,
  onInspectElement
}: CanvasProps) {
  const { setNodeRef } = useDroppable({
    id: 'canvas',
  });

  return (
    <div className="flex flex-col h-full">
      <div
        ref={setNodeRef}
        data-canvas
        className="relative flex-1 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg overflow-auto"
      >
        {canvasElements.map((canvasEl) => (
          <CanvasElementCard
            key={canvasEl.element.id}
            canvasElement={canvasEl}
            onCombine={onCombine}
            isRerollable={canvasEl.element.id === rerollableElementId}
            onReroll={onReroll}
            onInspect={onInspectElement}
          />
        ))}

        {canvasElements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-gray-400 text-lg">
              Drag elements here to start crafting your story
            </p>
          </div>
        )}
      </div>

      <CrystallizationZone
        elementsInZone={crystallizationElements}
        onCrystallize={onCrystallize}
        onRemoveFromZone={onRemoveFromCrystallization}
      />
    </div>
  );
}
