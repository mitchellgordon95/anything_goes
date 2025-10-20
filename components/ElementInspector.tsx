'use client';

import { Element, SYSTEM_NAMES, SYSTEM_COLORS } from '@/lib/types';

interface ElementInspectorProps {
  element: Element;
  allElements: Element[];
  onClose: () => void;
}

export function ElementInspector({ element, allElements, onClose }: ElementInspectorProps) {
  // Get parent elements if they exist
  const parentElements = element.parents
    ? element.parents
        .map((parentId) => allElements.find((el) => el.id === parentId))
        .filter((el): el is Element => el !== undefined)
    : [];

  return (
    <div className="border-t-2 border-gray-200 bg-white p-4">
      {/* Header with name and close button */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{element.name}</h3>
          <div
            style={{
              borderColor: SYSTEM_COLORS[element.system],
              color: SYSTEM_COLORS[element.system],
            }}
            className="inline-flex px-2 py-0.5 rounded-full border-2 text-xs font-semibold"
          >
            {SYSTEM_NAMES[element.system]}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-2 flex-shrink-0"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* Description */}
      {element.description && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-gray-700 mb-1">Description</h4>
          <p className="text-gray-600 text-xs leading-relaxed">{element.description}</p>
        </div>
      )}

      {/* Parent Elements */}
      {parentElements.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-gray-700 mb-1">Created From</h4>
          <div className="flex flex-wrap gap-1.5">
            {parentElements.map((parent) => (
              <div
                key={parent.id}
                style={{ borderColor: SYSTEM_COLORS[parent.system] }}
                className="px-2 py-1 rounded-lg border-2 bg-white"
              >
                <div className="font-medium text-gray-900 text-xs">{parent.name}</div>
                <div className="text-xs text-gray-500">{SYSTEM_NAMES[parent.system]}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      {element.discoveredAt && (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Discovered {new Date(element.discoveredAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
