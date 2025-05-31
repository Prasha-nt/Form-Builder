import React from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { useForm } from '../../store/FormContext';
import { FormField, FieldType } from '../../types/form';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../../utils/cn';
import { Grip, Trash2, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

interface BuilderCanvasProps {
  formId: string;
  fields: FormField[];
  selectedFieldId: string | null;
  onFieldSelect: (fieldId: string) => void;
}

export const BuilderCanvas: React.FC<BuilderCanvasProps> = ({ formId, fields, selectedFieldId, onFieldSelect }) => {
  const { addField, deleteField, reorderFields } = useForm();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id.toString();
    const overId = over.id.toString();
    
    if (activeId === overId) return;
    
    // If dragging from palette to canvas
    if (activeId.startsWith('field-palette-')) {
      const fieldType = active.data.current?.type as FieldType;
      if (fieldType) {
        addField(formId, fieldType);
      }
      return;
    }
    
    // Reordering within canvas
    const fieldIds = fields.map(field => field.id);
    const oldIndex = fieldIds.indexOf(activeId);
    const newIndex = fieldIds.indexOf(overId);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = [...fieldIds];
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, activeId);
      reorderFields(formId, newOrder);
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-surface-800 dark:text-white mb-4">
          Form Layout
        </h2>
        
        {fields.length === 0 ? (
          <div className="border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-lg p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
            <AlertCircle className="h-10 w-10 text-surface-400 dark:text-surface-500 mb-4" />
            <h3 className="text-lg font-medium text-surface-700 dark:text-surface-300 mb-2">
              No fields added yet
            </h3>
            <p className="text-surface-500 dark:text-surface-400 mb-4 max-w-xs">
              Drag fields from the left sidebar or click on a field type to add it to your form
            </p>
          </div>
        ) : (
          <SortableContext items={fields.map(field => field.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {fields.map((field) => (
                <FieldItem
                  key={field.id}
                  field={field}
                  isSelected={field.id === selectedFieldId}
                  onClick={() => onFieldSelect(field.id)}
                  onDelete={() => deleteField(formId, field.id)}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </DndContext>
  );
};

interface FieldItemProps {
  field: FormField;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const FieldItem: React.FC<FieldItemProps> = ({ field, isSelected, onClick, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "border rounded-lg p-4 bg-white dark:bg-surface-800 group transition-all",
        isSelected 
          ? "ring-2 ring-primary-500 border-primary-500 dark:ring-primary-400 dark:border-primary-400" 
          : "border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-700",
        isDragging && "opacity-50"
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div
            {...attributes}
            {...listeners}
            className="cursor-move p-1 mr-2 text-surface-400 hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300"
          >
            <Grip className="h-4 w-4" />
          </div>
          <span className="font-medium text-surface-700 dark:text-surface-300">
            {field.label}
          </span>
          {field.required && (
            <span className="ml-2 text-xs text-error-500 dark:text-error-400">Required</span>
          )}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            icon={<Trash2 className="h-4 w-4" />}
            aria-label="Delete field"
            className="text-error-500 hover:text-error-700 dark:text-error-400 dark:hover:text-error-300"
          />
        </div>
      </div>
      
      <div className="pl-7">
        {renderFieldPreview(field)}
      </div>
    </div>
  );
};

const renderFieldPreview = (field: FormField) => {
  switch (field.type) {
    case 'text':
      return (
        <input
          type="text"
          className="block w-full px-3 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-md shadow-sm text-surface-500 dark:text-surface-400"
          placeholder={field.placeholder}
          readOnly
          onClick={(e) => e.stopPropagation()}
        />
      );
    case 'textarea':
      return (
        <textarea
          className="block w-full px-3 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-md shadow-sm text-surface-500 dark:text-surface-400"
          placeholder={field.placeholder}
          rows={3}
          readOnly
          onClick={(e) => e.stopPropagation()}
        />
      );
    case 'dropdown':
      return (
        <select
          className="block w-full px-3 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-md shadow-sm text-surface-500 dark:text-surface-400"
          onClick={(e) => e.stopPropagation()}
        >
          <option value="">{field.placeholder || 'Select an option'}</option>
          {field.options?.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    case 'checkbox':
      return (
        <div className="space-y-2">
          {field.options?.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 border-surface-300 dark:border-surface-600 rounded"
                onClick={(e) => e.stopPropagation()}
              />
              <label className="ml-2 text-sm text-surface-700 dark:text-surface-300">
                {option}
              </label>
            </div>
          ))}
        </div>
      );
    case 'date':
      return (
        <input
          type="date"
          className="block w-full px-3 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-md shadow-sm text-surface-500 dark:text-surface-400"
          onClick={(e) => e.stopPropagation()}
        />
      );
    default:
      return null;
  }
};