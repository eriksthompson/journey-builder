// src/api.ts
import { FormNode } from './types';

export async function fetchFormGraph(): Promise<FormNode[]> {
  const res = await fetch('http://localhost:3000/api/graph');
  if (!res.ok) throw new Error('Failed to fetch form graph');
  return res.json();
}