export const needsMultipleValues = (operator: string): boolean => operator === 'in';

export const needsNoValue = (operator: string): boolean => ['any', 'none'].includes(operator);