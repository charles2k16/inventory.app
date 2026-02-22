<template>
  <div class="space-y-6">
    <!-- Import Section -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Import Products</h2>
        <p class="text-gray-600 mt-2">
          Upload a CSV or Excel file to import multiple products at once
        </p>
      </div>

      <!-- Template Download -->
      <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p class="text-sm text-blue-900 mb-3">
          📋 Don't have a file? Download our template to get started
        </p>
        <button
          @click="downloadTemplate"
          :disabled="downloadingTemplate"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
          {{ downloadingTemplate ? 'Downloading...' : 'Download Template' }}
        </button>
      </div>

      <!-- File Upload Area -->
      <div class="mb-6">
        <div
          @drop="handleDrop"
          @dragover.prevent="dragActive = true"
          @dragleave="dragActive = false"
          :class="[
            'border-2 border-dashed rounded-lg p-8 text-center transition',
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400',
          ]">
          <div class="mb-4">
            <svg
              class="mx-auto h-12 w-12"
              :class="dragActive ? 'text-blue-500' : 'text-gray-400'"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48">
              <path
                d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-10-12l-3.172-3.172a2 2 0 00-2.828 0L28 8m0 0L18 18m10-10v10m0 0h10m-10 0H18"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>

          <p class="text-gray-900 font-medium mb-2">
            Drag and drop your file here or
            <label class="text-blue-600 hover:text-blue-700 cursor-pointer font-semibold">
              browse
              <input
                type="file"
                @change="handleFileSelect"
                accept=".csv,.xlsx,.xls"
                class="hidden"
                ref="fileInput" />
            </label>
          </p>
          <p class="text-sm text-gray-600">CSV, XLSX or XLS files up to 10MB</p>
        </div>

        <!-- Selected File Info -->
        <div
          v-if="selectedFile"
          class="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <p class="text-sm text-green-900">
            ✓ Selected file:
            <span class="font-semibold">{{ selectedFile.name }}</span> ({{
              formatFileSize(selectedFile.size)
            }})
          </p>
        </div>
      </div>

      <!-- Upload Button -->
      <div class="flex gap-3">
        <button
          @click="uploadFile"
          :disabled="!selectedFile || uploading"
          class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50">
          <span v-if="!uploading">Upload & Import</span>
          <span v-else class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                stroke-width="2" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Uploading...
          </span>
        </button>
        <button
          @click="clearFile"
          v-if="selectedFile"
          class="px-6 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Clear
        </button>
      </div>

      <!-- Progress Bar -->
      <div v-if="uploading && uploadProgress" class="mt-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700">Upload Progress</span>
          <span class="text-sm font-medium text-gray-700">{{ uploadProgress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-primary-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: uploadProgress + '%' }"></div>
        </div>
      </div>

      <!-- Result Messages -->
      <div
        v-if="successMessage"
        class="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <p class="text-sm text-green-900 font-medium">✓ {{ successMessage }}</p>
      </div>

      <div
        v-if="errorMessage"
        class="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
        <p class="text-sm text-red-900 font-medium">✗ {{ errorMessage }}</p>
      </div>
    </div>

    <!-- File Format Guide -->
    <div class="bg-white shadow rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">File Format Guide</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-medium text-gray-900 mb-3">Required Columns:</h4>
          <ul class="space-y-2 text-sm text-gray-700">
            <li>✓ <span class="font-semibold">Item Name</span> - Name of the product</li>
            <li>✓ <span class="font-semibold">Cost Price</span> - Purchase cost</li>
            <li>✓ <span class="font-semibold">Selling Price</span> - Sale price</li>
          </ul>
        </div>
        <div>
          <h4 class="font-medium text-gray-900 mb-3">Optional Columns:</h4>
          <ul class="space-y-2 text-sm text-gray-700">
            <li>• Item Description</li>
            <li>• Category</li>
            <li>• Barcode</li>
            <li>• Current Stock</li>
            <li>• Reorder Level</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const config = useRuntimeConfig();
const fileInput = ref(null);
const selectedFile = ref(null);
const uploading = ref(false);
const dragActive = ref(false);
const uploadProgress = ref(0);
const successMessage = ref('');
const errorMessage = ref('');
const downloadingTemplate = ref(false);

const formatFileSize = bytes => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes, k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const handleFileSelect = event => {
  const files = event.target.files;
  if (files && files[0]) {
    const file = files[0];
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const validExts = ['.csv', '.xlsx', '.xls'];
    const ext = file.name.split('.').pop().toLowerCase();

    if (validTypes.includes(file.type) || validExts.includes('.' + ext)) {
      selectedFile.value = file;
      errorMessage.value = '';
    } else {
      errorMessage.value = 'Please select a valid CSV or Excel file';
      selectedFile.value = null;
    }
  }
};

const handleDrop = event => {
  dragActive.value = false;
  event.preventDefault();
  const files = event.dataTransfer.files;
  if (files && files[0]) {
    const file = files[0];
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const validExts = ['.csv', '.xlsx', '.xls'];
    const ext = file.name.split('.').pop().toLowerCase();

    if (validTypes.includes(file.type) || validExts.includes('.' + ext)) {
      selectedFile.value = file;
      errorMessage.value = '';
    } else {
      errorMessage.value = 'Please select a valid CSV or Excel file';
      selectedFile.value = null;
    }
  }
};

const clearFile = () => {
  selectedFile.value = null;
  uploadProgress.value = 0;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const uploadFile = async () => {
  if (!selectedFile.value) return;

  try {
    uploading.value = true;
    errorMessage.value = '';
    successMessage.value = '';
    uploadProgress.value = 0;

    const { $api } = useNuxtApp();
    const formData = new FormData();
    formData.append('file', selectedFile.value);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', event => {
      if (event.lengthComputable) {
        uploadProgress.value = Math.round((event.loaded / event.total) * 100);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 201) {
        const response = JSON.parse(xhr.responseText);
        successMessage.value = `Successfully imported ${response.count} products out of ${response.total} (${response.skipped} duplicates skipped)`;
        clearFile();
      } else {
        const error = JSON.parse(xhr.responseText);
        errorMessage.value = error.error || 'Upload failed';
      }
      uploading.value = false;
    });

    xhr.addEventListener('error', () => {
      errorMessage.value = 'Upload failed. Please try again.';
      uploading.value = false;
    });

    const token = localStorage.getItem('token');
    xhr.open('POST', `${config.public.apiBase}/products/bulk-import`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
  } catch (error) {
    errorMessage.value = error.message || 'Upload failed';
    uploading.value = false;
  }
};

const downloadTemplate = async () => {
  try {
    downloadingTemplate.value = true;
    const { $api } = useNuxtApp();
    const raw = await $api.request<Blob>('/products/import/template', {
      method: 'GET',
      responseType: 'blob',
    });
    const blob =
      raw instanceof Blob
        ? raw
        : new Blob([raw], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_import_template.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    errorMessage.value = 'Failed to download template: ' + error.message;
  } finally {
    downloadingTemplate.value = false;
  }
};
</script>
