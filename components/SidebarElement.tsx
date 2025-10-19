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
      title={element.description}
      className={`
        inline-flex px-2 py-1 rounded-lg border-2 bg-white cursor-grab
        transition-all select-none hover:shadow-md whitespace-nowrap
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <div className="flex items-center gap-1.5">
        <div className="font-medium text-gray-900 text-sm">{element.name}</div>
        {element.concreteType && (
          <span className="px-1.5 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
            {element.concreteType}
          </span>
        )}
      </div>
    </div>
  );
}
