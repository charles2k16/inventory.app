<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <!-- Dashboard Content -->
      <div v-else>
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <!-- Total Products -->
          <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 text-gray-400 dark:text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt
                      class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Products
                    </dt>
                    <dd class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ stats?.overview?.totalProducts || 0 }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Total Stock Value -->
          <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 text-gray-400 dark:text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt
                      class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Stock Value
                    </dt>
                    <dd class="text-lg font-semibold text-gray-900 dark:text-white">
                      GHS {{ formatNumber(stats?.overview?.totalStockValue) }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Today's Sales -->
          <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 text-gray-400 dark:text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt
                      class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Today's Sales
                    </dt>
                    <dd class="text-lg font-semibold text-gray-900 dark:text-white">
                      GHS {{ formatNumber(stats?.sales?.today?.amount) }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Outstanding Debt -->
          <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 text-gray-400 dark:text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt
                      class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Debt
                    </dt>
                    <dd class="text-lg font-semibold text-red-600 dark:text-red-400">
                      GHS {{ formatNumber(stats?.overview?.totalDebt) }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts and Tables Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Sales Chart -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Sales Trend
            </h3>
            <div class="h-64">
              <canvas ref="salesChart"></canvas>
            </div>
          </div>

          <!-- Top Selling Products -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Top Selling Products
            </h3>
            <div class="flow-root">
              <ul class="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
                <li
                  v-for="item in stats?.topSellingProducts"
                  :key="item.product?.id"
                  class="py-4">
                  <div class="flex items-center space-x-4">
                    <div class="flex-1 min-w-0">
                      <p
                        class="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {{ item.product?.itemName }}
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ item.quantitySold }} units sold
                      </p>
                    </div>
                    <div class="text-sm font-semibold text-gray-900 dark:text-white">
                      GHS {{ formatNumber(item.totalRevenue) }}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Recent Sales and Low Stock -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Recent Sales -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Recent Sales
            </h3>
            <div class="flow-root">
              <ul class="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
                <li v-for="sale in stats?.recentSales" :key="sale.id" class="py-4">
                  <div class="flex items-center space-x-4">
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ sale.product?.itemName }}
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ formatDate(sale.saleDate) }}
                      </p>
                    </div>
                    <div class="flex flex-col items-end">
                      <span class="text-sm font-semibold text-gray-900 dark:text-white">
                        GHS {{ formatNumber(sale.totalAmount) }}
                      </span>
                      <span
                        :class="[
                          'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                          sale.paymentStatus === 'PAID'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                        ]">
                        {{ sale.paymentStatus }}
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- Low Stock Alert -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                Low Stock Alert
              </h3>
              <span
                class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                {{ stats?.overview?.lowStockCount || 0 }} items
              </span>
            </div>
            <div class="flow-root">
              <ul class="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
                <li
                  v-for="product in stats?.lowStockProducts"
                  :key="product.id"
                  class="py-4">
                  <div class="flex items-center space-x-4">
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ product.itemName }}
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        Reorder level: {{ product.reorderLevel }}
                      </p>
                    </div>
                    <div class="text-sm font-semibold text-red-600 dark:text-red-400">
                      {{ product.currentStock }} left
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRuntimeConfig } from 'nuxt/app';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface DashboardStats {
  overview?: {
    totalProducts: number;
    totalStockValue: number;
    totalDebt: number;
    lowStockCount: number;
  };
  sales?: {
    today?: {
      amount: number;
    };
  };
  topSellingProducts?: Array<{
    id: string;
    product?: {
      id: string;
      itemName: string;
    };
    quantitySold: number;
    totalRevenue: number;
  }>;
  recentSales?: Array<{
    id: string;
    product?: {
      itemName: string;
    };
    quantity: number;
    totalAmount: number;
    saleDate: string;
    paymentStatus: string;
  }>;
  lowStockProducts?: Array<{
    id: string;
    itemName: string;
    currentStock: number;
    reorderLevel: number;
  }>;
}

const config = useRuntimeConfig();
const stats = ref<DashboardStats | null>(null);
const loading = ref(true);
const salesChart = ref<HTMLCanvasElement | null>(null);

const formatNumber = (num?: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num || 0);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const fetchDashboardStats = async () => {
  try {
    const response = await fetch(`${config.public.apiBase}/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    stats.value = await response.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
  } finally {
    loading.value = false;
  }
};

const initSalesChart = async () => {
  try {
    const response = await fetch(`${config.public.apiBase}/dashboard/sales-chart`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const chartData = await response.json();

    if (salesChart.value) {
      new Chart(salesChart.value, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: 'Sales (GHS)',
              data: chartData.data,
              borderColor: 'rgb(14, 165, 233)',
              backgroundColor: 'rgba(14, 165, 233, 0.1)',
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }
  } catch (error) {
    console.error('Error initializing chart:', error);
  }
};

onMounted(async () => {
  await fetchDashboardStats();
  await initSalesChart();
});
</script>
