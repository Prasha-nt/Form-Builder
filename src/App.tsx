import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';
import FormPreview from './pages/FormPreview';
import ResponsesDashboard from './pages/ResponsesDashboard';
import Layout from './components/layout/Layout';
import { FormProvider } from './store/FormContext';

function App() {
  return (
    <FormProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/builder/:formId" element={<FormBuilder />} />
          <Route path="/preview/:formId" element={<FormPreview />} />
          <Route path="/responses/:formId" element={<ResponsesDashboard />} />
        </Routes>
      </Layout>
    </FormProvider>
  );
}

export default App;