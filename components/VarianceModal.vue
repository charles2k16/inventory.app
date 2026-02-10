<template>
  <div
    v-if="variance"
    class="fixed inset-0 bg-black dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div
      class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
      <div
        class="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Stock Variance - Week {{ variance.weekNumber }}/{{ variance.year }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          ✕
        </button>
      </div>

      <div class="p-6 space-y-6">
        <!-- Variance Summary -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            class="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
            <label class="text-sm font-medium text-gray-700 dark:text-blue-200"
              >Opening Stock Value</label
            >
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-300 mt-1">
              GHS {{ formatNumber(variance.openingStockValue) }}
            </p>
          </div>

          <div
            class="p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
            <label class="text-sm font-medium text-gray-700 dark:text-green-200"
              >Closing Stock Value</label
            >
            <p class="text-2xl font-bold text-green-600 dark:text-green-300 mt-1">
              GHS {{ formatNumber(variance.closingStockValue) }}
            </p>
          </div>

          <div
            class="p-4 bg-red-50 dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-700">
            <label class="text-sm font-medium text-gray-700 dark:text-red-200"
              >Goods Sold (Cost Value)</label
            >
            <p class="text-2xl font-bold text-red-600 dark:text-red-300 mt-1">
              GHS {{ formatNumber(variance.goodsSoldValue) }}
            </p>
          </div>

          <div
            class="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg border border-purple-200 dark:border-purple-700">
            <label class="text-sm font-medium text-gray-700 dark:text-purple-200"
              >Additional Stock Value</label
            >
            <p class="text-2xl font-bold text-purple-600 dark:text-purple-300 mt-1">
              GHS {{ formatNumber(variance.additionalStockValue) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  variance: {
    type: Object,
    default: null,
  },
});

defineEmits(['close']);

const formatNumber = num => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num || 0);
};
</script>
