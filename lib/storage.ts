import { Element, CanvasElement } from './types';

const STORAGE_KEY = 'anything-goes-discoveries';
const CANVAS_STORAGE_KEY = 'anything-goes-canvas';
const CONCRETE_STORAGE_KEY = 'anything-goes-concrete';

export function saveDiscoveries(elements: Element[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(elements));
  } catch (error) {
    console.error('Failed to save discoveries:', error);
  }
}

export function loadDiscoveries(): Element[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load discoveries:', error);
    return [];
  }
}

export function clearDiscoveries(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear discoveries:', error);
  }
}

export function saveCanvasElements(canvasElements: CanvasElement[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CANVAS_STORAGE_KEY, JSON.stringify(canvasElements));
  } catch (error) {
    console.error('Failed to save canvas elements:', error);
  }
}

export function loadCanvasElements(): CanvasElement[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CANVAS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load canvas elements:', error);
    return [];
  }
}

export function clearCanvasElements(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CANVAS_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear canvas elements:', error);
  }
}

export function saveConcreteElements(elements: Element[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CONCRETE_STORAGE_KEY, JSON.stringify(elements));
  } catch (error) {
    console.error('Failed to save concrete elements:', error);
  }
}

export function loadConcreteElements(): Element[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CONCRETE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load concrete elements:', error);
    return [];
  }
}

export function clearConcreteElements(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CONCRETE_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear concrete elements:', error);
  }
}
