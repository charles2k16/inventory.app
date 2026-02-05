<template>
  <div
    v-if="variance"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
      <div
        class="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">
          Stock Variance - Week {{ variance.weekNumber }}/{{ variance.year }}
        </h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div class="p-6 space-y-6">
        <!-- Variance Summary -->
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <label class="text-sm font-medium text-gray-700">Total Opening Stock</label>
            <p class="text-2xl font-bold text-blue-600 mt-1">
              GHS {{ formatNumber(variance.openingTotal) }}
            </p>
          </div>
          <div class="p-4 bg-green-50 rounded-lg border border-green-200">
            <label class="text-sm font-medium text-gray-700">Total Closing Stock</label>
            <p class="text-2xl font-bold text-green-600 mt-1">
              GHS {{ formatNumber(variance.closingTotal) }}
            </p>
          </div>
        </div>

        <!-- Variance by Product -->
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-3">Variance by Product</h4>
          <div class="border rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Opening Qty
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Closing Qty
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Qty Variance
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cost Price
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Value Variance
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="item in variance.products"
                  :key="item.productId"
                  class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">
                    {{ item.productName }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.openingQty }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.closingQty }}</td>
                  <td
                    class="px-4 py-3 text-sm font-semibold"
                    :class="getVarianceClass(item.qtyVariance)">
                    {{ item.qtyVariance }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">
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
          class="p-4 bg-red-50 rounded-lg border border-red-200">
          <p class="text-sm font-medium text-red-900 mb-1">⚠️ Variance Detected</p>
          <p class="text-sm text-red-700">
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
