import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from '../store/FormContext';
import { ArrowLeft, Download, Search, Filter } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';

const ResponsesDashboard: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { getForm, getResponses } = useForm();
  const [searchTerm, setSearchTerm] = useState('');

  const form = formId ? getForm(formId) : null;
  const responses = formId ? getResponses(formId) : [];

  useEffect(() => {
    if (formId && !form) {
      navigate('/');
    }
  }, [formId, form, navigate]);

  if (!form) {
    return null;
  }

  const handleExportCSV = () => {
    if (!responses.length) return;

    // Get all unique keys from all responses
    const allKeys = new Set<string>();
    responses.forEach((response) => {
      Object.keys(response.data).forEach((key) => allKeys.add(key));
    });
    
    const keys = Array.from(allKeys);
    
    // Create CSV header
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += ['Submission ID', 'Submitted At', ...keys].join(',') + '\n';
    
    // Add data rows
    responses.forEach((response) => {
      const row = [
        response.id,
        new Date(response.submittedAt).toLocaleString(),
        ...keys.map((key) => {
          const value = response.data[key];
          // Handle arrays and objects by stringifying them
          if (Array.isArray(value)) {
            return `"${value.join(', ')}"`;
          } else if (typeof value === 'object' && value !== null) {
            return `"${JSON.stringify(value)}"`;
          }
          return value || '';
        }),
      ];
      csvContent += row.join(',') + '\n';
    });
    
    // Create and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${form.title}_responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredResponses = responses.filter((response) => {
    if (!searchTerm) return true;
    
    // Search in all data values
    return Object.values(response.data).some((value) => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchTerm.toLowerCase());
      }
      if (Array.isArray(value)) {
        return value.some((item) => 
          typeof item === 'string' && item.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return false;
    });
  });

  return (
    <div className="animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            icon={<ArrowLeft className="h-5 w-5" />}
            aria-label="Back to dashboard"
          />
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
              Responses: {form.title}
            </h1>
            <p className="text-surface-500 dark:text-surface-400">
              {responses.length} {responses.length === 1 ? 'response' : 'responses'} received
            </p>
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-surface-400 dark:text-surface-500" />
            </div>
            <input
              type="text"
              placeholder="Search responses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <Button
            variant="outline"
            icon={<Filter className="h-4 w-4" />}
            size="sm"
          >
            Filter
          </Button>

          <Button
            onClick={handleExportCSV}
            icon={<Download className="h-4 w-4" />}
            size="sm"
            disabled={responses.length === 0}
          >
            Export CSV
          </Button>
        </div>
      </header>

      {responses.length === 0 ? (
        <EmptyState
          title="No responses yet"
          description="Share your form to start collecting responses"
          action={
            <Button
              onClick={() => navigate(`/builder/${form.id}`)}
            >
              Back to Editor
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {filteredResponses.map((response) => (
            <Card key={response.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    Submitted on {new Date(response.submittedAt).toLocaleString()}
                  </p>
                  <div className="text-xs font-mono text-surface-400 dark:text-surface-500">
                    ID: {response.id.substring(0, 8)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {form.fields.map((field) => {
                    const value = response.data[field.id];
                    if (value === undefined || value === null || value === '') return null;

                    return (
                      <div key={field.id}>
                        <div className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          {field.label}
                        </div>
                        <div className="text-surface-800 dark:text-white break-words">
                          {Array.isArray(value) ? value.join(', ') : value.toString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResponsesDashboard;