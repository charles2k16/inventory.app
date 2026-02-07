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
                v-for="(openingQty, productId) in fullReport.openingStock"
                :key="productId"
                class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                  {{ fullReport.productsMap?.[productId]?.itemName || 'Unknown Product' }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {{ openingQty }}
                </td>
                <td
                  v-if="Object.keys(fullReport.closingStock).length > 0"
                  class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {{ fullReport.closingStock[productId] || 0 }}
                </td>
                <td class="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                  GHS
                  {{ formatNumber(fullReport.productsMap?.[productId]?.costPrice || 0) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Additional Stock Section -->
        <div v-if="fullReport.additionalStock && fullReport.additionalStock.length > 0">
          <h4 class="text-sm font-medium text-gray-900 mb-3">Additional Stock Added</h4>
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
                    Category
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quantity
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Cost
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="stock in fullReport.additionalStock"
                  :key="stock.id"
                  class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm text-gray-900">
                    {{ stock.product?.itemName || 'Unknown' }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-600">
                    {{ stock.product?.category || '-' }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ stock.quantity }}</td>
                  <td class="px-4 py-3 text-sm font-semibold text-gray-900">
                    GHS {{ formatNumber(stock.totalCost) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-600">
                    {{ formatDate(stock.purchaseDate) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p class="text-sm text-gray-700">
              <span class="font-medium">Total Additional Stock Value:</span>
              <span class="text-blue-600 font-semibold">
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
import { ref, watch } from 'vue';

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

watch(
  () => props.report,
  () => {
    if (props.report) {
      fetchFullReport();
    }
  },
);
</script>
