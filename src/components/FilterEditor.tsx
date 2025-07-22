import React, { useState } from 'react';
import { Property, Operator, Filter, PropertyType, OperatorType } from '../types';

interface FilterEditorProps {
  properties: Property[];
  operators: Operator[];
  onFilterChange: (filter: Filter) => void;
  currentFilter: Filter | null;
  onClearFilter: () => void;
}

/**
 * Validate the filter value based on the operator and property type.
 */
const operatorMap: Record<PropertyType, OperatorType[]> = {
  string: ['equals', 'any', 'none', 'in', 'contains'],
  number: ['equals', 'greater_than', 'less_than', 'any', 'none', 'in'],
  enumerated: ['equals', 'any', 'none', 'in']
};

const IN = 'in';

const FilterEditor: React.FC<FilterEditorProps> = ({
  properties,
  operators,
  onFilterChange,
  currentFilter,
  onClearFilter
}) => {
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [selectedOperator, setSelectedOperator] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');

  const selectedPropertyObj = properties.find(p => p.id.toString() === selectedProperty);
  const validOperators = selectedPropertyObj ? operatorMap[selectedPropertyObj.type]: [];
  const availableOperators = operators.filter(op => validOperators.includes(op.id as any));

  const needsValue = !['any', 'none'].includes(selectedOperator);
  const isMultipleOperator = selectedOperator === IN;

  const handleApplyFilter = (): void => {
    if ((!selectedProperty || !selectedOperator) ||  (needsValue && !filterValue.trim())) {
       return;
    }
    
    const value = needsValue ? 
      (isMultipleOperator ? filterValue.split(',').map(v => v.trim()).filter(Boolean) : filterValue.trim()) 
      : null;

    onFilterChange({
      propertyId: parseInt(selectedProperty),
      operator: selectedOperator,
      value
    });
  };

  const handleClear = (): void => {
    setSelectedProperty('');
    setSelectedOperator('');
    setFilterValue('');
    onClearFilter();
  };

  const renderValueInput = (): JSX.Element | null => {
    if (!needsValue) { 
      return null; 
    }

    if(!selectedPropertyObj){
      return <></>
    }
    
    if (selectedPropertyObj?.type === 'enumerated') {
      return (
        <select value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
          <option value="">Select value</option>
          {selectedPropertyObj.values?.map(enumValue => (
            <option key={enumValue} value={enumValue}>{enumValue}</option>
          ))}
        </select>
      );
    }


    return (
      <input
        type={selectedPropertyObj?.type === 'number' ? 'number' : 'text'}
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        placeholder={isMultipleOperator ? "Enter values separated by commas" : "Enter value"}
      />
    );
  };

  return (
    <div className="filter-section">
      <div className="filter-form">
        <div className="form-group">
          <label>Property</label>
          <select
            value={selectedProperty}
            onChange={(e) => {
              setSelectedProperty(e.target.value);
              setSelectedOperator('');
              setFilterValue('');
            }}
          >
            <option value="">Select a property</option>
            {properties.map(property => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Operator</label>
          <select
            value={selectedOperator}
            onChange={(e) => {
              setSelectedOperator(e.target.value);
              setFilterValue('');
            }}
            disabled={!selectedProperty}
          >
            <option value="">Select an operator</option>
            {availableOperators.map(operator => (
              <option key={operator.id} value={operator.id}>
                {operator.text}
              </option>
            ))}
          </select>
        </div>

        {needsValue && selectedProperty && (
          <div className="form-group">
            <label>Value{isMultipleOperator ? 's' : ''}</label>
            {renderValueInput()}
          </div>
        )}

        <button
          className="button button-primary"
          onClick={handleApplyFilter}
          disabled={!selectedProperty || !selectedOperator || (needsValue && !filterValue.trim())}
        >
          Apply Filter
        </button>

        {currentFilter && (
          <button className="button button-secondary" onClick={handleClear}>
            Clear Filter
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterEditor;