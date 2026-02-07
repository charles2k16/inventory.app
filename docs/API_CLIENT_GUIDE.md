# Global API Client - Refactoring Guide

## Overview

We've refactored the frontend API configuration to eliminate repetitive Authorization header handling across the codebase. All API requests now use a centralized `apiClient` that automatically manages authentication.

## What Changed

### Before (Old Pattern)

```typescript
const response = await fetch(`${config.public.apiBase}/dashboard/sales-chart`, {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});
const data = await response.json();
```

### After (New Pattern)

```typescript
const { $api } = useNuxtApp();
const data = await $api.get('/dashboard/sales-chart');
```

## How to Use

### 1. Using the `useApi()` Composable (Recommended for components)

```typescript
import { useApi } from '@/composables/useApi';

export default {
  setup() {
    const api = useApi();

    // GET requests
    const products = await api.getProducts({ limit: 10 });
    const product = await api.getProduct('product-id');

    // POST requests
    const newProduct = await api.createProduct({
      itemName: 'Product Name',
      costPrice: 100,
      sellingPrice: 150,
    });

    // Other endpoints
    const sales = await api.getSales({ period: 'week' });
    const reports = await api.getStockReports();
    const lenders = await api.getLenders();

    return { products, sales };
  },
};
```

### 2. Using the Global `$api` Client (Direct access)

```typescript
const { $api } = useNuxtApp();

// GET
const data = await $api.get('/endpoint', { queryParam: 'value' });

// POST
const result = await $api.post('/endpoint', { body: 'data' });

// PUT
const updated = await $api.put('/endpoint', { updated: 'data' });

// PATCH
const patched = await $api.patch('/endpoint', { field: 'value' });

// DELETE
await $api.delete('/endpoint');

// File Upload
const formData = new FormData();
formData.append('file', file);
const response = await $api.uploadFile('/upload-endpoint', formData);
```

## API Methods

### GET Request

```typescript
// Without parameters
const users = await $api.get('/users');

// With query parameters
const filtered = await $api.get('/users', {
  role: 'admin',
  limit: 10,
  page: 1,
});
```

### POST Request

```typescript
// Create new resource
const newUser = await $api.post('/users', {
  name: 'John Doe',
  email: 'john@example.com',
});

// POST with query parameters
const result = await $api.post('/endpoint', { data: 'value' }, { action: 'batch' });
```

### PUT/PATCH Request

```typescript
// Update entire resource
const updated = await $api.put('/users/123', {
  name: 'Updated Name',
});

// Partial update
const patched = await $api.patch('/users/123', {
  email: 'newemail@example.com',
});
```

### DELETE Request

```typescript
// Simple delete
await $api.delete('/users/123');

// With parameters
await $api.delete('/endpoint', { cascade: true });
```

### File Upload

```typescript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('category', 'products');

const response = await $api.uploadFile('/products/bulk-import', formData);
```

## Using with `useApi()` Composable

Pre-defined methods in the composable for common operations:

```typescript
const api = useApi();

// Products
api.getProducts(params);
api.getProduct(id);
api.createProduct(data);
api.updateProduct(id, data);
api.deleteProduct(id);

// Sales
api.getSales(params);
api.getSale(id);
api.createSale(data);
api.updateSale(id, data);

// Dashboard
api.getDashboardStats();
api.getSalesChart(period);

// Lenders
api.getLenders(params);
api.createLender(data);
api.updateLender(id, data);

// Stock Reports
api.getStockReports(params);
api.getStockReport(id);
api.createStockReport(data);

// Returns
api.getReturns(params);
api.createReturn(data);

// File operations
api.uploadFile(endpoint, formData);
```

## Error Handling

All methods throw errors that you can catch:

```typescript
try {
  const { $api } = useNuxtApp();
  const data = await $api.get('/users/123');
} catch (error) {
  console.error('Error message:', error.message);
  // Handle error - show user-friendly message
}
```

## Features Included

✅ **Automatic Authorization**: Token is automatically included in every request  
✅ **Request/Response Handling**: Automatic JSON parsing and error handling  
✅ **Query Parameters**: Automatically serialized in URL  
✅ **File Uploads**: Special handling for FormData with file attachments  
✅ **Type-Safe**: Full TypeScript support  
✅ **Error Messages**: Detailed error messages from server responses

## Migration Checklist

When updating existing files:

- [ ] Replace raw `fetch()` calls with `$api` client or `useApi()` composable
- [ ] Remove manual `Authorization` headers
- [ ] Remove `Content-Type: application/json` headers (added automatically)
- [ ] Remove manual error handling for response.ok checks
- [ ] Simplify code by using high-level composable methods when available

## Examples in Codebase

### Before: Components/ReportDetailsModal.vue

```typescript
const fetchFullReport = async () => {
  const response = await fetch(
    `${config.public.apiBase}/stock-reports/${props.report.id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
  const data = await response.json();
  fullReport.value = data;
};
```

### After: Components/ReportDetailsModal.vue

```typescript
const fetchFullReport = async () => {
  const { $api } = useNuxtApp();
  const data = await $api.get(`/stock-reports/${props.report.id}`);
  fullReport.value = data;
};
```

## Adding New API Endpoints

If you need a new endpoint, you can:

1. **Quick way**: Use `$api` directly

   ```typescript
   const { $api } = useNuxtApp();
   const data = await $api.get('/new-endpoint');
   ```

2. **Standardized way**: Add to `useApi()` composable in `/composables/useApi.ts`
   ```typescript
   // Add this to the return object in useApi()
   getNewEndpoint: (params = {}) => $api.get('/new-endpoint', params),
   createNewEndpoint: (data: any) => $api.post('/new-endpoint', data),
   ```

## Configuration

The API client is initialized automatically via the plugin `/plugins/api.ts` using the `config.public.apiBase` from your Nuxt config.

No manual setup is required - it works out of the box!
