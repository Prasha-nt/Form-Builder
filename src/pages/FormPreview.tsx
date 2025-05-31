import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from '../store/FormContext';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import Button from '../components/ui/Button';

const FormPreview: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { getForm, submitResponse } = useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = formId ? getForm(formId) : null;

  useEffect(() => {
    if (formId && !form) {
      navigate('/');
    }
  }, [formId, form, navigate]);

  if (!form) {
    return null;
  }

  const currentStepFields = form.steps[currentStep]?.fields || [];
  const currentFields = form.fields.filter(field => currentStepFields.includes(field.id));
  
  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    currentFields.forEach(field => {
      if (field.required && (!formData[field.id] || formData[field.id] === '')) {
        newErrors[field.id] = `${field.label} is required`;
      }
      
      if (field.validation?.pattern && formData[field.id]) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(formData[field.id])) {
          newErrors[field.id] = field.validation.message || 'Invalid format';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleNextStep = () => {
    const isValid = validateStep();
    if (isValid) {
      if (currentStep < form.steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateStep();
    if (isValid) {
      submitResponse(form.id, formData);
      setIsSubmitted(true);
    }
  };

  const handleChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));
    
    // Clear error when user types
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto mt-10 animate-fade-in">
        <div className="bg-white dark:bg-surface-800 rounded-xl p-8 text-center shadow-sm">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-success-100 dark:bg-success-900 mb-4">
            <Check className="h-8 w-8 text-success-600 dark:text-success-300" />
          </div>
          <h2 className="text-2xl font-bold text-surface-800 dark:text-white mb-4">
            Thank you for your submission!
          </h2>
          <p className="text-surface-600 dark:text-surface-300 mb-6">
            Your form has been submitted successfully.
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => navigate('/')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-surface-800 dark:text-white">
            {form.title}
          </h1>
          <div className="text-sm text-surface-500 dark:text-surface-400">
            Step {currentStep + 1} of {form.steps.length}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label 
                htmlFor={field.id} 
                className="block text-sm font-medium text-surface-700 dark:text-surface-300"
              >
                {field.label}
                {field.required && <span className="ml-1 text-error-500 dark:text-error-400">*</span>}
              </label>
              
              {renderFormField(
                field,
                formData[field.id],
                (value) => handleChange(field.id, value)
              )}
              
              {errors[field.id] && (
                <p className="text-sm text-error-500 dark:text-error-400 mt-1">
                  {errors[field.id]}
                </p>
              )}
            </div>
          ))}
          
          <div className="flex justify-between pt-4 border-t border-surface-200 dark:border-surface-700">
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              icon={<ArrowLeft className="h-4 w-4 mr-2" />}
            >
              Previous
            </Button>
            
            {currentStep < form.steps.length - 1 ? (
              <Button 
                onClick={handleNextStep}
                icon={<ArrowRight className="h-4 w-4 ml-2" />}
                iconPosition="right"
              >
                Next
              </Button>
            ) : (
              <Button type="submit">
                Submit
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

const renderFormField = (
  field: FormField,
  value: any,
  onChange: (value: any) => void
) => {
  switch (field.type) {
    case 'text':
      return (
        <input
          type="text"
          id={field.id}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="block w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          required={field.required}
        />
      );
    case 'textarea':
      return (
        <textarea
          id={field.id}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className="block w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          required={field.required}
        />
      );
    case 'dropdown':
      return (
        <select
          id={field.id}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          required={field.required}
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
                id={`${field.id}-${index}`}
                checked={(value || []).includes(option)}
                onChange={(e) => {
                  const currentValues = value || [];
                  const newValues = e.target.checked
                    ? [...currentValues, option]
                    : currentValues.filter((val: string) => val !== option);
                  onChange(newValues);
                }}
                className="h-4 w-4 text-primary-600 border-surface-300 dark:border-surface-600 rounded focus:ring-primary-500"
              />
              <label htmlFor={`${field.id}-${index}`} className="ml-2 text-sm text-surface-700 dark:text-surface-300">
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
          id={field.id}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full px-3 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          required={field.required}
        />
      );
    default:
      return null;
  }
};

export default FormPreview;