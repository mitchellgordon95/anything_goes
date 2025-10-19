'use client';

import { useDraggable } from '@dnd-kit/core';
import { Element, SYSTEM_COLORS } from '@/lib/types';

interface SidebarElementProps {
  element: Element;
}

export function SidebarElement({ element }: SidebarElementProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${element.id}`,
    data: { element, source: 'sidebar' },
  });

  const borderColor = SYSTEM_COLORS[element.system];

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ borderColor }}
      className={`
        px-3 py-2 rounded-lg border-2 bg-white cursor-grab
        transition-all select-none hover:shadow-md
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <div className="font-medium text-gray-900 text-sm">{element.name}</div>
      {element.tier > 0 && (
        <div className="text-xs text-gray-500 mt-0.5">Tier {element.tier}</div>
      )}
    </div>
  );
}
