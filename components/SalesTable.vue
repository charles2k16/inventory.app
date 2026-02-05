<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Date
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Customer
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Items
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Amount
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Payment Status
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Action
          </th>
        </tr>
      </thead>
      <tbody
        class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-if="sales.length === 0">
          <td colspan="6" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
            No sales found
          </td>
        </tr>
        <tr
          v-for="sale in sales"
          :key="sale.id"
          class="hover:bg-gray-50 dark:hover:bg-gray-700">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
            {{ formatDate(sale.createdAt) }}
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
            {{ sale.lenderName || sale.customerName || 'Walk-in' }}
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            {{ sale.items?.length || 0 }}
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
            GHS {{ formatNumber(sale.totalAmount) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              :class="[
                'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                getPaymentStatusColor(sale.paymentStatus),
              ]">
              {{ sale.paymentStatus }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button
              @click="$emit('view', sale)"
              class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 mr-4">
              View
            </button>
            <button
              v-if="sale.paymentStatus !== 'PAID'"
              @click="$emit('update-payment', sale)"
              class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
              Update Payment
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  sales: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['view', 'update-payment']);

const formatDate = dateString => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const formatNumber = num => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num || 0);
};

const getPaymentStatusColor = status => {
  const colors = {
    PAID: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    UNPAID: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    PARTIAL: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  };
  return (
    colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  );
};
</script>
