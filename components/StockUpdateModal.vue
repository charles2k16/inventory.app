<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-screen flex flex-col">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Update Stock</h3>
        <p v-if="product?.itemName" class="text-sm text-gray-500 dark:text-gray-400">
          {{ product.itemName }}
        </p>
      </div>

      <div class="p-6 space-y-4 overflow-y-auto flex-1">
        <!-- Current Stock Display -->
        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p class="text-sm text-gray-600 dark:text-gray-300">Current Stock</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ product?.currentStock }}
          </p>
        </div>

        <!-- Stock Change Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >Action</label
          >
          <div class="flex gap-3">
            <button
              @click="formData.action = 'add'"
              :class="[
                'flex-1 px-4 py-2 rounded-md font-medium text-sm transition',
                formData.action === 'add'
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-2 border-green-300 dark:border-green-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600',
              ]">
              ➕ Add Stock
            </button>
            <button
              @click="formData.action = 'reduce'"
              :class="[
                'flex-1 px-4 py-2 rounded-md font-medium text-sm transition',
                formData.action === 'reduce'
                  ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-2 border-red-300 dark:border-red-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600',
              ]">
              ➖ Reduce Stock
            </button>
          </div>
        </div>

        <!-- Quantity Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >Quantity</label
          >
          <input
            v-model.number="formData.quantity"
            type="number"
            min="1"
            placeholder="Enter quantity"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-primary-500 focus:border-primary-500" />
        </div>

        <!-- Reason Select -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >Reason</label
          >
          <select
            v-model="formData.reason"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-primary-500 focus:border-primary-500">
            <option value="">Select reason</option>
            <option value="PURCHASE">Purchase</option>
            <option value="SALE">Sale</option>
            <option value="RETURN">Return</option>
            <option value="DAMAGE">Damage/Loss</option>
            <option value="ADJUSTMENT">Inventory Adjustment</option>
          </select>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >Notes (Optional)</label
          >
          <textarea
            v-model="formData.notes"
            placeholder="Add any additional notes..."
            rows="2"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-primary-500 focus:border-primary-500"></textarea>
        </div>

        <!-- Preview -->
        <div class="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <p class="text-sm text-gray-600 dark:text-blue-200">Stock After Update</p>
          <p
            :class="[
              'text-2xl font-bold',
              formData.action === 'add'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400',
            ]">
            {{
              formData.action === 'add'
                ? (product?.currentStock || 0) + (formData.quantity || 0)
                : (product?.currentStock || 0) - (formData.quantity || 0)
            }}
          </p>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ error }}
        </div>
      </div>

      <div class="p-6 border-t border-gray-200 flex gap-3">
        <button
          @click="close"
          class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium">
          Cancel
        </button>
        <button
          @click="submit"
          :disabled="isLoading || !formData.quantity"
          class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2">
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
          {{ isLoading ? 'Updating...' : 'Update Stock' }}
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
  action: 'add',
  quantity: null,
  reason: '',
  notes: '',
});

const close = () => {
  formData.value = {
    action: 'add',
    quantity: null,
    reason: '',
    notes: '',
  };
  emit('close');
};

const submit = () => {
  emit('submit', {
    ...formData.value,
    quantity: formData.value.quantity,
  });
};

watch(
  () => props.isOpen,
  newVal => {
    if (!newVal) {
      formData.value = {
        action: 'add',
        quantity: null,
        reason: '',
        notes: '',
      };
    }
  },
);
</script>
