import { FormNode } from '../types';

export const buildAdjacencyMap = (forms: FormNode[]) => {
  const map: Record<string, string[]> = {};
  for (const form of forms) {
    map[form.id] = form.prerequisites;
  }
  return map;
};

/**
 * Performs a topological sort on the forms to determine the correct order.
 * @param forms - Array of FormNode objects.
 * @returns Sorted array of FormNode objects.
 */
export const topologicalSort = (forms: FormNode[]): FormNode[] => {
  const sorted: FormNode[] = [];
  const visited: Set<string> = new Set();
  const visiting: Set<string> = new Set(); // to detect cycles

  const visit = (form: FormNode) => {
    if (visited.has(form.id)) return;       // Already processed
    if (visiting.has(form.id)) {
      throw new Error(`Cycle detected at form: ${form.id}`);
    }

    visiting.add(form.id);

    if (form.dependsOn && Array.isArray(form.dependsOn)) {
      form.dependsOn.forEach((depId) => {
        const depForm = forms.find((f) => f.id === depId);
        if (depForm) visit(depForm);
        // else you could warn about missing dependency
      });
    }

    visiting.delete(form.id);
    visited.add(form.id);
    sorted.push(form);
  };

  forms.forEach((form) => {
    if (!visited.has(form.id)) visit(form);
  });

  return sorted.reverse(); // dependencies first, dependents last
};