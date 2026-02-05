<template>
  <div class="bg-white shadow rounded-lg p-6 mb-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Filters</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Search by customer -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Customer</label>
        <input
          :value="search"
          @input="$emit('update:search', $event.target.value)"
          type="text"
          placeholder="Search customer..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
      </div>

      <!-- Payment Status Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
        <select
          :value="paymentStatus"
          @change="$emit('update:paymentStatus', $event.target.value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500">
          <option value="">All Statuses</option>
          <option value="PAID">Paid</option>
          <option value="UNPAID">Unpaid</option>
          <option value="PARTIAL">Partial</option>
        </select>
      </div>

      <!-- Clear Filters -->
      <div class="flex items-end">
        <button
          @click="clearFilters"
          class="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium">
          Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  search: {
    type: String,
    default: '',
  },
  paymentStatus: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:search', 'update:paymentStatus', 'clear']);

const clearFilters = () => {
  emit('update:search', '');
  emit('update:paymentStatus', '');
  emit('clear');
};
</script>
