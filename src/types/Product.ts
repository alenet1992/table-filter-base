export interface PropertyValue {
  property_id: number;
  value: string | number;
}

export interface Product {
  id: number;
  property_values: PropertyValue[];
}