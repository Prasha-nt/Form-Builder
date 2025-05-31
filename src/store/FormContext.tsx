import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormType, FormField, FieldType, FormResponse } from '../types/form';

interface FormContextType {
  forms: FormType[];
  currentForm: FormType | null;
  responses: Record<string, FormResponse[]>;
  createForm: (title: string) => string;
  updateForm: (form: FormType) => void;
  deleteForm: (formId: string) => void;
  getForm: (formId: string) => FormType | null;
  addField: (formId: string, type: FieldType) => void;
  updateField: (formId: string, field: FormField) => void;
  deleteField: (formId: string, fieldId: string) => void;
  reorderFields: (formId: string, newOrder: string[]) => void;
  submitResponse: (formId: string, data: Record<string, any>) => void;
  getResponses: (formId: string) => FormResponse[];
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const defaultFields: Record<FieldType, Omit<FormField, 'id'>> = {
  text: {
    type: 'text',
    label: 'Text Field',
    placeholder: 'Enter text here',
    required: false,
  },
  textarea: {
    type: 'textarea',
    label: 'Text Area',
    placeholder: 'Enter longer text here',
    required: false,
  },
  dropdown: {
    type: 'dropdown',
    label: 'Dropdown',
    options: ['Option 1', 'Option 2', 'Option 3'],
    placeholder: 'Select an option',
    required: false,
  },
  checkbox: {
    type: 'checkbox',
    label: 'Checkbox Group',
    options: ['Option 1', 'Option 2', 'Option 3'],
    required: false,
  },
  date: {
    type: 'date',
    label: 'Date Field',
    required: false,
  }
};

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [forms, setForms] = useState<FormType[]>(() => {
    const savedForms = localStorage.getItem('forms');
    return savedForms ? JSON.parse(savedForms) : [];
  });
  
  const [currentForm, setCurrentForm] = useState<FormType | null>(null);
  
  const [responses, setResponses] = useState<Record<string, FormResponse[]>>(() => {
    const savedResponses = localStorage.getItem('responses');
    return savedResponses ? JSON.parse(savedResponses) : {};
  });

  useEffect(() => {
    localStorage.setItem('forms', JSON.stringify(forms));
  }, [forms]);

  useEffect(() => {
    localStorage.setItem('responses', JSON.stringify(responses));
  }, [responses]);

  const createForm = (title: string): string => {
    const newForm: FormType = {
      id: uuidv4(),
      title,
      fields: [],
      steps: [{ id: uuidv4(), title: 'Step 1', fields: [] }],
      currentStep: 0,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };

    setForms((prev) => [...prev, newForm]);
    setCurrentForm(newForm);
    return newForm.id;
  };

  const updateForm = (form: FormType) => {
    form.updated = new Date().toISOString();
    setForms((prev) => prev.map((f) => (f.id === form.id ? form : f)));
    if (currentForm?.id === form.id) {
      setCurrentForm(form);
    }
  };

  const deleteForm = (formId: string) => {
    setForms((prev) => prev.filter((form) => form.id !== formId));
    if (currentForm?.id === formId) {
      setCurrentForm(null);
    }
  };

  const getForm = (formId: string): FormType | null => {
    const form = forms.find((form) => form.id === formId) || null;
    if (form && form.id !== currentForm?.id) {
      setCurrentForm(form);
    }
    return form;
  };

  const addField = (formId: string, type: FieldType) => {
    const form = forms.find((form) => form.id === formId);
    if (!form) return;

    const newField: FormField = {
      id: uuidv4(),
      ...defaultFields[type],
    };

    const updatedForm = {
      ...form,
      fields: [...form.fields, newField],
      steps: form.steps.map((step, index) => 
        index === form.currentStep
          ? { ...step, fields: [...step.fields, newField.id] }
          : step
      ),
      updated: new Date().toISOString(),
    };

    updateForm(updatedForm);
  };

  const updateField = (formId: string, field: FormField) => {
    const form = forms.find((form) => form.id === formId);
    if (!form) return;

    const updatedForm = {
      ...form,
      fields: form.fields.map((f) => (f.id === field.id ? field : f)),
      updated: new Date().toISOString(),
    };

    updateForm(updatedForm);
  };

  const deleteField = (formId: string, fieldId: string) => {
    const form = forms.find((form) => form.id === formId);
    if (!form) return;

    const updatedForm = {
      ...form,
      fields: form.fields.filter((field) => field.id !== fieldId),
      steps: form.steps.map((step) => ({
        ...step,
        fields: step.fields.filter((id) => id !== fieldId),
      })),
      updated: new Date().toISOString(),
    };

    updateForm(updatedForm);
  };

  const reorderFields = (formId: string, newOrder: string[]) => {
    const form = forms.find((form) => form.id === formId);
    if (!form) return;

    const updatedForm = {
      ...form,
      steps: form.steps.map((step, index) =>
        index === form.currentStep ? { ...step, fields: newOrder } : step
      ),
      updated: new Date().toISOString(),
    };

    updateForm(updatedForm);
  };

  const submitResponse = (formId: string, data: Record<string, any>) => {
    const response: FormResponse = {
      id: uuidv4(),
      formId,
      data,
      submittedAt: new Date().toISOString(),
    };

    setResponses((prev) => ({
      ...prev,
      [formId]: [...(prev[formId] || []), response],
    }));
  };

  const getResponses = (formId: string): FormResponse[] => {
    return responses[formId] || [];
  };

  return (
    <FormContext.Provider
      value={{
        forms,
        currentForm,
        responses,
        createForm,
        updateForm,
        deleteForm,
        getForm,
        addField,
        updateField,
        deleteField,
        reorderFields,
        submitResponse,
        getResponses,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};