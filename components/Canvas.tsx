'use client';

import { useDroppable } from '@dnd-kit/core';
import { CanvasElement } from '@/lib/types';
import { CanvasElementCard } from './CanvasElementCard';

interface CanvasProps {
  canvasElements: CanvasElement[];
  onCombine: (elementId1: string, elementId2: string) => void;
}

export function Canvas({ canvasElements, onCombine }: CanvasProps) {
  const { setNodeRef } = useDroppable({
    id: 'canvas',
  });

  return (
    <div
      ref={setNodeRef}
      data-canvas
      className="relative w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg overflow-auto"
    >
      {canvasElements.map((canvasEl) => (
        <CanvasElementCard
          key={canvasEl.element.id}
          canvasElement={canvasEl}
          onCombine={onCombine}
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
  );
}
