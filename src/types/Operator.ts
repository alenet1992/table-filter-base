export interface Operator {
  id: string;
  text: string;
}

export type OperatorType = 'equals' | 'greater_than' | 'less_than' | 'any' | 'none' | 'in' | 'contains';

export interface FilterOperatorFunction {
  (value: any, filterValue?: any): boolean;
}

export interface FilterOperators {
  [key: string]: FilterOperatorFunction;
}