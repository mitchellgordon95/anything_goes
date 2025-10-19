'use client';

import { useState, useEffect } from 'react';
import { SystemType, SYSTEM_NAMES } from '@/lib/types';

interface CustomElementModalProps {
  initialName: string;
  onSave: (name: string, system: SystemType, description: string) => void;
  onCancel: () => void;
}

export function CustomElementModal({
  initialName,
  onSave,
  onCancel,
}: CustomElementModalProps) {
  const [name, setName] = useState(initialName);
  const [system, setSystem] = useState<SystemType>('story-particles');
  const [description, setDescription] = useState('');
  const [isLoadingDescription, setIsLoadingDescription] = useState(true);
  const [error, setError] = useState('');

  // Generate description on mount
  useEffect(() => {
    const generateDescription = async () => {
      setIsLoadingDescription(true);
      setError('');

      try {
        const response = await fetch('/api/generate-description', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: initialName,
            system: SYSTEM_NAMES[system],
          }),
        });

        const data = await response.json();

        if (data.success) {
          setDescription(data.description);
        } else {
          setError('Failed to generate description');
          setDescription('');
        }
      } catch (err) {
        console.error('Error generating description:', err);
        setError('Failed to generate description');
        setDescription('');
      } finally {
        setIsLoadingDescription(false);
      }
    };

    generateDescription();
  }, [initialName, system]);

  const handleSave = () => {
    // Validate name
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Name cannot be empty');
      return;
    }

    if (trimmedName.length > 50) {
      setError('Name must be 50 characters or less');
      return;
    }

    if (!description.trim()) {
      setError('Description cannot be empty');
      return;
    }

    onSave(trimmedName, system, description.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Create Custom Element
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Element Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter element name..."
              maxLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">
              {name.length}/50 characters
            </p>
          </div>

          {/* System Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              System
            </label>
            <select
              value={system}
              onChange={(e) => setSystem(e.target.value as SystemType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {(Object.keys(SYSTEM_NAMES) as SystemType[]).map((sys) => (
                <option key={sys} value={sys}>
                  {SYSTEM_NAMES[sys]}
                </option>
              ))}
            </select>
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            {isLoadingDescription ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm min-h-24 flex items-center justify-center">
                Generating description...
              </div>
            ) : (
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setError('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-24 resize-y"
                placeholder="Enter description..."
              />
            )}
            <p className="text-xs text-gray-500 mt-1">
              Trading card style flavor text
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={isLoadingDescription}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors text-sm"
          >
            Create Element
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
