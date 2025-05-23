import { FormNode } from '../types';

export const buildAdjacencyMap = (forms: FormNode[]) => {
  const map: Record<string, string[]> = {};
  for (const form of forms) {
    map[form.id] = form.data.prerequisites;
  }
  return map;
};

export const topologicalSort = (forms: FormNode[]): string[] => {
  const adj = buildAdjacencyMap(forms);
  const visited = new Set<string>();
  const result: string[] = [];

  const dfs = (id: string, temp: Set<string>) => {
    if (temp.has(id)) throw new Error('Cycle detected');
    if (visited.has(id)) return;

    temp.add(id);
    for (const pre of adj[id] || []) dfs(pre, temp);
    temp.delete(id);

    visited.add(id);
    result.push(id);
  };

  for (const form of forms) {
    if (!visited.has(form.id)) dfs(form.id, new Set());
  }

  return result.reverse();
};