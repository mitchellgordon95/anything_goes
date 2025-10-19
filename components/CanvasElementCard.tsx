'use client';

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { CanvasElement, SYSTEM_COLORS } from '@/lib/types';

interface CanvasElementCardProps {
  canvasElement: CanvasElement;
  onCombine: (elementId1: string, elementId2: string) => void;
  isRerollable: boolean;
  onReroll: (elementId: string) => void;
}

export function CanvasElementCard({
  canvasElement,
  onCombine,
  isRerollable,
  onReroll,
}: CanvasElementCardProps) {
  const { element, position } = canvasElement;

  const { attributes, listeners, setNodeRef: setDraggableRef, transform, isDragging } = useDraggable({
    id: `canvas-${element.id}`,
    data: { element, source: 'canvas' },
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `droppable-${element.id}`,
    data: { element },
  });

  const style = {
    position: 'absolute' as const,
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    borderColor: SYSTEM_COLORS[element.system],
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={(node) => {
        setDraggableRef(node);
        setDroppableRef(node);
      }}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        px-4 py-2 rounded-lg border-2 bg-white shadow-md cursor-grab
        transition-all select-none relative
        ${isOver ? 'ring-4 ring-opacity-50 scale-105' : ''}
      `}
    >
      {isRerollable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReroll(element.id);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute -top-2 -right-2 w-6 h-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer text-sm"
          title="Re-roll combination"
        >
          ↻
        </button>
      )}
      <div className="font-medium text-gray-900 text-sm whitespace-nowrap">
        {element.name}
      </div>
    </div>
  );
}
