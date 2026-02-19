<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Record Additional Stock
          </h1>
          <NuxtLink
            to="/stock-reports"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            ← Back to Reports
          </NuxtLink>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Form Card -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          New Stock Purchase
        </h2>

        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Product Selection -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product <span class="text-red-600">*</span>
            </label>
            <div class="flex gap-2">
              <input
                v-model="formData.productSearch"
                type="text"
                placeholder="Search products..."
                class="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white px-3 py-2 border" />
              <button
                @click="formData.productSearch = ''"
                v-if="formData.productSearch"
                class="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium">
                ✕
              </button>
            </div>

            <!-- Product list dropdown -->
            <select
              v-if="filteredProducts.length > 0 && formData.productSearch"
              v-model="formData.productId"
              size="5"
              class="mt-2 w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white px-3 py-2 border">
              <option value="">Choose a product...</option>
              <option
                v-for="product in filteredProducts"
                :key="product.id"
                :value="product.id">
                {{ product.itemName }} - Current Stock: {{ product.currentStock }}
              </option>
            </select>

            <!-- Selected product display -->
            <div
              v-if="selectedProduct"
              class="mt-2 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md">
              <p class="text-sm font-medium text-green-800 dark:text-green-200">
                ✓ Selected: {{ selectedProduct.itemName }}
              </p>
              <p class="text-sm text-green-700 dark:text-green-300 mt-1">
                Category: {{ selectedProduct.category }} | Current Stock:
                {{ selectedProduct.currentStock }}
              </p>
            </div>

            <div
              v-if="formData.productSearch && filteredProducts.length === 0"
              class="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-md text-sm text-yellow-800 dark:text-yellow-200">
              No products found. Try a different search.
            </div>
          </div>

          <!-- Quantity -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantity <span class="text-red-600">*</span>
            </label>
            <input
              v-model.number="formData.quantity"
              type="number"
              min="1"
              class="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white px-3 py-2 border"
              placeholder="Enter quantity" />
          </div>

          <!-- Cost Per Unit -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cost Per Unit (GHS) <span class="text-red-600">*</span>
            </label>
            <input
              v-model.number="formData.costPerUnit"
              type="number"
              step="0.01"
              min="0"
              class="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white px-3 py-2 border"
              placeholder="Enter cost per unit" />
          </div>

          <!-- Total Cost Display -->
          <div
            v-if="formData.quantity && formData.costPerUnit"
            class="p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
            <p class="text-sm text-blue-700 dark:text-blue-200">
              <span class="font-medium">Total Cost:</span>
              <span class="font-semibold text-lg text-blue-900 dark:text-blue-100">
                GHS {{ formatNumber(formData.quantity * formData.costPerUnit) }}
              </span>
            </p>
          </div>

          <!-- Supplier -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Supplier
            </label>
            <input
              v-model="formData.supplier"
              type="text"
              class="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white px-3 py-2 border"
              placeholder="Supplier name (optional)" />
          </div>

          <!-- Invoice Number -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Invoice Number
            </label>
            <input
              v-model="formData.invoiceNumber"
              type="text"
              class="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white px-3 py-2 border"
              placeholder="Invoice number (optional)" />
          </div>

          <!-- Purchase Date -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Purchase Date
            </label>
            <input
              v-model="formData.purchaseDate"
              type="date"
              class="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white px-3 py-2 border" />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Defaults to today if not specified
            </p>
          </div>

          <!-- Notes -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              v-model="formData.notes"
              class="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white px-3 py-2 border"
              rows="3"
              placeholder="Additional notes (optional)"></textarea>
          </div>

          <!-- Error Message -->
          <div
            v-if="error"
            class="p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg">
            {{ error }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="
              loading ||
              !formData.productId ||
              !formData.quantity ||
              !formData.costPerUnit
            "
            class="w-full px-4 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2">
            <span v-if="loading" class="animate-spin">
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? 'Recording...' : 'Record Stock Purchase' }}
          </button>
        </form>
      </div>

      <!-- Recent Stock Records -->
      <div
        v-if="recentRecords.length > 0"
        class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Recent Stock Records (This Week)
          </h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cost/Unit
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Cost
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Supplier
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody
              class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="record in recentRecords"
                :key="record.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ record.product.itemName }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {{ record.quantity }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  GHS {{ formatNumber(record.costPerUnit) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                  GHS {{ formatNumber(record.totalCost) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {{ record.supplier || '-' }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {{ formatDate(record.purchaseDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="deleteRecord(record.id)"
                    class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Records Message -->
      <div v-else class="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
        <p class="text-gray-600 dark:text-gray-400">
          No stock records added this week yet.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'role', role: 'manageStock' });

const config = useRuntimeConfig();
const router = useRouter();

const formData = ref({
  productId: '',
  productSearch: '',
  quantity: null,
  costPerUnit: null,
  supplier: '',
  invoiceNumber: '',
  purchaseDate: new Date().toISOString().split('T')[0],
  notes: '',
});

const products = ref([]);
const recentRecords = ref([]);
const loading = ref(false);
const error = ref('');

const selectedProduct = computed(() => {
  return products.value.find(p => p.id === formData.value.productId) || null;
});

const filteredProducts = computed(() => {
  const search = formData.value.productSearch.toLowerCase();
  return products.value.filter(
    p =>
      p.itemName.toLowerCase().includes(search) ||
      (p.barcodeNumber && p.barcodeNumber.toLowerCase().includes(search)),
  );
});

const formatNumber = num => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num || 0);
};

const formatDate = dateStr => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const fetchProducts = async () => {
  try {
    const { $api } = useNuxtApp();
    const data = await $api.get('/products', { limit: 1000 });
    products.value = data.products || [];
  } catch (err) {
    error.value = 'Failed to load products';
    console.error(err);
  }
};

const fetchRecentRecords = async () => {
  try {
    const { $api } = useNuxtApp();
    const today = new Date();
    const weekNumber = getWeekNumber(today);
    const year = today.getFullYear();

    const data = await $api.get('/stock-reports/additional-stock', {
      weekNumber,
      year,
    });
    recentRecords.value = data.additionalStock || [];
  } catch (err) {
    console.error('Failed to load recent records:', err);
  }
};

const getWeekNumber = date => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

const submitForm = async () => {
  try {
    error.value = '';
    loading.value = true;
    const { $api } = useNuxtApp();

    if (
      !formData.value.productId ||
      !formData.value.quantity ||
      !formData.value.costPerUnit
    ) {
      error.value = 'Please fill in all required fields';
      return;
    }

    await $api.post('/stock-reports/additional-stock/record', {
      productId: formData.value.productId,
      quantity: formData.value.quantity,
      costPerUnit: formData.value.costPerUnit,
      supplier: formData.value.supplier || null,
      invoiceNumber: formData.value.invoiceNumber || null,
      purchaseDate: formData.value.purchaseDate,
      notes: formData.value.notes || null,
    });

    formData.value = {
      productId: '',
      productSearch: '',
      quantity: null,
      costPerUnit: null,
      supplier: '',
      invoiceNumber: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      notes: '',
    };

    await fetchRecentRecords();
    await fetchProducts();
  } catch (err) {
    error.value = err.message || 'Error recording stock';
  } finally {
    loading.value = false;
  }
};

const deleteRecord = async recordId => {
  if (!confirm('Are you sure you want to delete this stock record?')) return;

  try {
    const { $api } = useNuxtApp();

    await $api.delete(`/stock-reports/additional-stock/${recordId}`);
    await fetchRecentRecords();
    await fetchProducts();
  } catch (err) {
    error.value = 'Error deleting record';
    console.error(err);
  }
};

onMounted(() => {
  fetchProducts();
  fetchRecentRecords();
});
</script>
