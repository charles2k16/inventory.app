<template>
  <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Product
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Category
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Stock
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Price
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Value
          </th>
          <th
            class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody
        class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        <tr
          v-for="product in products"
          :key="product.id"
          class="hover:bg-gray-50 dark:hover:bg-gray-700">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ product.itemName }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ product.barcodeNumber }}
            </div>
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            {{ product.category }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              :class="[
                'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                product.currentStock <= product.reorderLevel
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
              ]">
              {{ product.currentStock }}
            </span>
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            GHS {{ formatNumber(product.sellingPrice) }}
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
            GHS {{ formatNumber(product.currentStock * product.sellingPrice) }}
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
            <button
              v-if="showManageActions"
              @click="$emit('edit', product)"
              class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300">
              Edit
            </button>
            <button
              v-if="showManageActions"
              @click="$emit('stock', product)"
              class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
              Stock
            </button>
            <button
              @click="$emit('view', product)"
              class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
              View
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  products: {
    type: Array,
    default: () => [],
  },
  /** Show Edit/Stock actions (Admin, Manager). Sales only see View. */
  showManageActions: {
    type: Boolean,
    default: true,
  },
});

defineEmits(['edit', 'stock', 'view']);

const formatNumber = num => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num || 0);
};
</script>
