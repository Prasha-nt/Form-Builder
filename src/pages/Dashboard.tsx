import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../store/FormContext';
import { FileText, Edit2, Eye, BarChart3, Share2, Trash2, Plus } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { forms, createForm, deleteForm } = useForm();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState('');
  const [formToDelete, setFormToDelete] = useState<string | null>(null);

  const handleCreateForm = () => {
    if (newFormTitle.trim()) {
      const formId = createForm(newFormTitle.trim());
      setIsCreateModalOpen(false);
      setNewFormTitle('');
      navigate(`/builder/${formId}`);
    }
  };

  const handleDeleteForm = () => {
    if (formToDelete) {
      deleteForm(formToDelete);
      setFormToDelete(null);
    }
  };

  const handleShareForm = (formId: string) => {
    // Generate a shareable link
    const link = `${window.location.origin}/preview/${formId}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Forms Dashboard</h1>
          <p className="mt-2 text-surface-500 dark:text-surface-400">
            Create, manage, and track your forms
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="mt-4 md:mt-0"
          icon={<Plus className="h-4 w-4" />}
        >
          Create New Form
        </Button>
      </header>

      {forms.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-12 w-12 text-primary-500" />}
          title="No forms yet"
          description="Create your first form to get started"
          action={
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              icon={<Plus className="h-4 w-4" />}
            >
              Create New Form
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form.id} className="hover:shadow-medium transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-surface-800 dark:text-white truncate">
                    {form.title}
                  </h2>
                </div>
                <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
                  {new Date(form.updated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
                  {form.fields.length} fields • {form.steps.length} steps
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/builder/${form.id}`)}
                    icon={<Edit2 className="h-4 w-4" />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/preview/${form.id}`)}
                    icon={<Eye className="h-4 w-4" />}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShareForm(form.id)}
                    icon={<Share2 className="h-4 w-4" />}
                  >
                    Share
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/responses/${form.id}`)}
                    icon={<BarChart3 className="h-4 w-4" />}
                  >
                    Responses
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormToDelete(form.id)}
                    icon={<Trash2 className="h-4 w-4" />}
                    className="text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-900/20"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Form Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Form"
      >
        <div className="mt-4">
          <label htmlFor="formTitle" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
            Form Title
          </label>
          <input
            type="text"
            id="formTitle"
            value={newFormTitle}
            onChange={(e) => setNewFormTitle(e.target.value)}
            placeholder="Enter form title"
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            autoFocus
          />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateForm} disabled={!newFormTitle.trim()}>
            Create Form
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!formToDelete}
        onClose={() => setFormToDelete(null)}
        title="Delete Form"
      >
        <div className="mt-4">
          <p className="text-surface-700 dark:text-surface-300">
            Are you sure you want to delete this form? This action cannot be undone.
          </p>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setFormToDelete(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteForm}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;