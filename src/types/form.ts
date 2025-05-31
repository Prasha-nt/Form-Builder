export type FieldType = 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'date';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    message?: string;
  };
}

export interface FormStep {
  id: string;
  title: string;
  fields: string[]; // Array of field IDs
}

export interface FormType {
  id: string;
  title: string;
  fields: FormField[];
  steps: FormStep[];
  currentStep: number;
  created: string;
  updated: string;
}

export interface FormResponse {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
}