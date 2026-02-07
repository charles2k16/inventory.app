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
          <button
            @click="showNewSaleModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
            + New Sale
          </button>
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
          @update-payment="updatePaymentModal" />
      </div>
    </main>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const showNewSaleModal = ref(false);
const sales = ref([]);
const search = ref('');
const paymentStatus = ref('');
const dateRange = ref('today');
const loadingStats = ref(false);

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

const filteredSales = computed(() => {
  const { start, end } = getDateRange();

  return sales.value.filter(sale => {
    const saleDate = new Date(sale.createdAt);
    const matchesDate = saleDate >= start && saleDate < end;
    const matchesSearch =
      !search.value ||
      (sale.lenderName &&
        sale.lenderName.toLowerCase().includes(search.value.toLowerCase())) ||
      (sale.customerName &&
        sale.customerName.toLowerCase().includes(search.value.toLowerCase()));
    const matchesPayment =
      !paymentStatus.value || sale.paymentStatus === paymentStatus.value;

    return matchesDate && matchesSearch && matchesPayment;
  });
});

const calculateSummary = () => {
  const filtered = filteredSales.value;

  summaryStats.value = {
    totalSales: filtered.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0),
    salesCount: filtered.length,
    totalItems: filtered.reduce((sum, sale) => sum + (sale.items?.length || 0), 0),
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
      totalItems: filteredSales.value.reduce(
        (sum, sale) => sum + (sale.items?.length || 0),
        0,
      ),
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
    const salesData = await $api.get('/sales');
    sales.value = salesData.sales || [];
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

const updatePaymentModal = sale => {
  // Open payment update modal
  console.log('Update payment for:', sale);
};

onMounted(() => {
  fetchSales();
  fetchSummaryStats();
});
</script>
