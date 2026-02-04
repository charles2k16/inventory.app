<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-lg max-w-md w-full max-h-screen flex flex-col">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Edit Product</h3>
      </div>

      <div class="px-6 py-4 overflow-y-auto flex-1">
        <div
          v-if="error"
          class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ error }}
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              v-model="formData.itemName"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
              required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              v-model="formData.itemDescription"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
              rows="3"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Category</label>
            <input
              v-model="formData.category"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Barcode</label>
            <input
              v-model="formData.barcodeNumber"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Cost Price</label>
              <input
                v-model.number="formData.costPrice"
                type="number"
                step="0.01"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Selling Price</label>
              <input
                v-model.number="formData.sellingPrice"
                type="number"
                step="0.01"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                required />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Reorder Level</label>
            <input
              v-model.number="formData.reorderLevel"
              type="number"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border" />
          </div>

          <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
            <p class="text-sm font-medium text-gray-900 mb-2">
              Current Stock:
              <span class="text-primary-600">{{ product?.currentStock }}</span>
            </p>
            <p class="text-xs text-gray-600 mb-3">
              To update stock,
              <NuxtLink
                :to="`/products/${product?.id}`"
                class="text-primary-600 hover:text-primary-900 font-medium">
                click here
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>

      <div class="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
        <button
          @click="close"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          Cancel
        </button>
        <button
          @click="submit"
          :disabled="isLoading"
          class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
          <span v-if="isLoading" class="animate-spin">
            <svg
              class="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ isLoading ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  product: {
    type: Object,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['close', 'submit']);

const formData = ref({
  itemName: '',
  itemDescription: '',
  category: '',
  barcodeNumber: '',
  sellingPrice: 0,
  costPrice: 0,
  reorderLevel: 0,
});

const close = () => {
  emit('close');
};

const submit = () => {
  emit('submit', formData.value);
};

watch(
  () => props.product,
  newVal => {
    if (newVal) {
      formData.value = {
        itemName: newVal.itemName,
        itemDescription: newVal.itemDescription || '',
        category: newVal.category || '',
        barcodeNumber: newVal.barcodeNumber || '',
        sellingPrice: newVal.sellingPrice,
        costPrice: newVal.costPrice || 0,
        reorderLevel: newVal.reorderLevel || 0,
      };
    }
  },
  { immediate: true },
);
</script>
