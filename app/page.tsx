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
import { Element, CanvasElement as CanvasElementType, SystemType } from '@/lib/types';
import { BASE_ELEMENTS } from '@/lib/baseElements';
import {
  loadDiscoveries,
  saveDiscoveries,
  loadCanvasElements,
  saveCanvasElements,
  clearCanvasElements,
  loadConcreteElements,
  saveConcreteElements,
} from '@/lib/storage';
import { Canvas } from '@/components/Canvas';
import { Sidebar } from '@/components/Sidebar';
import { CustomElementModal } from '@/components/CustomElementModal';
import { SYSTEM_NAMES, SYSTEM_COLORS, getSystemTypeFromName, ABSTRACT_SYSTEMS, isConcreteSystem } from '@/lib/types';

export default function Home() {
  const [discoveries, setDiscoveries] = useState<Element[]>([]); // Abstract combinations only
  const [concreteElements, setConcreteElements] = useState<Element[]>([]); // Crystallized elements
  const [canvasElements, setCanvasElements] = useState<CanvasElementType[]>([]);
  const [allElements, setAllElements] = useState<Element[]>(BASE_ELEMENTS);
  const [activeElement, setActiveElement] = useState<Element | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [rerollableElementId, setRerollableElementId] = useState<string | null>(null);
  const [rejectedNames, setRejectedNames] = useState<string[]>([]);
  const [crystallizationElements, setCrystallizationElements] = useState<Element[]>([]);
  const [crystallizationOutput, setCrystallizationOutput] = useState<Element | null>(null);
  const [elementsInLimbo, setElementsInLimbo] = useState<Set<string>>(new Set());
  const [shouldConsumeInputs, setShouldConsumeInputs] = useState(false);
  const [customElementName, setCustomElementName] = useState<string | null>(null);
  const [inspectedElement, setInspectedElement] = useState<Element | null>(null);
  const [selectedSystems, setSelectedSystems] = useState<Set<SystemType>>(
    new Set(ABSTRACT_SYSTEMS)
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Load saved data on mount and set mounted state
  useEffect(() => {
    const savedDiscoveries = loadDiscoveries();
    const savedConcrete = loadConcreteElements();
    const savedCanvas = loadCanvasElements();
    setDiscoveries(savedDiscoveries);
    setConcreteElements(savedConcrete);
    setCanvasElements(savedCanvas);
    setAllElements([...BASE_ELEMENTS, ...savedDiscoveries, ...savedConcrete]);
    setIsMounted(true);
  }, []);

  // Clear crystallization output when inputs change
  useEffect(() => {
    setCrystallizationOutput(null);
  }, [crystallizationElements]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveElement(active.data.current?.element || null);

    // Clear reroll state on any drag
    setRerollableElementId(null);
    setRejectedNames([]);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    const activeData = active.data.current;
    const overData = over?.data.current;

    console.log('Drag end:', {
      activeId: active.id,
      overId: over?.id,
      activeData: activeData,
      overData: overData
    });

    setActiveElement(null);

    // Case: Dragging canvas element off the canvas (delete it)
    if (activeData?.source === 'canvas' && !over) {
      const element = activeData.element;
      console.log('Removing element from canvas:', element.name);

      const updatedCanvas = canvasElements.filter(
        (ce) => ce.element.id !== element.id
      );
      setCanvasElements(updatedCanvas);
      saveCanvasElements(updatedCanvas);
      return;
    }

    // Case: Dragging from crystallization output to canvas
    if (activeData?.source === 'crystallization-output' && over?.id === 'canvas') {
      const outputElement = activeData.element;

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

      console.log('Committing crystallization output to canvas:', outputElement.name, 'consume:', shouldConsumeInputs);

      let updatedCanvas = [...canvasElements];

      if (shouldConsumeInputs) {
        // Remove all input elements from canvas
        const inputIds = new Set(crystallizationElements.map((e) => e.id));
        updatedCanvas = canvasElements.filter((ce) => !inputIds.has(ce.element.id));
      }

      // Add output element to canvas
      updatedCanvas.push({
        element: outputElement,
        position: dropPosition,
      });

      setCanvasElements(updatedCanvas);
      saveCanvasElements(updatedCanvas);

      // Clear crystallization state
      setCrystallizationElements([]);
      setCrystallizationOutput(null);
      setElementsInLimbo(new Set());
      setShouldConsumeInputs(false);

      return;
    }

    // Case: Dragging to crystallization zone
    if (over?.id === 'crystallization-zone') {
      const element = activeData?.element;
      if (element) {
        // Check if element is already in the zone
        const alreadyInZone = crystallizationElements.some(
          (e) => e.id === element.id
        );

        if (!alreadyInZone) {
          // Don't remove from canvas - instead add to limbo
          // Add to crystallization zone
          setCrystallizationElements([...crystallizationElements, element]);

          // Add to limbo (grey out on canvas)
          setElementsInLimbo(new Set([...elementsInLimbo, element.id]));

          // Clear output since inputs changed
          setCrystallizationOutput(null);
        }
      }
      return;
    }

    if (!over) {
      console.log('No drop target');
      return;
    }

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

    // Case 4: Moving a canvas element to a new position (or aborting crystallization)
    if (activeData?.source === 'canvas' && over.id === 'canvas' && !overData?.element) {
      const element = activeData.element;

      // Check if this is an abort gesture (element is in limbo)
      if (elementsInLimbo.has(element.id)) {
        console.log('Aborting crystallization for:', element.name);

        // Remove from crystallization zone
        setCrystallizationElements(
          crystallizationElements.filter((e) => e.id !== element.id)
        );

        // Remove from limbo
        const newLimbo = new Set(elementsInLimbo);
        newLimbo.delete(element.id);
        setElementsInLimbo(newLimbo);

        // Clear output if no elements left in crystallization
        if (crystallizationElements.length === 1) {
          setCrystallizationOutput(null);
        }

        return;
      }

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

    // Block combining crystallized elements (elements with concrete system types)
    const isEl1Concrete = isConcreteSystem(el1.system);
    const isEl2Concrete = isConcreteSystem(el2.system);

    if (isEl1Concrete || isEl2Concrete) {
      alert('Combining crystallized elements is not yet supported. Stay tuned for future updates!');
      return;
    }

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
        // Determine the system for the new element
        let elementSystem = el1.system; // Default to first element's system

        // If cross-system and API returned a system, use it
        if (data.system && el1.system !== el2.system) {
          const systemType = getSystemTypeFromName(data.system);
          if (systemType) {
            elementSystem = systemType;
          }
        }

        // Create new element
        const newElement: Element = {
          id: `discovered-${Date.now()}`,
          name: data.name,
          description: data.description,
          system: elementSystem,
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

        // Set reroll state for the newly created element
        setRerollableElementId(newElement.id);
        setRejectedNames([]);
      }
    } catch (error) {
      console.error('Failed to combine:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReroll = async (elementId: string) => {
    // Find the element to reroll
    const element = allElements.find((e) => e.id === elementId);
    if (!element || !element.parents) {
      console.error('Element not found or has no parents');
      return;
    }

    // Get parent elements
    const [parentId1, parentId2] = element.parents;
    const el1 = allElements.find((e) => e.id === parentId1);
    const el2 = allElements.find((e) => e.id === parentId2);

    if (!el1 || !el2) {
      console.error('Parent elements not found');
      return;
    }

    // Add current name to rejected names
    const updatedRejectedNames = [...rejectedNames, element.name];
    setRejectedNames(updatedRejectedNames);

    setIsLoading(true);
    try {
      const response = await fetch('/api/combine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          element1: { name: el1.name, system: SYSTEM_NAMES[el1.system] },
          element2: { name: el2.name, system: SYSTEM_NAMES[el2.system] },
          rejectedNames: updatedRejectedNames,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Determine the system for the new element
        let elementSystem = el1.system;
        if (data.system && el1.system !== el2.system) {
          const systemType = getSystemTypeFromName(data.system);
          if (systemType) {
            elementSystem = systemType;
          }
        }

        // Create new element with fresh ID
        const newElement: Element = {
          id: `discovered-${Date.now()}`,
          name: data.name,
          description: data.description,
          system: elementSystem,
          parents: [el1.id, el2.id],
          discoveredAt: new Date().toISOString(),
        };

        // Remove old element from discoveries
        const updatedDiscoveries = discoveries
          .filter((d) => d.id !== elementId)
          .concat(newElement);
        setDiscoveries(updatedDiscoveries);
        setAllElements([...BASE_ELEMENTS, ...updatedDiscoveries]);
        saveDiscoveries(updatedDiscoveries);

        // Update canvas if element is there
        const canvasElement = canvasElements.find((ce) => ce.element.id === elementId);
        if (canvasElement) {
          const updatedCanvas = canvasElements
            .filter((ce) => ce.element.id !== elementId)
            .concat({
              element: newElement,
              position: canvasElement.position,
            });
          setCanvasElements(updatedCanvas);
          saveCanvasElements(updatedCanvas);
        }

        // Update rerollable ID to the new element
        setRerollableElementId(newElement.id);
      }
    } catch (error) {
      console.error('Failed to reroll:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCrystallization = (elementId: string) => {
    const updatedElements = crystallizationElements.filter((e) => e.id !== elementId);
    setCrystallizationElements(updatedElements);

    // Remove from limbo
    const newLimbo = new Set(elementsInLimbo);
    newLimbo.delete(elementId);
    setElementsInLimbo(newLimbo);

    // Clear output if no elements left
    if (updatedElements.length === 0) {
      setCrystallizationOutput(null);
    }
  };

  const handleCrystallize = async (type: SystemType) => {
    if (crystallizationElements.length < 1) {
      console.error('Need at least 1 element to crystallize');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/crystallize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          elements: crystallizationElements.map((e) => ({
            name: e.name,
            system: SYSTEM_NAMES[e.system],
            description: e.description,
          })),
          type,
          consumeInputs: shouldConsumeInputs,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Create crystallized element
        const crystallizedElement: Element = {
          id: `crystallized-${Date.now()}`,
          name: data.name,
          description: data.description,
          system: type, // Set system to the concrete type selected
          discoveredAt: new Date().toISOString(),
        };

        // Add to concrete elements (not discoveries!)
        const updatedConcrete = [...concreteElements, crystallizedElement];
        setConcreteElements(updatedConcrete);
        setAllElements([...BASE_ELEMENTS, ...discoveries, ...updatedConcrete]);
        saveConcreteElements(updatedConcrete);

        // Set as output (don't add to canvas automatically)
        setCrystallizationOutput(crystallizedElement);

        // Don't clear crystallization zone - let user keep inputs
        // setCrystallizationElements([]);
      }
    } catch (error) {
      console.error('Failed to crystallize:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCanvas = () => {
    setCanvasElements([]);
    clearCanvasElements();

    // Also clear crystallization state
    setCrystallizationElements([]);
    setCrystallizationOutput(null);
    setElementsInLimbo(new Set());
    setShouldConsumeInputs(false);
  };

  const handleResetDiscoveries = () => {
    setDiscoveries([]);
    setAllElements(BASE_ELEMENTS);
    saveDiscoveries([]);
  };

  const handleCreateElement = (name: string) => {
    // Validate name length
    if (name.trim().length === 0 || name.trim().length > 50) {
      alert('Element name must be between 1 and 50 characters');
      return;
    }

    // Check for duplicates
    const isDuplicate = allElements.some(
      (el) => el.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (isDuplicate) {
      alert('An element with this name already exists');
      return;
    }

    // Show modal
    setCustomElementName(name.trim());
  };

  const handleSaveCustomElement = (
    name: string,
    system: SystemType,
    description: string
  ) => {
    // Double-check for duplicates with the final name
    const isDuplicate = allElements.some(
      (el) => el.name.toLowerCase() === name.toLowerCase()
    );

    if (isDuplicate) {
      alert('An element with this name already exists');
      return;
    }

    // Create custom element
    const customElement: Element = {
      id: `custom-${Date.now()}`,
      name,
      description,
      system,
      discoveredAt: new Date().toISOString(),
    };

    // Add to discoveries
    const updatedDiscoveries = [...discoveries, customElement];
    setDiscoveries(updatedDiscoveries);
    setAllElements([...BASE_ELEMENTS, ...updatedDiscoveries]);
    saveDiscoveries(updatedDiscoveries);

    // Update filter to show only the new element's system
    setSelectedSystems(new Set([system]));

    // Close modal
    setCustomElementName(null);
  };

  const handleCancelCustomElement = () => {
    setCustomElementName(null);
  };

  const handleHoverElement = (element: Element | null) => {
    setInspectedElement(element);
  };

  // Render basic UI without DnD during SSR/hydration
  if (!isMounted) {
    return (
      <div className="flex h-screen overflow-hidden">
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
            <Canvas
              canvasElements={canvasElements}
              onCombine={handleCombine}
              rerollableElementId={rerollableElementId}
              onReroll={handleReroll}
              crystallizationElements={crystallizationElements}
              onCrystallize={handleCrystallize}
              onRemoveFromCrystallization={handleRemoveFromCrystallization}
              onHoverElement={handleHoverElement}
              crystallizationOutput={crystallizationOutput}
              elementsInLimbo={elementsInLimbo}
              shouldConsumeInputs={shouldConsumeInputs}
              onConsumeInputsChange={setShouldConsumeInputs}
            />
          </div>
        </div>

        <Sidebar
          allElements={allElements}
          discoveries={discoveries}
          onResetDiscoveries={handleResetDiscoveries}
          onCreateElement={handleCreateElement}
          selectedSystems={selectedSystems}
          onSelectedSystemsChange={setSelectedSystems}
          inspectedElement={inspectedElement}
          onInspectedElementChange={setInspectedElement}
          elementsInLimbo={elementsInLimbo}
        />

        {customElementName && (
          <CustomElementModal
            initialName={customElementName}
            onSave={handleSaveCustomElement}
            onCancel={handleCancelCustomElement}
          />
        )}
      </div>
    );
  }

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
            <Canvas
              canvasElements={canvasElements}
              onCombine={handleCombine}
              rerollableElementId={rerollableElementId}
              onReroll={handleReroll}
              crystallizationElements={crystallizationElements}
              onCrystallize={handleCrystallize}
              onRemoveFromCrystallization={handleRemoveFromCrystallization}
              onHoverElement={handleHoverElement}
              crystallizationOutput={crystallizationOutput}
              elementsInLimbo={elementsInLimbo}
              shouldConsumeInputs={shouldConsumeInputs}
              onConsumeInputsChange={setShouldConsumeInputs}
            />
          </div>

          {isLoading && (
            <div className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg">
              Combining...
            </div>
          )}
        </div>

        {/* Sidebar */}
        <Sidebar
          allElements={allElements}
          discoveries={discoveries}
          onResetDiscoveries={handleResetDiscoveries}
          onCreateElement={handleCreateElement}
          selectedSystems={selectedSystems}
          onSelectedSystemsChange={setSelectedSystems}
          inspectedElement={inspectedElement}
          onInspectedElementChange={setInspectedElement}
          elementsInLimbo={elementsInLimbo}
        />
      </div>

      {customElementName && (
        <CustomElementModal
          initialName={customElementName}
          onSave={handleSaveCustomElement}
          onCancel={handleCancelCustomElement}
        />
      )}

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
