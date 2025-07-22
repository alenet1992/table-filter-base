export interface Filter {
  propertyId: number;
  operator: string;
  value: string | string[] | null;
}