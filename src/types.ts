export interface BlueprintGraphResponse {
    nodes: FormNode[];
}
export interface FormNode {
    id: string;
    name: string;
    fields: FormField[];
    dependsOn: string[];
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