export interface BlueprintGraphResponse {
    nodes: FormNode[];
}
export interface FormData {
  id: string;
  component_key: string;
  component_type: string;
  component_id: string;
  name: string;
  prerequisites: string[];
  permitted_roles: string[];
  approval_required: boolean;
  approval_roles: string[];
}

export interface FormNode {
  id: string;           // node ID like 'form-abc123'
  type: 'form';
  data: FormData;
}
export interface FormField {
    id: string;
    name: string;
    type: string;
}
export interface PrefillMapping{
    [fieldId: string]:{
        sourceFormId: string;
        sourceFieldId: string;
    }
}