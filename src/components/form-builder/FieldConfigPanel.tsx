import React from 'react';
import { useForm } from '../../store/FormContext';
import { FormField } from '../../types/form';
import Button from '../ui/Button';
import { X, Plus, Trash } from 'lucide-react';

interface FieldConfigPanelProps {
  field: FormField | null;
  formId: string;
  onClose: () => void;
}

export const FieldConfigPanel: React.FC<FieldConfigPanelProps> = ({ field, formId, onClose }) => {
  const { updateField } = useForm();

  if (!field) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200 mb-2">
          No field selected
        </h3>
        <p className="text-surface-500 dark:text-surface-400 mb-4">
          Select a field from the canvas to configure it
        </p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    const updatedField = {
      ...field,
      [name]: type === 'checkbox' ? checked : value,
    };
    
    updateField(formId, updatedField);
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!field.options) return;
    
    const updatedOptions = [...field.options];
    updatedOptions[index] = value;
    
    const updatedField = {
      ...field,
      options: updatedOptions,
    };
    
    updateField(formId, updatedField);
  };

  const handleAddOption = () => {
    const updatedOptions = field.options ? [...field.options, `Option ${field.options.length + 1}`] : ['Option 1'];
    
    const updatedField = {
      ...field,
      options: updatedOptions,
    };
    
    updateField(formId, updatedField);
  };

  const handleRemoveOption = (index: number) => {
    if (!field.options) return;
    
    const updatedOptions = [...field.options];
    updatedOptions.splice(index, 1);
    
    const updatedField = {
      ...field,
      options: updatedOptions,
    };
    
    updateField(formId, updatedField);
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-surface-200 dark:border-surface-700">
        <h3 className="font-medium text-surface-800 dark:text-white">
          Field Properties
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose} icon={<X className="h-4 w-4" />} aria-label="Close" />
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="label" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Field Label
          </label>
          <input
            type="text"
            id="label"
            name="label"
            value={field.label}
            onChange={handleChange}
            className="block w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {(field.type === 'text' || field.type === 'textarea' || field.type === 'dropdown') && (
          <div>
            <label htmlFor="placeholder" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Placeholder Text
            </label>
            <input
              type="text"
              id="placeholder"
              name="placeholder"
              value={field.placeholder || ''}
              onChange={handleChange}
              className="block w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="required"
            name="required"
            checked={field.required}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 border-surface-300 dark:border-surface-600 rounded focus:ring-primary-500"
          />
          <label htmlFor="required" className="ml-2 text-sm font-medium text-surface-700 dark:text-surface-300">
            Required field
          </label>
        </div>

        {(field.type === 'dropdown' || field.type === 'checkbox') && (
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Options
            </label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="block w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                    icon={<Trash className="h-4 w-4" />}
                    className="ml-2 text-error-500 hover:text-error-700 dark:text-error-400 dark:hover:text-error-300"
                    aria-label="Remove option"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                icon={<Plus className="h-4 w-4" />}
                className="mt-2"
              >
                Add Option
              </Button>
            </div>
          </div>
        )}

        {field.type === 'text' && (
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Validation
            </label>
            <div className="space-y-3">
              <div>
                <label htmlFor="validation.pattern" className="block text-xs text-surface-500 dark:text-surface-400 mb-1">
                  Pattern (RegEx)
                </label>
                <input
                  type="text"
                  id="validation.pattern"
                  name="validation.pattern"
                  value={field.validation?.pattern || ''}
                  onChange={(e) => {
                    const updatedField = {
                      ...field,
                      validation: {
                        ...(field.validation || {}),
                        pattern: e.target.value,
                      },
                    };
                    updateField(formId, updatedField);
                  }}
                  placeholder="^[a-zA-Z0-9]+$"
                  className="block w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-md shadow-sm text-xs focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label htmlFor="validation.message" className="block text-xs text-surface-500 dark:text-surface-400 mb-1">
                  Error Message
                </label>
                <input
                  type="text"
                  id="validation.message"
                  name="validation.message"
                  value={field.validation?.message || ''}
                  onChange={(e) => {
                    const updatedField = {
                      ...field,
                      validation: {
                        ...(field.validation || {}),
                        message: e.target.value,
                      },
                    };
                    updateField(formId, updatedField);
                  }}
                  placeholder="Please enter a valid value"
                  className="block w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-md shadow-sm text-xs focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};