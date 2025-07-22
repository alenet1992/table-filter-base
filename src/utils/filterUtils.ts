export const needsMultipleValues = (operator: string): boolean => operator === 'in';

export const needsNoValue = (operator: string): boolean => ['any', 'none'].includes(operator);

export const validateFilterValue = (
  operator: string,
  value: string | string[],
  isMultiple: boolean
): boolean => {
  if (needsNoValue(operator)) {
    return true;
  }
  
  if (isMultiple) {
    return Array.isArray(value) && value.filter(v => v.trim() !== '').length > 0;
  }
  
  return typeof value === 'string' && value.trim() !== '';
};