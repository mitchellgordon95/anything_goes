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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header with name and system badge */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{element.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div
            style={{
              borderColor: SYSTEM_COLORS[element.system],
              color: SYSTEM_COLORS[element.system],
            }}
            className="inline-flex px-3 py-1 rounded-full border-2 text-sm font-semibold"
          >
            {SYSTEM_NAMES[element.system]}
          </div>
        </div>

        {/* Description */}
        {element.description && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{element.description}</p>
          </div>
        )}

        {/* Parent Elements */}
        {parentElements.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Created From</h3>
            <div className="flex flex-wrap gap-2">
              {parentElements.map((parent) => (
                <div
                  key={parent.id}
                  style={{ borderColor: SYSTEM_COLORS[parent.system] }}
                  className="px-3 py-1.5 rounded-lg border-2 bg-white"
                >
                  <div className="font-medium text-gray-900 text-sm">{parent.name}</div>
                  <div className="text-xs text-gray-500">{SYSTEM_NAMES[parent.system]}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        {element.discoveredAt && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Discovered {new Date(element.discoveredAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
