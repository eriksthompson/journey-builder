// src/api.ts
import { FormNode } from './types';

export async function fetchFormGraph(): Promise<FormNode[]> {
  const res = await fetch('http://localhost:3000/api/v1/123/actions/blueprints/bpv_123/graph');
  if (!res.ok) throw new Error('Failed to fetch form graph');
  const data = await res.json();
  return data.nodes;
}