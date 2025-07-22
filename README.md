# Product Filtering Condition

Many capabilities of filtered sets of products.


## 📋 Project Overview

This project implements a product filtering condition editor that allows users to:
- Create single filters with property, operator, and value selections
- Clear filters to view all products
- Handle different property types (string, number, enumerated)
- Support various operators (equals, greater than, less than, any, none, in, contains)

## 🏗️ Architecture & Implementation

### Project Structure
```
src/
├── components/
│   ├── FilterEditor.tsx    # Main filter creation component
│   ├── ProductList.tsx     # Product display component
│   └── __tests__/          # Component test files
│       ├── FilterEditor.test.tsx
│       └── ProductList.test.tsx
├── hooks/
│   └── useProductFilter.ts # Custom hook for filter logic
├── types/
│   ├── index.ts           # Type exports
│   ├── Property.ts        # Property and PropertyType definitions
│   ├── Operator.ts        # Operator and filter function definitions
│   ├── Product.ts         # Product and PropertyValue definitions
│   ├── Filter.ts          # Filter interface definition
│   └── Datastore.ts       # Datastore interface definition
├── utils/
│   └── filterUtils.ts     # Filter operators and utilities
├── styles/
│   └── App.css            # Application styling
├── setupTests.ts          # Jest testing configuration
└── App.tsx                # Main application component
```

### Key Design Decisions

1. **Component Architecture**: Separated concerns with dedicated components for filtering and display
2. **Custom Hook**: Centralized filter logic in `useProductFilter` for reusability
3. **TypeScript Integration**: Full type safety across all components and data structures
4. **Simplified State Management**: Used React's built-in state management instead of external libraries

## 🛠️ Development Process

### Phase 1: Initial Setup (45 minutes)
- Created basic HTML structure with React CDN
- And understand the structure of the data

### Phase 2: Create layout (take some ideias from the wireframe) (20 minutes)
- Implemented core filtering functionality (first concept)
- Added responsive CSS styling

### Phase 3: Improve core functionality (45 minutes)
- Implemented core filtering functionality, create hook, const and try to improve the code quality. 
- Create operations types and general logic, use a lot of research to create a best perfomace solution.

### Phase 3: Code Simplification (35 minutes)
- Simplified FilterEditor component
- Streamlined useProductFilter hook
- Remove duplicated code and refactor all components
- Remove duplicated css and logical 
- Create basic unitary test 


## 🎯 Key Assumptions Made
1. **Single Filter Limitation**: Users can only create one active filter at a time
2. **Property Types**: Only three property types need support (string, number, enumerated)
3. **Operator Compatibility**: Operators are predefined and mapped to specific property types
4. **Data Persistence**: No need for persistent storage, filters reset on page reload

## 🚀 Getting Started

### Prerequisites
- npm 

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Serve production build
npm run serve

# Test 
npm run test
```

## 🎨 Features Implemented

### Core Requirements ✅
- [x] Single filter creation
- [x] Property, operator, value selection
- [x] Clear filter functionality
- [x] Property type-specific operator validation

## 🧪 Testing the Application

### Test Scenarios
1. **Property Selection**: Choose different properties and verify operator options change
2. **Number Filtering**: Test greater than/less than with numeric values
3. **String Filtering**: Test contains and equals with text values
4. **Enumerated Values**: Test dropdown selection for enumerated properties
5. **Multiple Values**: Test "in" operator with comma-separated values
6. **Edge Cases**: Test with empty values, special characters, and boundary conditions
