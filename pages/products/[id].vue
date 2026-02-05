<template>
  <div>
    <header class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ product?.itemName || 'Loading...' }}
            </h1>
            <p
              class="text-sm text-gray-500 dark:text-gray-400 mt-1"
              v-if="product?.barcodeNumber">
              Barcode: {{ product.barcodeNumber }}
            </p>
          </div>
          <div class="flex gap-3">
            <button
              v-if="!loading && !error && product"
              @click="showUpdateStockModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
              📦 Update Stock
            </button>
            <NuxtLink
              to="/products"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              ← Back to Products
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div class="flex flex-col items-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300">Loading product details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div
        class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
        <p class="text-red-800 dark:text-red-200">{{ error }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <main
      v-if="!loading && !error && product"
      class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Tab Navigation -->
      <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div class="flex space-x-8">
          <button
            @click="activeTab = 'details'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'details'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600',
            ]">
            Details
          </button>
          <button
            @click="activeTab = 'transactions'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'transactions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]">
            Transactions
          </button>
        </div>
      </div>

      <!-- Details Tab -->
      <div v-if="activeTab === 'details'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Main Info Card -->
        <div class="md:col-span-2 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Product Information
          </h2>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Product Name</label
              >
              <p class="mt-1 text-gray-900 dark:text-white font-medium">
                {{ product.itemName }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Category</label
              >
              <p class="mt-1 text-gray-900 dark:text-white">{{ product.category }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Barcode Number</label
              >
              <p class="mt-1 text-gray-900 dark:text-white">
                {{ product.barcodeNumber || 'N/A' }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Product Number</label
              >
              <p class="mt-1 text-gray-900 dark:text-white">#{{ product.itemNumber }}</p>
            </div>

            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Description</label
              >
              <p class="mt-1 text-gray-900 dark:text-white">
                {{ product.itemDescription || 'No description' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Stock Info Card -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Stock Information
          </h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Current Stock</label
              >
              <p
                :class="[
                  'mt-1 text-2xl font-bold',
                  product.currentStock <= product.reorderLevel
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-green-600 dark:text-green-400',
                ]">
                {{ product.currentStock }} {{ product.units }}
              </p>
            </div>

            <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Reorder Level</label
              >
              <p class="mt-1 text-gray-900 dark:text-white">{{ product.reorderLevel }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Selling Price</label
              >
              <p class="mt-1 text-gray-900 dark:text-white">
                GHS {{ formatNumber(product.sellingPrice) }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Cost Price</label
              >
              <p class="mt-1 text-gray-900">GHS {{ formatNumber(product.costPrice) }}</p>
            </div>

            <div class="pt-4 border-t border-gray-200">
              <label class="block text-sm font-medium text-gray-700">Stock Value</label>
              <p class="mt-1 text-lg font-semibold text-gray-900">
                GHS {{ formatNumber(product.currentStock * product.sellingPrice) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="md:col-span-3 bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Additional Information</h2>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Location</label>
              <p class="mt-1 text-gray-900">{{ product.locationName }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Units</label>
              <p class="mt-1 text-gray-900">{{ product.units }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Type</label>
              <p class="mt-1 text-gray-900">{{ product.type }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Created</label>
              <p class="mt-1 text-gray-900 text-sm">
                {{ formatDate(product.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Transactions Tab -->
      <div v-if="activeTab === 'transactions'" class="bg-white shadow rounded-lg">
        <div class="p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-6">Stock Movements</h2>

          <div
            v-if="!product.stockMovements || product.stockMovements.length === 0"
            class="text-center py-12">
            <p class="text-gray-500 dark:text-gray-400">
              No stock movements recorded yet
            </p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Qty Before
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Change
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Qty After
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Reason
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Notes
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created By
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="movement in product.stockMovements"
                  :key="movement.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ formatDate(movement.createdAt) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                        getMovementTypeColor(movement.type),
                      ]">
                      {{ movement.type }}
                    </span>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ movement.quantityBefore }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span
                      :class="
                        movement.type === 'OUT' || movement.type === 'ADJUSTMENT'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-green-600 dark:text-green-400'
                      ">
                      {{
                        movement.type === 'OUT' || movement.type === 'ADJUSTMENT'
                          ? '-'
                          : '+'
                      }}{{ movement.quantity }}
                    </span>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ movement.quantityAfter }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ movement.reason || '-' }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {{ movement.notes || '-' }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ movement.createdBy || '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Update Stock Modal -->
      <StockUpdateModal
        :is-open="showUpdateStockModal"
        :product="product"
        :is-loading="updateStockLoading"
        :error="stockUpdateError"
        @close="showUpdateStockModal = false"
        @submit="updateStock" />
    </main>
  </div>
</template>

<script setup>
const route = useRoute();
const config = useRuntimeConfig();

const product = ref(null);
const loading = ref(true);
const error = ref('');
const activeTab = ref('details');
const showUpdateStockModal = ref(false);
const updateStockLoading = ref(false);
const stockUpdateError = ref('');

const formatNumber = num => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num || 0);
};

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

const getMovementTypeColor = type => {
  const colors = {
    IN: 'bg-green-100 text-green-800',
    OUT: 'bg-red-100 text-red-800',
    ADJUSTMENT: 'bg-yellow-100 text-yellow-800',
    RETURN: 'bg-blue-100 text-blue-800',
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
};

const fetchProduct = async () => {
  try {
    loading.value = true;
    error.value = '';

    const response = await fetch(`${config.public.apiBase}/products/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product details');
    }

    const data = await response.json();
    product.value = data;
  } catch (err) {
    error.value = err.message || 'Error loading product details';
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
};

const updateStock = async formData => {
  try {
    updateStockLoading.value = true;
    stockUpdateError.value = '';

    const stockChange =
      formData.action === 'add' ? formData.quantity : -formData.quantity;

    const response = await fetch(
      `${config.public.apiBase}/products/${route.params.id}/update-stock`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          stockChange,
          reason: formData.reason || 'ADJUSTMENT',
          notes: formData.notes,
          quantityBefore: product.value.currentStock,
          quantityAfter:
            formData.action === 'add'
              ? product.value.currentStock + formData.quantity
              : Math.max(0, product.value.currentStock - formData.quantity),
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update stock');
    }

    // Reset modal
    showUpdateStockModal.value = false;

    // Refresh product data
    await fetchProduct();
  } catch (err) {
    stockUpdateError.value = err.message || 'Failed to update stock';
  } finally {
    updateStockLoading.value = false;
  }
};

onMounted(() => {
  fetchProduct();
});
</script>
