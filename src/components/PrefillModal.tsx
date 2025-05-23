import React, { useState, useEffect } from 'react';
import { FormNode, FormField } from '../types';  // Adjust import path accordingly

interface PrefillModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: Record<string, any>) => void;
  onSelect: (sourceFormId: string, sourceFieldId: string) => void;  // add this
  formNode: FormNode;                    // single form node with fields
  upstreamForms: FormNode[];
  initialValues?: Record<string, any>;  // prefill values keyed by field id
}

const PrefillModal: React.FC<PrefillModalProps> = ({
  open,
  onClose,
  onSave,
  formNode,
  upstreamForms,
  initialValues = {},
}) => {
  // Get fields from formNode.data.fields or empty array
  const fields: FormField[] = formNode?.data?.fields ?? [];

  const [formValues, setFormValues] = useState<Record<string, any>>(initialValues);

  const [prevInitialValues, setPrevInitialValues] = useState(initialValues);

  useEffect(() => {
    if (JSON.stringify(prevInitialValues) !== JSON.stringify(initialValues)) {
      setFormValues(initialValues);
      setPrevInitialValues(initialValues);
    }
  }, [initialValues, prevInitialValues]);

  const handleChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  // Basic input renderer for a FormField
  const renderField = (field: FormField) => {
    const value = formValues[field.id] ?? '';

    switch (field.type) {
      case 'text':
      case 'string':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(field.id, e.target.valueAsNumber)}
          />
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => handleChange(field.id, e.target.checked)}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
          />
        ); // fallback to text input
    }
  };

  const handleSave = () => {
    // Add validation if needed (example: require all fields to be filled)
    for (const field of fields) {
      if (formValues[field.id] === undefined || formValues[field.id] === '') {
        alert(`Please fill the field "${field.name}"`);
        return;
      }
    }
    onSave(formValues);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: 20,
          minWidth: 320,
          borderRadius: 8,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{formNode.data.name || 'Prefill Form'}</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          {fields.length === 0 && <p>No fields to display.</p>}

          {fields.map((field) => (
            <div key={field.id} style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>
                {field.name}
              </label>
              {renderField(field)}
            </div>
          ))}

          <div style={{ marginTop: 20, textAlign: 'right' }}>
            <button type="button" onClick={onClose} style={{ marginRight: 10 }}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrefillModal;