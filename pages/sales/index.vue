<template>
  <div>
    <header class="bg-white dark:bg-gray-800 shadow">
      <div
        class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Sales</h1>
        <div class="flex gap-3">
          <NuxtLink
            to="/sales/bulk-create"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            + Bulk Sale
          </NuxtLink>
          <!-- <button
            @click="showNewSaleModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
            + New Sale
          </button> -->
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Date Range Selector -->
      <DateRangeSelector v-model="dateRange" @update:range="dateRange = $event" />

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ dateRangeLabel }}'s Sales
          </h3>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            GHS {{ formatNumber(summaryStats.totalSales) }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ summaryStats.salesCount }} sales
          </p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Items Sold</h3>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {{ summaryStats.totalItems }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ dateRangeLabel }}
          </p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Pending Payments
          </h3>
          <p class="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">
            GHS {{ formatNumber(summaryStats.pendingAmount) }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ summaryStats.pendingCount }} sales
          </p>
        </div>
      </div>

      <!-- Filters -->
      <SalesFilters
        v-model:search="search"
        v-model:paymentStatus="paymentStatus"
        @clear="clearFilters" />

      <!-- Sales Table -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Sales
          </h3>
        </div>
        <SalesTable
          :sales="filteredSales"
          @view="viewSale"
          @update-payment="openPaymentModal" />

        <ProductPagination
          :current-page="currentPage"
          :total-pages="totalPages"
          :start-index="startIndex"
          :end-index="endIndex"
          :total-items="totalItems"
          @update:page="currentPage = $event" />
      </div>

      <!-- Update Payment Modal -->
      <div
        v-if="showPaymentModal && selectedSaleForPayment"
        class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
          <div
            class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Update Payment
            </h3>
            <button
              @click="closePaymentModal"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              ✕
            </button>
          </div>

          <div class="px-6 py-4 space-y-4">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              <p class="font-medium">
                {{
                  selectedSaleForPayment.lenderName ||
                  selectedSaleForPayment.customerName ||
                  'Walk-in'
                }}
              </p>
              <p class="mt-1">
                Total:
                <span class="font-semibold">
                  GHS {{ formatNumber(selectedSaleForPayment.totalAmount) }}
                </span>
              </p>
              <p>
                Amount Due:
                <span class="font-semibold">
                  GHS {{ formatNumber(selectedSaleForPayment.amountDue) }}
                </span>
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount to pay now
              </label>
              <input
                v-model.number="paymentAmount"
                type="number"
                min="0"
                :max="selectedSaleForPayment.amountDue"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payment Method
              </label>
              <select
                v-model="paymentMethod"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                <option value="CASH">Cash</option>
                <option value="CREDIT">Credit</option>
                <option value="CHEQUE">Cheque</option>
                <option value="TRANSFER">Transfer</option>
              </select>
            </div>

            <p
              v-if="paymentError"
              class="text-sm text-red-600 dark:text-red-400">
              {{ paymentError }}
            </p>
          </div>

          <div
            class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
            <button
              @click="closePaymentModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button
              @click="submitPaymentUpdate"
              :disabled="paymentLoading || paymentAmount <= 0"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ paymentLoading ? 'Saving...' : 'Save Payment' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const sales = ref([]);
const search = ref('');
const paymentStatus = ref('');
const dateRange = ref('today');
const loadingStats = ref(false);
const currentPage = ref(1);
const limit = 50;
const pagination = ref({ total: 0, pages: 1 });

const summaryStats = ref({
  totalSales: 0,
  salesCount: 0,
  totalItems: 0,
  pendingAmount: 0,
  pendingCount: 0,
});

const formatNumber = num => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num || 0);
};

const dateRangeLabel = computed(() => {
  const labels = {
    today: 'Today',
    week: 'This Week',
    month: 'This Month',
    all: 'All Time',
  };
  return labels[dateRange.value] || 'Today';
});

const getDateRange = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (dateRange.value) {
    case 'today':
      return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000) };
    case 'week': {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      return { start: weekStart, end: new Date() };
    }
    case 'month': {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: monthStart, end: new Date() };
    }
    case 'all':
      return { start: new Date('2000-01-01'), end: new Date() };
    default:
      return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000) };
  }
};

const totalPages = computed(() => pagination.value.pages || 1);

const startIndex = computed(() => {
  if (!pagination.value.total) return 0;
  return (currentPage.value - 1) * limit;
});

const endIndex = computed(() => {
  if (!pagination.value.total) return 0;
  return Math.min(currentPage.value * limit, pagination.value.total);
});

const totalItems = computed(() => pagination.value.total || 0);

const filteredSales = computed(() => {
  return sales.value.filter(sale => {
    const matchesSearch =
      !search.value ||
      (sale.lenderName &&
        sale.lenderName.toLowerCase().includes(search.value.toLowerCase())) ||
      (sale.customerName &&
        sale.customerName.toLowerCase().includes(search.value.toLowerCase()));
    const matchesPayment =
      !paymentStatus.value || sale.paymentStatus === paymentStatus.value;

    return matchesSearch && matchesPayment;
  });
});

const calculateSummary = () => {
  const filtered = filteredSales.value;

  summaryStats.value = {
    totalSales: filtered.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0),
    salesCount: filtered.length,
    totalItems: filtered.reduce(
      (sum, sale) =>
        sum +
        (sale.items?.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0) || 0),
      0,
    ),
    pendingAmount: filtered
      .filter(s => s.paymentStatus === 'UNPAID' || s.paymentStatus === 'PARTIAL')
      .reduce((sum, sale) => sum + (sale.amountDue || 0), 0),
    pendingCount: filtered.filter(
      s => s.paymentStatus === 'UNPAID' || s.paymentStatus === 'PARTIAL',
    ).length,
  };
};

const fetchSummaryStats = async () => {
  try {
    loadingStats.value = true;
    const { $api } = useNuxtApp();
    const { start, end } = getDateRange();
    const startDate = start.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];

    const data = await $api.get('/sales/summary', { startDate, endDate });

    summaryStats.value = {
      totalSales: data.totalRevenue || 0,
      salesCount: data.totalSales || 0,
      totalItems: data.totalItems || 0,
      pendingAmount: data.pendingPayments || 0,
      pendingCount: filteredSales.value.filter(
        s => s.paymentStatus === 'UNPAID' || s.paymentStatus === 'PARTIAL',
      ).length,
    };
  } catch (error) {
    console.error('Error fetching summary stats:', error);
    calculateSummary();
  } finally {
    loadingStats.value = false;
  }
};

watch(dateRange, () => {
  fetchSales();
  fetchSummaryStats();
});

watch(filteredSales, () => {
  fetchSummaryStats();
});

const fetchSales = async () => {
  try {
    const { $api } = useNuxtApp();
    const { start, end } = getDateRange();
    const startDate = start.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];

    const params = {
      startDate,
      endDate,
      page: currentPage.value,
      limit,
    };

    // Optionally filter by payment status on the backend as well
    if (paymentStatus.value) {
      params.status = paymentStatus.value;
    }

    const salesData = await $api.get('/sales', params);
    sales.value = salesData.sales || [];
    pagination.value = salesData.pagination || {
      total: sales.value.length,
      pages: 1,
    };
  } catch (error) {
    console.error('Error fetching sales:', error);
  }
};

const clearFilters = () => {
  search.value = '';
  paymentStatus.value = '';
};

const viewSale = sale => {
  // Navigate to sale details or open modal
  navigateTo(`/sales/${sale.id}`);
};

const showPaymentModal = ref(false);
const selectedSaleForPayment = ref(null);
const paymentAmount = ref(0);
const paymentMethod = ref('CASH');
const paymentLoading = ref(false);
const paymentError = ref('');

const openPaymentModal = sale => {
  selectedSaleForPayment.value = sale;
  const due =
    sale.amountDue != null
      ? sale.amountDue
      : (sale.totalAmount || 0) - (sale.amountPaid || 0);
  paymentAmount.value = Math.max(0, due);
  paymentMethod.value = sale.paymentMethod || 'CASH';
  paymentError.value = '';
  showPaymentModal.value = true;
};

const closePaymentModal = () => {
  showPaymentModal.value = false;
  selectedSaleForPayment.value = null;
  paymentAmount.value = 0;
  paymentMethod.value = 'CASH';
  paymentError.value = '';
};

const submitPaymentUpdate = async () => {
  if (!selectedSaleForPayment.value) return;

  if (!paymentAmount.value || paymentAmount.value <= 0) {
    paymentError.value = 'Please enter an amount greater than 0';
    return;
  }

  const maxDue =
    selectedSaleForPayment.value.amountDue != null
      ? selectedSaleForPayment.value.amountDue
      : (selectedSaleForPayment.value.totalAmount || 0) -
        (selectedSaleForPayment.value.amountPaid || 0);

  if (paymentAmount.value > maxDue) {
    paymentError.value = 'Amount cannot be greater than amount due';
    return;
  }

  try {
    paymentLoading.value = true;
    paymentError.value = '';
    const { $api } = useNuxtApp();

    await $api.patch(`/sales/${selectedSaleForPayment.value.id}/payment`, {
      amountPaid: paymentAmount.value,
      paymentMethod: paymentMethod.value,
    });

    closePaymentModal();
    await fetchSales();
    await fetchSummaryStats();
  } catch (error) {
    console.error('Error updating payment:', error);
    paymentError.value = error.message || 'Error updating payment';
  } finally {
    paymentLoading.value = false;
  }
};

watch(currentPage, () => {
  fetchSales();
});

onMounted(() => {
  fetchSales();
  fetchSummaryStats();
});
</script>
