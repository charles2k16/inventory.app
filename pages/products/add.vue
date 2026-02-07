<template>
  <div>
    <header class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Add Products</h1>
          <NuxtLink
            to="/products"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            ← Back to Products
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Page Loader -->
    <div
      v-if="pageLoading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300 font-medium">Processing import...</p>
      </div>
    </div>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Manual Add Form -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Add Single Product
          </h2>
          <form @submit.prevent="addSingleProduct" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Product Name *</label
              >
              <input
                v-model="formData.itemName"
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Description</label
              >
              <textarea
                v-model="formData.itemDescription"
                rows="3"
                class="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Category *</label
              >
              <select
                v-model="formData.category"
                required
                class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                <option value="">Select a category</option>
                <option value="Equipment">Equipment</option>
                <option value="Tools">Tools</option>
                <option value="Supplies">Supplies</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Barcode Number</label
              >
              <input
                v-model="formData.barcodeNumber"
                type="text"
                class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Current Stock *</label
              >
              <input
                v-model.number="formData.currentStock"
                type="number"
                min="0"
                required
                class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Selling Price (GHS) *</label
              >
              <input
                v-model.number="formData.sellingPrice"
                type="number"
                step="0.01"
                min="0"
                required
                class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Cost Price (GHS) *</label
              >
              <input
                v-model.number="formData.costPrice"
                type="number"
                step="0.01"
                min="0"
                required
                class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Reorder Level</label
              >
              <input
                v-model.number="formData.reorderLevel"
                type="number"
                min="0"
                class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Default: 10 units
              </p>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2">
              <span
                v-if="loading"
                class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></span>
              {{ loading ? 'Adding...' : 'Add Product' }}
            </button>
          </form>
        </div>

        <!-- Bulk Import -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Bulk Import
          </h2>

          <!-- File Upload Area -->
          <div
            @drop.prevent="handleDrop"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            :class="[
              'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition',
              isDragging
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-gray-400',
            ]">
            <svg
              class="mx-auto h-12 w-12 text-gray-400 mb-4"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48">
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-8l-3.172-3.172a4 4 0 00-5.656 0L28 20M9.172 9.172L12 12m0 0l3.172-3.172a4 4 0 015.656 0L28 20" />
            </svg>
            <p class="text-gray-700 dark:text-gray-300 font-medium mb-2">
              Drag and drop your file here
            </p>
            <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">or</p>
            <input
              ref="fileInput"
              type="file"
              @change="handleFileSelect"
              accept=".xlsx,.xls,.csv"
              class="hidden" />
            <button
              @click="$refs.fileInput.click()"
              type="button"
              class="inline-flex items-center px-4 py-2 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 font-medium">
              Choose File
            </button>
            <p class="text-gray-500 text-xs mt-4">
              Supported formats: Excel (.xlsx, .xls), CSV
            </p>
          </div>

          <!-- Selected File Info -->
          <div
            v-if="selectedFile"
            class="mt-4 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-600 rounded">
            <p class="text-sm text-blue-900 dark:text-blue-200">
              <strong>Selected file:</strong> {{ selectedFile.name }}
            </p>
          </div>

          <!-- Preview Table -->
          <div v-if="previewData.length > 0" class="mt-6">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Preview (First 5 rows)
            </h3>
            <div
              class="overflow-x-auto border border-gray-300 dark:border-gray-600 rounded-lg">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th
                      v-for="header in Object.keys(previewData[0])"
                      :key="header"
                      class="px-4 py-2 text-left text-xs font-medium text-gray-900 dark:text-white uppercase">
                      {{ header }}
                    </th>
                  </tr>
                </thead>
                <tbody
                  class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  <tr
                    v-for="(row, idx) in previewData.slice(0, 5)"
                    :key="idx"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td
                      v-for="(val, key) in row"
                      :key="key"
                      class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                      {{ val }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p
              v-if="previewData.length > 5"
              class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Showing 5 of {{ previewData.length }} rows
            </p>
          </div>

          <!-- Import Button -->
          <div v-if="selectedFile" class="mt-6 flex gap-3">
            <button
              @click="resetImport"
              type="button"
              class="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 font-medium">
              Clear
            </button>
            <button
              @click="importProducts"
              :disabled="importLoading || previewData.length === 0"
              type="button"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2">
              <span
                v-if="importLoading"
                class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></span>
              {{ importLoading ? 'Importing...' : 'Import Products' }}
            </button>
          </div>

          <!-- Template Download -->
          <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-700 dark:text-gray-300 mb-3">
              <strong>Need help?</strong> Download a template to see the required format.
            </p>
            <button
              @click="downloadTemplate"
              type="button"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              ⬇️ Download Excel Template
            </button>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div
        v-if="successMessage"
        class="mt-6 p-4 bg-green-50 border border-green-200 rounded">
        <p class="text-green-800">{{ successMessage }}</p>
      </div>

      <div v-if="errorMessage" class="mt-6 p-4 bg-red-50 border border-red-200 rounded">
        <p class="text-red-800">{{ errorMessage }}</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import * as XLSX from 'xlsx';

const config = useRuntimeConfig();
const router = useRouter();

const formData = ref({
  itemName: '',
  itemDescription: '',
  category: '',
  barcodeNumber: '',
  currentStock: 0,
  sellingPrice: 0,
  costPrice: 0,
  reorderLevel: 0,
});

const selectedFile = ref(null);
const previewData = ref([]);
const isDragging = ref(false);
const loading = ref(false);
const importLoading = ref(false);
const pageLoading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const handleDrop = e => {
  isDragging.value = false;
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
};

const handleFileSelect = e => {
  const files = e.target.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
};

const processFile = async file => {
  const validTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
    errorMessage.value = 'Invalid file type. Please upload a CSV or Excel file.';
    return;
  }

  selectedFile.value = file;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const reader = new FileReader();
    reader.onload = e => {
      const data = e.target.result;
      let jsonData = [];

      if (file.name.endsWith('.csv')) {
        jsonData = parseCSV(data);
      } else {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        jsonData = XLSX.utils.sheet_to_json(sheet);
      }

      previewData.value = jsonData;
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  } catch (error) {
    errorMessage.value = 'Error reading file: ' + error.message;
  }
};

const parseCSV = data => {
  const lines = data.split('\n');
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    const values = lines[i].split(',').map(v => v.trim());
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = values[idx] || '';
    });
    result.push(obj);
  }

  return result;
};

const normalizeImportData = data => {
  return data.map(item => ({
    itemName: item.itemName || item['Product Name'] || item['Name'] || '',
    itemDescription: item.itemDescription || item['Description'] || item['Desc'] || '',
    category: item.category || item['Category'] || 'Other',
    barcodeNumber: item.barcodeNumber || item['Barcode'] || item['SKU'] || '',
    currentStock: parseInt(
      item.currentStock || item['Stock'] || item['Current Stock'] || 0,
    ),
    sellingPrice: parseFloat(
      item.sellingPrice || item['Selling Price'] || item['Price'] || 0,
    ),
    costPrice: parseFloat(item.costPrice || item['Cost Price'] || item['Cost'] || 0),
    reorderLevel: parseInt(
      item.reorderLevel || item['Reorder Level'] || item['Min Stock'] || 0,
    ),
  }));
};

const addSingleProduct = async () => {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const response = await fetch(`${config.public.apiBase}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(formData.value),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add product');
    }

    successMessage.value = 'Product added successfully!';
    formData.value = {
      itemName: '',
      itemDescription: '',
      category: '',
      barcodeNumber: '',
      currentStock: 0,
      sellingPrice: 0,
      costPrice: 0,
      reorderLevel: 0,
    };

    setTimeout(() => {
      navigateTo('/products');
    }, 2000);
  } catch (error) {
    errorMessage.value = error.message || 'Failed to add product';
  } finally {
    loading.value = false;
  }
};

const importProducts = async () => {
  if (!selectedFile.value) {
    errorMessage.value = 'No file selected';
    return;
  }

  importLoading.value = true;
  pageLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const formData = new FormData();
    formData.append('file', selectedFile.value);

    const response = await fetch(`${config.public.apiBase}/products/bulk-import`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to import products');
    }

    const result = await response.json();
    successMessage.value = `Successfully imported ${result.count} products!`;
    pageLoading.value = false;

    setTimeout(() => {
      navigateTo('/products');
    }, 2000);
  } catch (error) {
    errorMessage.value = error.message || 'Failed to import products';
    pageLoading.value = false;
  } finally {
    importLoading.value = false;
  }
};

const resetImport = () => {
  selectedFile.value = null;
  previewData.value = [];
};

const downloadTemplate = async () => {
  try {
    const response = await fetch(`${config.public.apiBase}/products/import/template`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download template');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-template.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    errorMessage.value = 'Failed to download template: ' + error.message;
  }
};
</script>
