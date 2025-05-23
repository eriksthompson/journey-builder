// src/App.tsx

import React, { useEffect, useState } from 'react';
import FormDetails from './components/FormDetails';
import { FormNode, PrefillMapping, FormField} from './types';
import { fetchFormGraph, fetchForms } from './api';
import { topologicalSort } from './utils/dag';
import FormGraph from './components/FormGraph';
import PrefillModal from './components/PrefillModal';
const App: React.FC = () => {
  const [forms, setForms] = useState<FormNode[]>([]);
  const [selectedForm, setSelectedForm] = useState<FormNode | null>(null);
  const [mapping, setMapping] = useState<PrefillMapping>({});

  //Prefill Modal state
  const [prefillModalOpen, setPrefillModalOpen] = useState(false);
  const [currentFieldId, setCurrentFieldId] = useState<string | null>(null);
  const [formResponses, setFormResponses] = useState<Record<string, any>>({});
 useEffect(() => {
  const loadData = async () => {
    try {
      const graphData = await fetchFormGraph();
      const formDefs = await fetchForms();
      console.log(graphData);
      console.log(formDefs);
      const processedForms: FormNode[] = graphData.map((form: any) => {
        const matchingForm = formDefs.find((def) => def.id === form.data?.component_id);
        if (!matchingForm) {
          console.warn('No match for form component_id ${form.data?.component_id}');
           return null; // Skip unmatched forms

        }

        const fieldSchema = matchingForm.field_schema?.properties || {};
        const requiredFields = matchingForm.field_schema?.required || [];

        const fields: FormField[] = Object.entries(fieldSchema).map(
          ([key, value]: [string, any]) => ({
            id: key,
            name: value.title || key,
            type: value.avantos_type || value.type || 'string',
            required: requiredFields.includes(key),
            enum: value.enum,
            format: value.format,
            items: value.items,
            avantos_type: value.avantos_type,
            originalSchema: value,
          })
        );

        return {
          id: form.id,
          type: 'form',
          position: form.position,
          data: {
            ...form.data,
            fields,
          },
          prerequisites: form.data.prerequisites || [],
          dependsOn: form.data.prerequisites || [],
        } satisfies FormNode;
      }).filter(Boolean); // remove nulls

      console.log('Processed FormNodes:', processedForms);
      // Continue with setting state or other logic here
      setForms(processedForms);
    } catch (error) {
      console.error('Error loading form data:', error);
    }
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
// Called when user wants to prefill a field — open modal
  const openPrefillModalForField = (fieldId: string) => {
    setCurrentFieldId(fieldId);
    setPrefillModalOpen(true);
  };
  
  // Called when user selects a prefill source from modal
  const handlePrefillSelect = (sourceFormId: string, sourceFieldId: string) => {
    if (currentFieldId) {
      setMapping((prev) => ({
        ...prev,
        [currentFieldId]: { sourceFormId, sourceFieldId },
      }));
    }
    setCurrentFieldId(null);
    setPrefillModalOpen(false);
  };
  
  const upstreamForms = selectedForm
  ? forms.filter((f) => selectedForm.dependsOn.includes(f.id))
  : [];

const handleSavePrefill = () => {
  if (!selectedForm) return;

  // Create prefilled values from mapping
  const prefilledData: Record<string, any> = {};
  for (const [targetFieldId, { sourceFormId, sourceFieldId }] of Object.entries(mapping)) {
    const sourceResponse = formResponses[sourceFormId];
    if (sourceResponse) {
      prefilledData[targetFieldId] = sourceResponse[sourceFieldId];
    }
  }

  // Update current form's response with prefilled values
  setFormResponses((prev) => ({
    ...prev,
    [selectedForm.id]: {
      ...(prev[selectedForm.id] || {}),
      ...prefilledData,
    },
  }));

  // Optionally save immediately to backend
  fetch(`/api/save-form/${selectedForm.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prefilledData),
  })
  .then((res) => res.json())
  .then((data) => {
    console.log('Prefilled data saved to backend:', data);
  })
  .catch((err) => console.error('Error saving prefilled data', err));

  // Close modal
  setPrefillModalOpen(false);
};

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Journey Builder</h1>

      <label>Select a form to configure:</label>
      <select onChange={(e) => handleSelectForm(e.target.value)} defaultValue="">
        <option value="" disabled>
          Select a form
        </option>
        {forms.map((form) => (
          <option key={form.id} value={form.id}>
            {form.data.name}
          </option>
        ))}
      </select>

      <div style={{ height: '400px', margin: '10px 0' }}>
        <FormGraph forms={forms} />
      </div>

      {selectedForm && (
        <FormDetails
          form={selectedForm}
          onPrefillClick={openPrefillModalForField}
          onSubmit={(formData) => {
            if (selectedForm) {
              // Save to local state
              setFormResponses((prev) => ({
                ...prev,
                [selectedForm.id]: formData,
              }));

              // 🔄 Send to backend
              fetch(`/api/save-form/${selectedForm.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
              })
              .then((res) => res.json())
              .then((data) => {
                console.log('Saved to backend:', data);
              })
              .catch((err) => console.error('Save failed', err));
            }
          }}
        />
      )}
    {selectedForm && (
        <PrefillModal
          open={prefillModalOpen}
          onClose={() => setPrefillModalOpen(false)}
          onSelect={handlePrefillSelect}
          onSave={handleSavePrefill}
          upstreamForms={upstreamForms}
          formNode={selectedForm}
        />
      )}
    </div>
  );
};

export default App;