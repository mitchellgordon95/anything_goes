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
  onHoverElement: (element: Element | null) => void;
  crystallizationOutput: Element | null;
  elementsInLimbo: Set<string>;
  shouldConsumeInputs: boolean;
  onConsumeInputsChange: (value: boolean) => void;
}

export function Canvas({
  canvasElements,
  onCombine,
  rerollableElementId,
  onReroll,
  crystallizationElements,
  onCrystallize,
  onRemoveFromCrystallization,
  onHoverElement,
  crystallizationOutput,
  elementsInLimbo,
  shouldConsumeInputs,
  onConsumeInputsChange
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
            onHover={onHoverElement}
            isInLimbo={elementsInLimbo.has(canvasEl.element.id)}
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
        outputElement={crystallizationOutput}
        shouldConsumeInputs={shouldConsumeInputs}
        onConsumeInputsChange={onConsumeInputsChange}
        onHoverElement={onHoverElement}
      />
    </div>
  );
}
