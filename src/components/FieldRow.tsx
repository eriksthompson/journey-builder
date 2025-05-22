import React from 'react';
import {FormField, PrefillMapping, FormNode } from '../types';

export const FieldRow: React.FC<{
    field: FormField;
    currentMapping?: PrefillMapping[string];
    onSet: (fieldId: string, sourceFormId: string, sourceFieldId: string) => void;
    onClear: () => void;
    form: FormNode;
    allForms: FormNode[];
}> = ({field, currentMapping, onSet, onClear }) => {
    return (
        <div style={{ marginBottom: '1rem' }}>
            <strong>{field.name}</strong>:
            {currentMapping ? (
                <span>
                    Prefilled from <code>{currentMapping.sourceFormId}.{currentMapping.sourceFieldId}</code>
                    <button onClick={onClear}> X </button>

                </span>
            ) : ( 
                <button onClick={() => {
                    onSet(field.id, 'form_a', 'email');
                
            }}>
             Set Prefill
            </button>
            )}
        </div>
    );
};