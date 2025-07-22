import { Product } from './Product';
import { Property } from './Property';
import { Operator } from './Operator';

export interface Datastore {
  getProducts: () => Product[];
  getProperties: () => Property[];
  getOperators: () => Operator[];
  products: Product[];
  properties: Property[];
  operators: Operator[];
}