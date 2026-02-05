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
        <div class="grid grid-cols-2 gap-4">
          <div
            class="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
            <label class="text-sm font-medium text-gray-700 dark:text-blue-200"
              >Total Opening Stock</label
            >
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-300 mt-1">
              GHS {{ formatNumber(variance.openingTotal) }}
            </p>
          </div>
          <div
            class="p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
            <label class="text-sm font-medium text-gray-700 dark:text-green-200"
              >Total Closing Stock</label
            >
            <p class="text-2xl font-bold text-green-600 dark:text-green-300 mt-1">
              GHS {{ formatNumber(variance.closingTotal) }}
            </p>
          </div>
        </div>

        <!-- Variance by Product -->
        <div>
          <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Variance by Product
          </h4>
          <div class="border dark:border-gray-700 rounded-lg overflow-hidden">
            <table
              class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Product
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Opening Qty
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Closing Qty
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Qty Variance
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Cost Price
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Value Variance
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="item in variance.products"
                  :key="item.productId"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {{ item.productName }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {{ item.openingQty }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {{ item.closingQty }}
                  </td>
                  <td
                    class="px-4 py-3 text-sm font-semibold"
                    :class="getVarianceClass(item.qtyVariance)">
                    {{ item.qtyVariance }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    GHS {{ formatNumber(item.costPrice) }}
                  </td>
                  <td
                    class="px-4 py-3 text-sm font-semibold"
                    :class="getVarianceClass(item.valueVariance)">
                    GHS {{ formatNumber(item.valueVariance) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Discrepancy Alert -->
        <div
          v-if="variance.totalVariance !== 0"
          class="p-4 bg-red-50 dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-700">
          <p class="text-sm font-medium text-red-900 dark:text-red-200 mb-1">
            ⚠️ Variance Detected
          </p>
          <p class="text-sm text-red-700 dark:text-red-300">
            Total variance of GHS {{ formatNumber(Math.abs(variance.totalVariance)) }} ({{
              variance.totalVariance > 0 ? 'surplus' : 'shortfall'
            }})
          </p>
        </div>
        <div v-else class="p-4 bg-green-50 rounded-lg border border-green-200">
          <p class="text-sm font-medium text-green-900">✓ No Variance</p>
          <p class="text-sm text-green-700">Closing stock matches expected values</p>
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

const getVarianceClass = value => {
  if (value === 0) return 'text-gray-900';
  if (value > 0) return 'text-green-600';
  return 'text-red-600';
};
</script>
