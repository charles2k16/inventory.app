<template>
  <div>
    <header class="bg-white dark:bg-gray-800 shadow">
      <div
        class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Weekly Stock Reports
        </h1>
        <div class="flex gap-3">
          <NuxtLink
            to="/stock-records"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            + Add Stock
          </NuxtLink>
          <button
            @click="createNewReport"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
            + Create Report
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Current Week Card -->
      <div
        v-if="currentReport"
        class="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 dark:border-blue-600 p-6 mb-6 rounded-r-lg">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-blue-800 dark:text-blue-200">
              Current Week Report
            </p>
            <p class="text-lg font-semibold text-blue-900 dark:text-blue-100 mt-1">
              Week {{ currentReport.weekNumber }} - {{ currentReport.year }}
            </p>
            <p class="text-sm text-blue-700 dark:text-blue-200 mt-2">
              Opening Stock Value: GHS {{ formatNumber(currentReport.totalValue) }}
            </p>
            <p
              v-if="
                currentReport.additionalStock && currentReport.additionalStock.length > 0
              "
              class="text-sm text-blue-700 dark:text-blue-200">
              Additional Stock Value: GHS
              {{ formatNumber(currentReport.additionalStockValue) }}
            </p>
            <p class="text-sm font-medium text-blue-900 dark:text-blue-100 mt-2">
              Expected Total Value: GHS
              {{
                formatNumber(
                  parseFloat(currentReport.totalValue) +
                    parseFloat(currentReport.additionalStockValue || 0),
                )
              }}
            </p>
            <p
              v-if="
                currentReport.closingStock &&
                Object.keys(currentReport.closingStock).length > 0
              "
              class="text-sm font-medium text-green-700 dark:text-green-200 mt-2">
              Goods Sold: GHS
              {{
                formatNumber(
                  parseFloat(currentReport.totalValue) +
                    parseFloat(currentReport.additionalStockValue || 0) -
                    calculateClosingStockValue(currentReport),
                )
              }}
            </p>
          </div>
          <button
            @click="closeCurrentReport"
            v-if="
              !currentReport.closingStock ||
              Object.keys(currentReport.closingStock).length === 0
            "
            :disabled="closingLoading"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
            {{ closingLoading ? 'Closing...' : 'Close Report' }}
          </button>
          <button
            v-else
            @click="selectedReport = currentReport"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
            View Details
          </button>
        </div>
      </div>

      <!-- Reports Table -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">All Reports</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Week
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Period
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Opening Stock
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="reports.length === 0">
                <td
                  colspan="5"
                  class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No reports found
                </td>
              </tr>
              <tr
                v-for="report in reports"
                :key="report.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  W{{ report.weekNumber }}/{{ report.year }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(report.startDate) }} - {{ formatDate(report.endDate) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                  GHS {{ formatNumber(report.totalValue) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      Object.keys(report.closingStock).length > 0
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                    ]">
                    {{ Object.keys(report.closingStock).length > 0 ? 'Closed' : 'Open' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    @click="selectedReport = report"
                    class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300">
                    View
                  </button>
                  <button
                    v-if="Object.keys(report.closingStock).length > 0"
                    @click="viewVariance(report)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                    Variance
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="totalPages > 1"
          class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Showing {{ (currentPage - 1) * limit + 1 }} to
            {{ Math.min(currentPage * limit, pagination.total) }} of
            {{ pagination.total }} reports
          </div>
          <div class="flex gap-2">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50">
              Previous
            </button>
            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Report Details Modal -->
      <ReportDetailsModal :report="selectedReport" @close="selectedReport = null" />

      <!-- Variance Modal -->
      <VarianceModal :variance="varianceData" @close="varianceData = null" />
    </main>
  </div>
</template>

<script setup>
import ReportDetailsModal from '~/components/ReportDetailsModal.vue';
import VarianceModal from '~/components/VarianceModal.vue';

definePageMeta({ middleware: 'role', role: 'manageReports' });

const config = useRuntimeConfig();
const reports = ref([]);
const currentReport = ref(null);
const selectedReport = ref(null);
const varianceData = ref(null);
const currentPage = ref(1);
const limit = 20;
const pagination = ref({ total: 0, pages: 1 });
const closingLoading = ref(false);

const totalPages = computed(() => pagination.value.pages);

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

const fetchReports = async () => {
  try {
    const { $api } = useNuxtApp();
    const data = await $api.get('/stock-reports', {
      page: currentPage.value,
      limit,
    });
    reports.value = data.reports || [];
    pagination.value = data.pagination || {};
  } catch (error) {
    console.error('Error fetching reports:', error);
  }
};

const fetchCurrentReport = async () => {
  try {
    const { $api } = useNuxtApp();
    const data = await $api.get('/stock-reports/current');
    currentReport.value = data;
  } catch (error) {
    console.error('Error fetching current report:', error);
  }
};

const createNewReport = async () => {
  try {
    const { $api } = useNuxtApp();
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    await $api.post('/stock-reports', {
      startDate: startOfWeek.toISOString(),
      endDate: endOfWeek.toISOString(),
    });

    await fetchCurrentReport();
    await fetchReports();
  } catch (error) {
    console.error('Error creating report:', error);
  }
};

const closeCurrentReport = async () => {
  try {
    closingLoading.value = true;
    const { $api } = useNuxtApp();

    await $api.patch(`/stock-reports/${currentReport.value.id}/close`, {});
    await fetchCurrentReport();
    await fetchReports();
  } catch (error) {
    console.error('Error closing report:', error);
  } finally {
    closingLoading.value = false;
  }
};

const viewVariance = async report => {
  try {
    const { $api } = useNuxtApp();
    const data = await $api.get(`/stock-reports/${report.id}/variance`);
    varianceData.value = data;
  } catch (error) {
    console.error('Error fetching variance:', error);
  }
};

watch(currentPage, () => {
  fetchReports();
});

onMounted(() => {
  fetchReports();
  fetchCurrentReport();
});
</script>
