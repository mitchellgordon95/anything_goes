'use client';

import { useDraggable } from '@dnd-kit/core';
import { Element, SYSTEM_COLORS } from '@/lib/types';

interface SidebarElementProps {
  element: Element;
  onInspect: (elementId: string) => void;
}

export function SidebarElement({ element, onInspect }: SidebarElementProps) {
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
      <div
        onClick={(e) => {
          e.stopPropagation();
          onInspect(element.id);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="font-medium text-gray-900 text-sm cursor-pointer hover:text-purple-600 transition-colors"
      >
        {element.name}
      </div>
    </div>
  );
}
