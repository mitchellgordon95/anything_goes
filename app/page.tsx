'use client';

import { useEffect, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import { Element, CanvasElement as CanvasElementType } from '@/lib/types';
import { BASE_ELEMENTS } from '@/lib/baseElements';
import {
  loadDiscoveries,
  saveDiscoveries,
  loadCanvasElements,
  saveCanvasElements,
  clearCanvasElements,
} from '@/lib/storage';
import { Canvas } from '@/components/Canvas';
import { Sidebar } from '@/components/Sidebar';
import { SYSTEM_NAMES, SYSTEM_COLORS } from '@/lib/types';

export default function Home() {
  const [discoveries, setDiscoveries] = useState<Element[]>([]);
  const [canvasElements, setCanvasElements] = useState<CanvasElementType[]>([]);
  const [allElements, setAllElements] = useState<Element[]>(BASE_ELEMENTS);
  const [activeElement, setActiveElement] = useState<Element | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Load saved data on mount
  useEffect(() => {
    const savedDiscoveries = loadDiscoveries();
    const savedCanvas = loadCanvasElements();
    setDiscoveries(savedDiscoveries);
    setCanvasElements(savedCanvas);
    setAllElements([...BASE_ELEMENTS, ...savedDiscoveries]);
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveElement(active.data.current?.element || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    console.log('Drag end:', {
      activeId: active.id,
      overId: over?.id,
      activeData: active.data.current,
      overData: over?.data.current
    });

    setActiveElement(null);

    if (!over) {
      console.log('No drop target');
      return;
    }

    const activeData = active.data.current;
    const overData = over.data.current;

    // Case 1: Dragging from sidebar to canvas
    if (activeData?.source === 'sidebar' && over.id === 'canvas') {
      const element = activeData.element;

      // Get canvas container to calculate relative position
      const canvasEl = document.querySelector('[data-canvas]');
      if (!canvasEl) {
        console.error('Canvas element not found');
        return;
      }

      const rect = canvasEl.getBoundingClientRect();
      const dropPosition = {
        x: Math.max(0, active.rect.current.translated?.left || 0) - rect.left,
        y: Math.max(0, active.rect.current.translated?.top || 0) - rect.top,
      };

      console.log('Dropping on canvas:', { dropPosition, rect, activeRect: active.rect.current.translated });

      // Check if element already exists on canvas
      const existsOnCanvas = canvasElements.some(
        (ce) => ce.element.id === element.id
      );

      if (!existsOnCanvas) {
        const newCanvasElements = [
          ...canvasElements,
          { element, position: dropPosition },
        ];
        console.log('Adding to canvas:', newCanvasElements);
        setCanvasElements(newCanvasElements);
        saveCanvasElements(newCanvasElements);
      } else {
        console.log('Element already on canvas');
      }
    }

    // Case 2: Dragging canvas element onto another canvas element (combine)
    if (activeData?.source === 'canvas' && overData?.element) {
      const element1 = activeData.element;
      const element2 = overData.element;

      if (element1.id !== element2.id) {
        console.log('Combining elements:', element1.name, '+', element2.name);
        await handleCombine(element1.id, element2.id);
      }
    }

    // Case 3: Dragging from sidebar directly onto a canvas element (combine)
    if (activeData?.source === 'sidebar' && overData?.element) {
      const sidebarElement = activeData.element;
      const canvasElement = overData.element;

      console.log('Combining sidebar element with canvas element:', sidebarElement.name, '+', canvasElement.name);

      // First, temporarily add sidebar element to canvas at the target position
      const targetCanvas = canvasElements.find((ce) => ce.element.id === canvasElement.id);
      if (targetCanvas) {
        // Add the sidebar element temporarily
        const tempCanvasElement: CanvasElementType = {
          element: sidebarElement,
          position: targetCanvas.position,
        };
        const tempCanvas = [...canvasElements, tempCanvasElement];
        setCanvasElements(tempCanvas);

        // Now combine them (this will remove both and add the result)
        await handleCombine(sidebarElement.id, canvasElement.id);
      }
    }

    // Case 4: Moving a canvas element to a new position
    if (activeData?.source === 'canvas' && over.id === 'canvas' && !overData?.element) {
      const element = activeData.element;

      // Get canvas container to calculate relative position
      const canvasEl = document.querySelector('[data-canvas]');
      if (!canvasEl) {
        console.error('Canvas element not found');
        return;
      }

      const rect = canvasEl.getBoundingClientRect();
      const newPosition = {
        x: Math.max(0, active.rect.current.translated?.left || 0) - rect.left,
        y: Math.max(0, active.rect.current.translated?.top || 0) - rect.top,
      };

      console.log('Moving canvas element:', element.name, 'to', newPosition);

      // Update the position of this element
      const updatedCanvas = canvasElements.map((ce) =>
        ce.element.id === element.id
          ? { ...ce, position: newPosition }
          : ce
      );

      setCanvasElements(updatedCanvas);
      saveCanvasElements(updatedCanvas);
    }
  };

  const handleCombine = async (elementId1: string, elementId2: string) => {
    const el1 = allElements.find((e) => e.id === elementId1);
    const el2 = allElements.find((e) => e.id === elementId2);

    if (!el1 || !el2) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/combine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          element1: { name: el1.name, system: SYSTEM_NAMES[el1.system] },
          element2: { name: el2.name, system: SYSTEM_NAMES[el2.system] },
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Create new element
        const newElement: Element = {
          id: `discovered-${Date.now()}`,
          name: data.name,
          system: el1.system,
          parents: [el1.id, el2.id],
          discoveredAt: new Date().toISOString(),
        };

        // Add to discoveries
        const updatedDiscoveries = [...discoveries, newElement];
        setDiscoveries(updatedDiscoveries);
        setAllElements([...BASE_ELEMENTS, ...updatedDiscoveries]);
        saveDiscoveries(updatedDiscoveries);

        // Replace parent elements with the new combined element on canvas
        const el1Canvas = canvasElements.find((ce) => ce.element.id === elementId1);
        const el2Canvas = canvasElements.find((ce) => ce.element.id === elementId2);

        // Remove both parent elements from canvas and add new element at el1's position
        if (el1Canvas || el2Canvas) {
          const position = el1Canvas ? el1Canvas.position : el2Canvas!.position;

          const newCanvasElement: CanvasElementType = {
            element: newElement,
            position,
          };

          // Filter out parent elements and add the new combined element
          const updatedCanvas = canvasElements
            .filter((ce) => ce.element.id !== elementId1 && ce.element.id !== elementId2)
            .concat(newCanvasElement);

          setCanvasElements(updatedCanvas);
          saveCanvasElements(updatedCanvas);
        }
      }
    } catch (error) {
      console.error('Failed to combine:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCanvas = () => {
    setCanvasElements([]);
    clearCanvasElements();
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen overflow-hidden">
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Anything Goes</h1>
              <p className="text-sm text-gray-600 mt-1">
                Drag elements to combine and discover new story possibilities
              </p>
            </div>
            <button
              onClick={handleClearCanvas}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              Clear Canvas
            </button>
          </header>

          <div className="flex-1 p-6">
            <Canvas canvasElements={canvasElements} onCombine={handleCombine} />
          </div>

          {isLoading && (
            <div className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg">
              Combining...
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <Sidebar allElements={allElements} discoveries={discoveries} />
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeElement ? (
          <div
            style={{ borderColor: SYSTEM_COLORS[activeElement.system] }}
            className="px-4 py-2 rounded-lg border-2 bg-white shadow-lg cursor-grabbing"
          >
            <div className="font-medium text-gray-900 text-sm">
              {activeElement.name}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
