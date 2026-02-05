<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Customer
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Items
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Amount
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Payment Status
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Action
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="sales.length === 0">
          <td colspan="6" class="px-6 py-4 text-center text-gray-500">No sales found</td>
        </tr>
        <tr v-for="sale in sales" :key="sale.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {{ formatDate(sale.createdAt) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {{ sale.lenderName || sale.customerName || 'Walk-in' }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ sale.items?.length || 0 }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
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
              class="text-primary-600 hover:text-primary-900 mr-4">
              View
            </button>
            <button
              v-if="sale.paymentStatus !== 'PAID'"
              @click="$emit('update-payment', sale)"
              class="text-blue-600 hover:text-blue-900">
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
    PAID: 'bg-green-100 text-green-800',
    UNPAID: 'bg-red-100 text-red-800',
    PARTIAL: 'bg-yellow-100 text-yellow-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};
</script>
