export interface BlueprintGraphResponse { 
  nodes: FormNode[];
}

export interface FormData {
  id: string;
  component_key: string;
  component_type: string;
  component_id: string;
  name: string;
  //prerequisites: string[];       // IDs of forms this form depends on (must be completed first)
  permitted_roles: string[];
  approval_required: boolean;
  approval_roles: string[];
  fields?: FormField[];          // add fields here to represent form fields if possible
}

export interface FormNode {
  id: string;                   // node ID like 'form-abc123'
  type: 'form';
  data: FormData;
  dependsOn: string[];          // Upstream forms that populate current one
  prerequisites: string[];   // Downstream forms that get populated.
  position: any;
}
export interface FormField {
  id: string; // key from field_schema.properties
  name: string; // usually comes from `title` in schema
  type: string; // avantos_type or fallback to JSON schema type
  required?: boolean; // optional flag if field is required
  enum?: string[] | { title: string }[]; // optional enum values for selects
  format?: string; // like 'email'
  items?: any; // for array fields (like checkbox-group or multi-select)
  avantos_type?: string; // explicitly typed avantos extension
  originalSchema?: any; // keep raw schema in case you need extra details
  field_schema?: any;

}

export interface PrefillMapping {
  [fieldId: string]: {
    sourceFormId: string;
    sourceFieldId: string;
  }
}