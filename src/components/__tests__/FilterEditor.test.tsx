import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterEditor from '../FilterEditor';
import { Property, Operator, Filter } from '../../types';

const mockProperties: Property[] = [
  { id: 1, name: 'Product Name', type: 'string' },
  { id: 2, name: 'Price', type: 'number' },
  { id: 3, name: 'Category', type: 'enumerated', values: ['Electronics', 'Clothing', 'Books'] }
];

const mockOperators: Operator[] = [
  { id: 'equals', text: 'Equals' },
  { id: 'greater_than', text: 'Greater than' },
  { id: 'less_than', text: 'Less than' },
  { id: 'any', text: 'Any' },
  { id: 'none', text: 'None' },
  { id: 'in', text: 'In' },
  { id: 'contains', text: 'Contains' }
];

const defaultProps = {
  properties: mockProperties,
  operators: mockOperators,
  onFilterChange: jest.fn(),
  currentFilter: null,
  onClearFilter: jest.fn()
};

describe('FilterEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form elements', () => {
    render(<FilterEditor {...defaultProps} />);
    
    expect(screen.getByText('Property')).toBeInTheDocument();
    expect(screen.getByText('Operator')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply filter/i })).toBeInTheDocument();
  });

  it('displays all properties in the property dropdown', () => {
    render(<FilterEditor {...defaultProps} />);
    
    const propertySelect = screen.getByDisplayValue('Select a property');
    fireEvent.click(propertySelect);
    
    expect(screen.getByText('Product Name')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('filters operators based on selected property type', () => {
    render(<FilterEditor {...defaultProps} />);
    
    const propertySelect = screen.getByDisplayValue('Select a property');
    fireEvent.change(propertySelect, { target: { value: '2' } }); // Price (number)
    
    const operatorSelect = screen.getByDisplayValue('Select an operator');
    fireEvent.click(operatorSelect);
    
    expect(screen.getByText('Greater than')).toBeInTheDocument();
    expect(screen.getByText('Less than')).toBeInTheDocument();
    expect(screen.queryByText('Contains')).not.toBeInTheDocument();
  });

  it('shows value input for operators that need values', () => {
    render(<FilterEditor {...defaultProps} />);
    
    const propertySelect = screen.getByDisplayValue('Select a property');
    fireEvent.change(propertySelect, { target: { value: '1' } });
    
    const operatorSelect = screen.getByDisplayValue('Select an operator');
    fireEvent.change(operatorSelect, { target: { value: 'equals' } });
    
    expect(screen.getByText('Value')).toBeInTheDocument();
  });

  it('hides value input for operators that do not need values', () => {
    render(<FilterEditor {...defaultProps} />);
    
    const propertySelect = screen.getByDisplayValue('Select a property');
    fireEvent.change(propertySelect, { target: { value: '1' } });
    
    const operatorSelect = screen.getByDisplayValue('Select an operator');
    fireEvent.change(operatorSelect, { target: { value: 'any' } });
    
    expect(screen.queryByText('Value')).not.toBeInTheDocument();
  });

  it('renders enumerated dropdown for enumerated properties', () => {
    render(<FilterEditor {...defaultProps} />);
    
    const propertySelect = screen.getByDisplayValue('Select a property');
    fireEvent.change(propertySelect, { target: { value: '3' } }); 
    
    const operatorSelect = screen.getByDisplayValue('Select an operator');
    fireEvent.change(operatorSelect, { target: { value: 'equals' } });
    
    const valueSelect = screen.getByDisplayValue('Select value');
    expect(valueSelect.tagName).toBe('SELECT');
    
    fireEvent.click(valueSelect);
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Clothing')).toBeInTheDocument();
    expect(screen.getByText('Books')).toBeInTheDocument();
  });

  it('shows multiple values placeholder for "in" operator', () => {
    render(<FilterEditor {...defaultProps} />);
    
    const propertySelect = screen.getByDisplayValue('Select a property');
    fireEvent.change(propertySelect, { target: { value: '1' } });
    
    const operatorSelect = screen.getByDisplayValue('Select an operator');
    fireEvent.change(operatorSelect, { target: { value: 'in' } });
    
    const valueInput = screen.getByPlaceholderText(/enter values separated by commas/i);
    expect(valueInput).toBeInTheDocument();
  });

  it('calls onFilterChange with correct filter object when applying filter', () => {
    const mockOnFilterChange = jest.fn();
    render(<FilterEditor {...defaultProps} onFilterChange={mockOnFilterChange} />);
    
    const propertySelect = screen.getByDisplayValue('Select a property');
    fireEvent.change(propertySelect, { target: { value: '1' } });
    
    const operatorSelect = screen.getByDisplayValue('Select an operator');
    fireEvent.change(operatorSelect, { target: { value: 'equals' } });
    
    const valueInput = screen.getByPlaceholderText('Enter value');
    fireEvent.change(valueInput, { target: { value: 'test value' } });
    
    const applyButton = screen.getByRole('button', { name: /apply filter/i });
    fireEvent.click(applyButton);
    
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      propertyId: 1,
      operator: 'equals',
      value: 'test value'
    });
  });

  it('handles multiple values for "in" operator correctly', () => {
    const mockOnFilterChange = jest.fn();
    render(<FilterEditor {...defaultProps} onFilterChange={mockOnFilterChange} />);
    
    const propertySelect = screen.getByDisplayValue('Select a property');
    fireEvent.change(propertySelect, { target: { value: '1' } });
    
    const operatorSelect = screen.getByDisplayValue('Select an operator');
    fireEvent.change(operatorSelect, { target: { value: 'in' } });
    
    const valueInput = screen.getByPlaceholderText(/enter values separated by commas/i);
    fireEvent.change(valueInput, { target: { value: 'value1, value2, value3' } });
    
    const applyButton = screen.getByRole('button', { name: /apply filter/i });
    fireEvent.click(applyButton);
    
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      propertyId: 1,
      operator: 'in',
      value: ['value1', 'value2', 'value3']
    });
  });

  it('disables apply button when required fields are missing', () => {
    render(<FilterEditor {...defaultProps} />);
    
    const applyButton = screen.getByRole('button', { name: /apply filter/i });
    expect(applyButton).toBeDisabled();
    
    const propertySelect = screen.getByDisplayValue('Select a property');
    fireEvent.change(propertySelect, { target: { value: '1' } });
    expect(applyButton).toBeDisabled();
    
    const operatorSelect = screen.getByDisplayValue('Select an operator');
    fireEvent.change(operatorSelect, { target: { value: 'equals' } });
    expect(applyButton).toBeDisabled();
    
    const valueInput = screen.getByPlaceholderText('Enter value');
    fireEvent.change(valueInput, { target: { value: 'test' } });
    expect(applyButton).not.toBeDisabled();
  });

  it('shows clear button when current filter exists', () => {
    const currentFilter: Filter = {
      propertyId: 1,
      operator: 'equals',
      value: 'test'
    };
    
    render(<FilterEditor {...defaultProps} currentFilter={currentFilter} />);
    
    expect(screen.getByRole('button', { name: /clear filter/i })).toBeInTheDocument();
  });

  it('calls onClearFilter and resets form when clear button is clicked', () => {
    const mockOnClearFilter = jest.fn();
    const currentFilter: Filter = {
      propertyId: 1,
      operator: 'equals',
      value: 'test'
    };
    
    render(<FilterEditor {...defaultProps} currentFilter={currentFilter} onClearFilter={mockOnClearFilter} />);
    
    const clearButton = screen.getByRole('button', { name: /clear filter/i });
    fireEvent.click(clearButton);
    
    expect(mockOnClearFilter).toHaveBeenCalled();
  });

  it('resets operator and value when property changes', () => {
    render(<FilterEditor {...defaultProps} />);
    
    const propertySelect = screen.getByDisplayValue('Select a property');
    
    fireEvent.change(propertySelect, { target: { value: '1' } });
    const operatorSelect = screen.getByDisplayValue('Select an operator');
    fireEvent.change(operatorSelect, { target: { value: 'equals' } });
    
    fireEvent.change(propertySelect, { target: { value: '2' } });
    
    expect(operatorSelect).toHaveValue('');
  });

  it('resets value when operator changes', () => {
    render(<FilterEditor {...defaultProps} />);
    
    const propertySelect = screen.getByDisplayValue('Select a property');
    const operatorSelect = screen.getByDisplayValue('Select an operator');
    
    fireEvent.change(propertySelect, { target: { value: '1' } });
    fireEvent.change(operatorSelect, { target: { value: 'equals' } });
    
    const valueInput = screen.getByPlaceholderText('Enter value');
    fireEvent.change(valueInput, { target: { value: 'test' } });
    fireEvent.change(operatorSelect, { target: { value: 'contains' } });
    
    expect(valueInput).toHaveValue('');
  });
});