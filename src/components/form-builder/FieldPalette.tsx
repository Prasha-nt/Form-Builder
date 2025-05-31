import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useForm } from '../../store/FormContext';
import { FieldType } from '../../types/form';
import { Type, AlignLeft, ListFilter, CheckSquare, Calendar } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FieldPaletteProps {
  formId: string;
}

export const FieldPalette: React.FC<FieldPaletteProps> = ({ formId }) => {
  const { addField } = useForm();

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-surface-800 dark:text-white mb-4">Field Types</h3>
      <div className="space-y-2">
        <DraggableField
          type="text"
          label="Text Field"
          icon={<Type className="h-4 w-4" />}
          formId={formId}
          onAddField={addField}
        />
        <DraggableField
          type="textarea"
          label="Text Area"
          icon={<AlignLeft className="h-4 w-4" />}
          formId={formId}
          onAddField={addField}
        />
        <DraggableField
          type="dropdown"
          label="Dropdown"
          icon={<ListFilter className="h-4 w-4" />}
          formId={formId}
          onAddField={addField}
        />
        <DraggableField
          type="checkbox"
          label="Checkbox Group"
          icon={<CheckSquare className="h-4 w-4" />}
          formId={formId}
          onAddField={addField}
        />
        <DraggableField
          type="date"
          label="Date Field"
          icon={<Calendar className="h-4 w-4" />}
          formId={formId}
          onAddField={addField}
        />
      </div>
    </div>
  );
};

interface DraggableFieldProps {
  type: FieldType;
  label: string;
  icon: React.ReactNode;
  formId: string;
  onAddField: (formId: string, type: FieldType) => void;
}

const DraggableField: React.FC<DraggableFieldProps> = ({ type, label, icon, formId, onAddField }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `field-palette-${type}`,
    data: {
      type,
      isTemplate: true,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center p-3 bg-surface-50 dark:bg-surface-700 rounded-lg cursor-move transition-all",
        "hover:bg-surface-100 dark:hover:bg-surface-600 border border-surface-200 dark:border-surface-600",
        "shadow-sm hover:shadow",
        isDragging && "opacity-50"
      )}
      onClick={() => onAddField(formId, type)}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300">
        {icon}
      </div>
      <div className="ml-3 text-sm font-medium text-surface-700 dark:text-surface-300">
        {label}
      </div>
    </div>
  );
};