export interface Property {
  id: number;
  name: string;
  type: 'string' | 'number' | 'enumerated';
  values?: string[];
}

export type PropertyType = 'string' | 'number' | 'enumerated';