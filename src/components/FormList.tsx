import React from 'react';
import {FormNode} from '../types';

export const FormList: React.FC<{
    forms: FormNode[];
    onSelect: (id: string) => void;
}> = ({ forms, onSelect}) => (
    <ul>
        {forms.map(f => (
            <li key={f.id}>
                <button onClick= {() => onSelect(f.id)}>{f.data.name}</button>
            </li>
        ))}
    </ul>
);