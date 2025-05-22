// src/components/FormDetail.tsx

import React from 'react';
import { FormNode, PrefillMapping } from '../types';
import { FieldRow } from './FieldRow';

interface Props {
  form: FormNode;
  forms: FormNode[];
  mapping: PrefillMapping;
  onUpdateMapping: (fieldId: string, sourceFormId: string, sourceFieldId: string) => void;
  onClearMapping: (fieldId: string) => void;
}

const FormDetails: React.FC<Props> = ({
  form,
  forms,
  mapping,
  onUpdateMapping,
  onClearMapping,
}) => {
  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', marginTop: '1rem' }}>
      <h2>Form: {form.name}</h2>

      {form.fields.map((field) => (
        <FieldRow
          key={field.id}
          field={field}
          currentMapping={mapping[field.id]}
          onSet={onUpdateMapping}
          onClear={() => onClearMapping(field.id)}
          form={form}
          allForms={forms}
        />
      ))}
    </div>
  );
};

export default FormDetails;