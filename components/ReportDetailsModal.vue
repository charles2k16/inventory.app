<template>
  <div
    v-if="report"
    class="fixed inset-0 bg-black dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div
      class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
      <div
        class="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Week {{ fullReport?.weekNumber }} Report - {{ fullReport?.year }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          ✕
        </button>
      </div>

      <div class="p-6 space-y-6" v-if="fullReport">
        <!-- Report Info -->
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Period</label
            >
            <p class="text-gray-900 dark:text-white font-semibold">
              {{ formatDate(fullReport.startDate) }} -
              {{ formatDate(fullReport.endDate) }}
            </p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Stock Value</label
            >
            <p class="text-gray-900 dark:text-white font-semibold">
              GHS {{ formatNumber(fullReport.totalValue) }}
            </p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Status</label
            >
            <p
              :class="[
                'font-semibold',
                Object.keys(fullReport.closingStock).length > 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-yellow-600 dark:text-yellow-400',
              ]">
              {{ Object.keys(fullReport.closingStock).length > 0 ? 'Closed' : 'Open' }}
            </p>
          </div>
        </div>

        <!-- Stock Breakdown Table -->
        <div class="border dark:border-gray-700 rounded-lg overflow-hidden">
          <!-- Table header with search -->
          <div
            class="px-4 py-3 bg-gray-50 dark:bg-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              Stock Breakdown
            </p>
            <div class="relative w-full sm:w-64">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search products..."
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pl-3 pr-8 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500" />
              <span
                class="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
                🔍
              </span>
            </div>
          </div>

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
                  Opening
                </th>
                <th
                  v-if="Object.keys(fullReport.closingStock).length > 0"
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Closing
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Cost Price
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="product in paginatedProducts"
                :key="product.productId"
                class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                  {{ product.itemName }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {{ product.openingQty }}
                </td>
                <td
                  v-if="Object.keys(fullReport.closingStock).length > 0"
                  class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {{ product.closingQty }}
                </td>
                <td class="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                  GHS {{ formatNumber(product.costPrice) }}
                </td>
              </tr>
              <tr v-if="!paginatedProducts.length">
                <td
                  colspan="4"
                  class="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  No products found.
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div
            class="px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Showing
              <span class="font-medium">
                {{ pageStart }}
              </span>
              to
              <span class="font-medium">
                {{ pageEnd }}
              </span>
              of
              <span class="font-medium">
                {{ filteredProducts.length }}
              </span>
              products
            </p>

            <div class="flex items-center justify-end gap-2">
              <button
                type="button"
                class="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="currentPage === 1"
                @click="goToPreviousPage">
                Previous
              </button>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button
                type="button"
                class="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="currentPage === totalPages || totalPages === 0"
                @click="goToNextPage">
                Next
              </button>
            </div>
          </div>
        </div>

        <!-- Additional Stock Section -->
        <div v-if="fullReport.additionalStock && fullReport.additionalStock.length > 0">
          <h4 class="text-md font-medium text-gray-900 mb-3 dark:text-white">Additional Stock Added</h4>
          <div class="border rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                    Product
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                    Category
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                    Quantity
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                    Total Cost
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="stock in fullReport.additionalStock"
                  :key="stock.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {{ stock.product?.itemName || 'Unknown' }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-600 dark:text-white">
                    {{ stock.product?.category || '-' }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ stock.quantity }}</td>
                  <td class="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                    GHS {{ formatNumber(stock.totalCost) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-600 dark:text-white">
                    {{ formatDate(stock.purchaseDate) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p class="text-md text-gray-700">
              <span class="font-medium">Total Additional Stock Value:</span>
              <span class="text-blue-600 font-bold">
                GHS {{ formatNumber(fullReport.additionalStockValue) }}
              </span>
            </p>
          </div>
        </div>

        <!-- Inventory Movement Summary -->
        <div
          class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h4 class="text-sm font-medium text-gray-900 mb-4">
            Inventory Movement Summary
          </h4>
          <div class="space-y-3">
            <!-- Opening Stock -->
            <div class="flex justify-between items-center">
              <span class="text-gray-700">Opening Stock Value:</span>
              <span class="font-semibold text-gray-900">
                GHS {{ formatNumber(fullReport.totalValue) }}
              </span>
            </div>

            <!-- Closing Stock (Balance Left) -->
            <div
              v-if="Object.keys(fullReport.closingStock).length > 0"
              class="flex justify-between items-center">
              <span class="text-gray-700">- Closing Stock Value:</span>
              <span class="font-semibold text-gray-900">
                GHS {{ formatNumber(calculateClosingStockValue(fullReport)) }}
              </span>
            </div>

            <!-- Goods Sold -->
            <div
              v-if="Object.keys(fullReport.closingStock).length > 0"
              class="border-t border-blue-300 pt-3 flex justify-between items-center bg-red-50 p-2 rounded">
              <span class="font-medium text-red-900">= Goods Sold (Cost Value):</span>
              <span class="font-bold text-red-600">
                GHS
                {{
                  formatNumber(
                    parseFloat(fullReport.totalValue) -
                      calculateClosingStockValue(fullReport),
                  )
                }}
              </span>
            </div>

            <!-- Additional Stock Purchased -->
            <div
              v-if="fullReport.additionalStock && fullReport.additionalStock.length > 0"
              class="mt-4 pt-4 border-t border-blue-300 flex justify-between items-center">
              <span class="text-gray-700">+ Goods Purchased (New Stock):</span>
              <span class="font-semibold text-green-600">
                GHS {{ formatNumber(fullReport.additionalStockValue) }}
              </span>
            </div>

            <!-- New Opening Stock -->
            <div
              v-if="
                Object.keys(fullReport.closingStock).length > 0 &&
                fullReport.additionalStock &&
                fullReport.additionalStock.length > 0
              "
              class="border-t border-blue-300 pt-3 flex justify-between items-center bg-purple-50 p-2 rounded">
              <span class="font-medium text-purple-900"
                >= New Opening Stock (Next Period):</span
              >
              <span class="font-bold text-purple-600">
                GHS
                {{
                  formatNumber(
                    parseFloat(calculateClosingStockValue(fullReport)) +
                      parseFloat(fullReport.additionalStockValue || 0),
                  )
                }}
              </span>
            </div>

            <!-- Not Closed Yet -->
            <div
              v-if="Object.keys(fullReport.closingStock).length === 0"
              class="text-sm text-amber-700 bg-amber-50 p-2 rounded">
              <p>📋 Close the report to see goods sold calculation</p>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="fullReport.notes">
          <label class="text-sm font-medium text-gray-700">Notes</label>
          <p class="text-gray-900 mt-1">{{ fullReport.notes }}</p>
        </div>

        <!-- Variance Info -->
        <div
          v-if="Object.keys(fullReport.closingStock).length > 0"
          class="bg-gray-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600 mb-2">
            This report has been closed. Click the "Variance" button in the reports list
            to see the detailed variance analysis.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const config = useRuntimeConfig();
const props = defineProps({
  report: {
    type: Object,
    default: null,
  },
});

defineEmits(['close']);

const fullReport = ref(null);
const loading = ref(false);

// Search & pagination state
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);

const productRows = computed(() => {
  if (!fullReport.value || !fullReport.value.openingStock) return [];

  return Object.entries(fullReport.value.openingStock).map(([productId, openingQty]) => {
    const product = fullReport.value.productsMap?.[productId] || {};
    const closingQty = fullReport.value.closingStock?.[productId] || 0;

    return {
      productId,
      itemName: product.itemName || 'Unknown Product',
      openingQty,
      closingQty,
      costPrice: product.costPrice || 0,
    };
  });
});

const filteredProducts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return productRows.value;

  return productRows.value.filter(product =>
    product.itemName.toLowerCase().includes(query),
  );
});

const totalPages = computed(() => {
  if (!filteredProducts.value.length) return 1;
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value);
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredProducts.value.slice(start, start + itemsPerPage.value);
});

const pageStart = computed(() => {
  if (!filteredProducts.value.length) return 0;
  return (currentPage.value - 1) * itemsPerPage.value + 1;
});

const pageEnd = computed(() => {
  if (!filteredProducts.value.length) return 0;
  return Math.min(filteredProducts.value.length, currentPage.value * itemsPerPage.value);
});

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};

const formatDate = dateString => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const formatNumber = num => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num || 0);
};

const calculateClosingStockValue = report => {
  if (!report.closingStock || !report.productsMap) return 0;

  let totalValue = 0;
  Object.entries(report.closingStock).forEach(([productId, closingQty]) => {
    const product = report.productsMap[productId];
    if (product && product.costPrice) {
      totalValue += parseFloat(closingQty || 0) * parseFloat(product.costPrice);
    }
  });

  return totalValue;
};

const fetchFullReport = async () => {
  if (!props.report?.id) return;

  try {
    loading.value = true;
    const { $api } = useNuxtApp();
    const data = await $api.get(`/stock-reports/${props.report.id}`);
    fullReport.value = data;
  } catch (error) {
    console.error('Error fetching report details:', error);
    fullReport.value = props.report;
  } finally {
    loading.value = false;
  }
};

// Reset to first page when report or search changes
watch(
  [() => fullReport.value, searchQuery],
  () => {
    currentPage.value = 1;
  },
);

watch(
  () => props.report,
  () => {
    if (props.report) {
      fetchFullReport();
    }
  },
);
</script>
