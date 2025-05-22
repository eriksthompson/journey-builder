import React from 'react';
import { FormNode, FormField } from  '../types';

interface Props{
    isOpen: boolean;
    onClose: () =>void;
    onSelect: (sourceFormId: string, sourceFieldId: string ) => void;
    upstreamForms: FormNode[];
}
export const PrefillModal: React.FC<Props> = ({ isOpen, onClose, onSelect, upstreamForms }) => {
    if (!isOpen) return null;

    return (
        <div style={styles.backdrop}>
            <div style={styles.modal}>
                <h3> Select Prefill Source</h3>
                {upstreamForms.length === 0 && <p> No upstream forms available.</p>}
                {upstreamForms.map(form => (
                    <div key={form.id}>
                        <h4>{form.name}</h4>
                        <ul>
                            {form.fields.map(field => (
                                <li key={field.id}>
                                    <button
                                        onClick={() => {
                                            onSelect(form.id, field.id);
                                            onClose();
                                        }}
                                    >
                                        {field.name} ({field.id})
                                    </button>
                                </li>
                            ))}
                        </ul>
                </div>
            ))}
            <button onClick={onClose}> Cancel</button>
        </div>
    </div>
    );
};

const styles = {
    backdrop: {
        position: 'fixed' as const,
        top:0, left: 0, right:0, bottom:0,
        backgroundColor: 'rgba(0,0,0,0.4',
        display: 'flex',
        justifyContent: 'center',
        alignItems:'center'
    },
    modal: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '600px',
        width: '100%'
    }
};