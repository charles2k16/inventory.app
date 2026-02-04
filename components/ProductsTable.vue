<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Product
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Category
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Stock
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Price
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Value
          </th>
          <th
            class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="product in products" :key="product.id">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">
              {{ product.itemName }}
            </div>
            <div class="text-sm text-gray-500">{{ product.barcodeNumber }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ product.category }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              :class="[
                'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                product.currentStock <= product.reorderLevel
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800',
              ]">
              {{ product.currentStock }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            GHS {{ formatNumber(product.sellingPrice) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
            GHS {{ formatNumber(product.currentStock * product.sellingPrice) }}
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
            <button
              @click="$emit('edit', product)"
              class="text-primary-600 hover:text-primary-900">
              Edit
            </button>
            <button
              @click="$emit('stock', product)"
              class="text-blue-600 hover:text-blue-900">
              Stock
            </button>
            <button
              @click="$emit('view', product)"
              class="text-gray-600 hover:text-gray-900">
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
});

defineEmits(['edit', 'stock', 'view']);

const formatNumber = num => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num || 0);
};
</script>
