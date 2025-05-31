import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from '../store/FormContext';
import { ArrowLeft, Save, Eye, Undo, Redo, Smartphone, Tablet, Monitor, Plus, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { FieldPalette } from '../components/form-builder/FieldPalette';
import { BuilderCanvas } from '../components/form-builder/BuilderCanvas';
import { FieldConfigPanel } from '../components/form-builder/FieldConfigPanel';
import { ProgressBar } from '../components/form-builder/ProgressBar';

type PreviewMode = 'desktop' | 'tablet' | 'mobile';

const FormBuilder: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { getForm, updateForm } = useForm();
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const form = formId ? getForm(formId) : null;

  useEffect(() => {
    if (formId && !form) {
      navigate('/');
    }
  }, [formId, form, navigate]);

  if (!form) {
    return null;
  }

  const currentStepFields = form.steps[form.currentStep]?.fields || [];
  const selectedField = form.fields.find(field => field.id === selectedFieldId) || null;

  const handleSave = () => {
    setIsSaving(true);
    setSaveMessage('Saving...');
    
    // Simulate saving delay
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('✓ Saved');
      
      // Clear message after a delay
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    }, 800);
  };

  const handleFieldSelect = (fieldId: string) => {
    setSelectedFieldId(fieldId);
  };

  const handleAddStep = () => {
    if (!form) return;
    
    const newStepId = `step-${form.steps.length + 1}`;
    const newStep = {
      id: newStepId,
      title: `Step ${form.steps.length + 1}`,
      fields: [],
    };
    
    const updatedForm = {
      ...form,
      steps: [...form.steps, newStep],
      currentStep: form.steps.length,
    };
    
    updateForm(updatedForm);
  };

  const handleStepChange = (stepIndex: number) => {
    if (!form) return;
    
    const updatedForm = {
      ...form,
      currentStep: stepIndex,
    };
    
    updateForm(updatedForm);
    setSelectedFieldId(null);
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-surface-200 dark:border-surface-700">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>
          <h1 className="ml-4 text-2xl font-semibold text-surface-800 dark:text-white truncate">
            {form.title}
          </h1>
          {saveMessage && (
            <span className={`ml-4 text-sm ${isSaving ? 'text-surface-500 dark:text-surface-400' : 'text-success-600 dark:text-success-400'}`}>
              {saveMessage}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-surface-100 dark:bg-surface-800 p-1 rounded-lg flex space-x-1">
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
              icon={<Smartphone className="h-4 w-4" />}
              aria-label="Mobile preview"
            />
            <Button
              variant={previewMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('tablet')}
              icon={<Tablet className="h-4 w-4" />}
              aria-label="Tablet preview"
            />
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
              icon={<Monitor className="h-4 w-4" />}
              aria-label="Desktop preview"
            />
          </div>

          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<Undo className="h-4 w-4" />}
              aria-label="Undo"
            />
            <Button
              variant="ghost"
              size="sm"
              icon={<Redo className="h-4 w-4" />}
              aria-label="Redo"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/preview/${form.id}`)}
            icon={<Eye className="h-4 w-4" />}
          >
            Preview
          </Button>
          <Button
            onClick={handleSave}
            icon={<Save className="h-4 w-4" />}
            isLoading={isSaving}
            size="sm"
          >
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 h-[calc(100%-6rem)]">
        {/* Field Palette */}
        <div className="col-span-2 bg-white dark:bg-surface-800 rounded-xl shadow-sm p-4 overflow-auto">
          <FieldPalette formId={form.id} />
        </div>

        {/* Canvas */}
        <div className="col-span-7 bg-white dark:bg-surface-800 rounded-xl shadow-sm overflow-auto">
          <div className={`h-full flex flex-col items-center justify-start p-6 overflow-auto ${
            previewMode === 'mobile' ? 'max-w-xs' : previewMode === 'tablet' ? 'max-w-md' : ''
          } mx-auto`}>
            <BuilderCanvas
              formId={form.id}
              fields={form.fields.filter(field => currentStepFields.includes(field.id))}
              selectedFieldId={selectedFieldId}
              onFieldSelect={handleFieldSelect}
            />
          </div>
        </div>

        {/* Config Panel */}
        <div className="col-span-3 bg-white dark:bg-surface-800 rounded-xl shadow-sm p-4 overflow-auto">
          <FieldConfigPanel
            field={selectedField}
            formId={form.id}
            onClose={() => setSelectedFieldId(null)}
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
        <ProgressBar
          steps={form.steps.length}
          currentStep={form.currentStep}
          onStepChange={handleStepChange}
        />

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddStep}
            icon={<Plus className="h-4 w-4" />}
          >
            Add Step
          </Button>
          {form.steps.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Remove current step logic would go here
              }}
              icon={<Trash2 className="h-4 w-4" />}
            >
              Remove Step
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;