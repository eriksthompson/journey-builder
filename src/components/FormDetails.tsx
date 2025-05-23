// src/components/FormDetail.tsx

import React, { useState } from 'react';
import { FormNode, FormField } from '../types';

interface FormDetailsProps {
  form: FormNode;
  onPrefillClick: (fieldId: string) => void;
  onSubmit: (formData: any) => void;  // add this line
}
const FormDetails: React.FC<FormDetailsProps> = ({ form, onPrefillClick, onSubmit }) => {
  // Initialize local form data state with empty strings or arrays for each field
  const initialFormData = form.data.fields?.reduce<Record<string, any>>((acc, field) => {
    acc[field.id] = ''; // you can customize initial value based on type if needed
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); //Call the passed onSubmit with the collected form data
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Fill form: {form.data.name}</h2>
      {form?.data?.fields?.map((field) => {
        const value = formData?.[field.id] ?? '';

        switch (field.type) {
          case 'short-text':
          case 'string':
          case 'email':
            return (
              <div key={field.id} style={{ marginBottom: '1rem' }}>
                <label>
                  {field.name} {field.required ? '*' : ''}
                  <input
                    type={field.format === 'email' ? 'email' : 'text'}
                    value={value}
                    required={field.required}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  />
                </label>
                <button type="button" onClick={() => onPrefillClick(field.id)}>
                  Prefill
                </button>
              </div>
            );

          case 'checkbox-group':
          case 'multi-select':
            return (
              <div key={field.id} style={{ marginBottom: '1rem' }}>
                <label>{field.name}</label>
                {field.items?.enum?.map((option: string) => (
                  <label key={option} style={{ display: 'block' }}>
                    <input
                      type="checkbox"
                      checked={Array.isArray(value) && value.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleChange(field.id, [...(value || []), option]);
                        } else {
                          handleChange(field.id, (value || []).filter((v: string) => v !== option));
                        }
                      }}
                    />
                    {option}
                  </label>
                ))}
                <button type="button" onClick={() => onPrefillClick(field.id)}>
                  Prefill
                </button>
              </div>
            );

          // Add more types like 'button', 'object-enum' if needed
          default:
            return (
              <div key={field.id} style={{ marginBottom: '1rem' }}>
                <label>
                  {field.name}
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  />
                </label>
                <button type="button" onClick={() => onPrefillClick(field.id)}>
                  Prefill
                </button>
              </div>
            );
        }
      })}
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormDetails;
