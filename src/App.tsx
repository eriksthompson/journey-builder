// src/App.tsx

import React, { useEffect, useState } from 'react';
import FormDetails from './components/FormDetails';
import { FormNode, PrefillMapping } from './types';
import { fetchFormGraph } from './api';

const App: React.FC = () => {
  const [forms, setForms] = useState<FormNode[]>([]);
  const [selectedForm, setSelectedForm] = useState<FormNode | null>(null);
  const [mapping, setMapping] = useState<PrefillMapping>({});

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchFormGraph();
      setForms(data);
    };

    loadData();
  }, []);

  const handleSelectForm = (formId: string) => {
    const form = forms.find((f) => f.id === formId) || null;
    setSelectedForm(form);
  };

  const handleUpdateMapping = (fieldId: string, sourceFormId: string, sourceFieldId: string) => {
    setMapping((prev) => ({
      ...prev,
      [fieldId]: { sourceFormId, sourceFieldId },
    }));
  };

  const handleClearMapping = (fieldId: string) => {
    setMapping((prev) => {
      const updated = { ...prev };
      delete updated[fieldId];
      return updated;
    });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Journey Builder</h1>

      <label>Select a form to configure:</label>
      <select onChange={(e) => handleSelectForm(e.target.value)} defaultValue="">
        <option value="" disabled>Select a form</option>
        {forms.map((form) => (
          <option key={form.id} value={form.id}>
            {form.name}
          </option>
        ))}
      </select>

      {selectedForm && (
        <FormDetails
          form={selectedForm}
          forms={forms}
          mapping={mapping}
          onUpdateMapping={handleUpdateMapping}
          onClearMapping={handleClearMapping}
        />
      )}
    </div>
  );
};

export default App;