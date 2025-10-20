'use client';

import { useDraggable } from '@dnd-kit/core';
import { Element, SYSTEM_COLORS } from '@/lib/types';

interface SidebarElementProps {
  element: Element;
  onHover: (element: Element | null) => void;
  isInLimbo: boolean;
}

export function SidebarElement({ element, onHover, isInLimbo }: SidebarElementProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${element.id}`,
    data: { element, source: 'sidebar' },
    disabled: isInLimbo, // Can't drag from sidebar if already in limbo
  });

  const borderColor = SYSTEM_COLORS[element.system];

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ borderColor }}
      title={element.description}
      onMouseEnter={() => onHover(element)}
      className={`
        inline-flex px-2 py-1 rounded-lg border-2 bg-white cursor-grab
        transition-all select-none hover:shadow-md whitespace-nowrap
        ${isDragging ? 'opacity-50' : ''}
        ${isInLimbo ? 'opacity-50 ring-2 ring-purple-300 cursor-not-allowed' : ''}
      `}
    >
      <div className="font-medium text-gray-900 text-sm">{element.name}</div>
    </div>
  );
}
