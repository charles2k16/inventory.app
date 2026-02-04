<template>
  <div>
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ product?.itemName || 'Loading...' }}
            </h1>
            <p class="text-sm text-gray-500 mt-1" v-if="product?.barcodeNumber">
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
        <p class="text-gray-700">Loading product details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">{{ error }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <main
      v-if="!loading && !error && product"
      class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Tab Navigation -->
      <div class="border-b border-gray-200 mb-6">
        <div class="flex space-x-8">
          <button
            @click="activeTab = 'details'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'details'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
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
        <div class="md:col-span-2 bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-6">Product Information</h2>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Product Name</label>
              <p class="mt-1 text-gray-900 font-medium">{{ product.itemName }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Category</label>
              <p class="mt-1 text-gray-900">{{ product.category }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Barcode Number</label
              >
              <p class="mt-1 text-gray-900">{{ product.barcodeNumber || 'N/A' }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Product Number</label
              >
              <p class="mt-1 text-gray-900">#{{ product.itemNumber }}</p>
            </div>

            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <p class="mt-1 text-gray-900">
                {{ product.itemDescription || 'No description' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Stock Info Card -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-6">Stock Information</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Current Stock</label>
              <p
                :class="[
                  'mt-1 text-2xl font-bold',
                  product.currentStock <= product.reorderLevel
                    ? 'text-red-600'
                    : 'text-green-600',
                ]">
                {{ product.currentStock }} {{ product.units }}
              </p>
            </div>

            <div class="pt-4 border-t border-gray-200">
              <label class="block text-sm font-medium text-gray-700">Reorder Level</label>
              <p class="mt-1 text-gray-900">{{ product.reorderLevel }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Selling Price</label>
              <p class="mt-1 text-gray-900">
                GHS {{ formatNumber(product.sellingPrice) }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Cost Price</label>
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
            <p class="text-gray-500">No stock movements recorded yet</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty Before
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty After
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="movement in product.stockMovements" :key="movement.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ movement.quantityBefore }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span
                      :class="
                        movement.type === 'OUT' || movement.type === 'ADJUSTMENT'
                          ? 'text-red-600'
                          : 'text-green-600'
                      ">
                      {{
                        movement.type === 'OUT' || movement.type === 'ADJUSTMENT'
                          ? '-'
                          : '+'
                      }}{{ movement.quantity }}
                    </span>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ movement.quantityAfter }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ movement.reason || '-' }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    {{ movement.notes || '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ movement.createdBy || '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Update Stock Modal -->
      <div
        v-if="showUpdateStockModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div
          class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen flex flex-col">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Update Stock</h3>
          </div>

          <div class="p-6 space-y-4 overflow-y-auto flex-1">
            <!-- Current Stock Display -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-600">Current Stock</p>
              <p class="text-2xl font-bold text-gray-900">{{ product.currentStock }}</p>
            </div>

            <!-- Stock Change Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Action</label>
              <div class="flex gap-3">
                <button
                  @click="stockChangeType = 'add'"
                  :class="[
                    'flex-1 px-4 py-2 rounded-md font-medium text-sm transition',
                    stockChangeType === 'add'
                      ? 'bg-green-100 text-green-800 border-2 border-green-300'
                      : 'bg-gray-100 text-gray-700 border-2 border-gray-200',
                  ]">
                  ➕ Add Stock
                </button>
                <button
                  @click="stockChangeType = 'reduce'"
                  :class="[
                    'flex-1 px-4 py-2 rounded-md font-medium text-sm transition',
                    stockChangeType === 'reduce'
                      ? 'bg-red-100 text-red-800 border-2 border-red-300'
                      : 'bg-gray-100 text-gray-700 border-2 border-gray-200',
                  ]">
                  ➖ Reduce Stock
                </button>
              </div>
            </div>

            <!-- Quantity Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                v-model.number="stockChangeQty"
                type="number"
                min="1"
                placeholder="Enter quantity"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
            </div>

            <!-- Reason Select -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Reason</label>
              <select
                v-model="stockChangeReason"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                <option value="">Select reason</option>
                <option value="PURCHASE">Purchase</option>
                <option value="SALE">Sale</option>
                <option value="RETURN">Return</option>
                <option value="DAMAGE">Damage/Loss</option>
                <option value="ADJUSTMENT">Inventory Adjustment</option>
              </select>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Notes (Optional)</label
              >
              <textarea
                v-model="stockChangeNotes"
                placeholder="Add any additional notes..."
                rows="2"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"></textarea>
            </div>

            <!-- Preview -->
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-sm text-gray-600">Stock After Update</p>
              <p
                :class="[
                  'text-2xl font-bold',
                  stockChangeType === 'add' ? 'text-green-600' : 'text-red-600',
                ]">
                {{
                  stockChangeType === 'add'
                    ? product.currentStock + (stockChangeQty || 0)
                    : product.currentStock - (stockChangeQty || 0)
                }}
              </p>
            </div>
          </div>

          <div class="p-6 border-t border-gray-200 flex gap-3">
            <button
              @click="showUpdateStockModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium">
              Cancel
            </button>
            <button
              @click="updateStock"
              :disabled="updateStockLoading || !stockChangeQty || !stockChangeReason"
              class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2">
              <span
                v-if="updateStockLoading"
                class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></span>
              {{ updateStockLoading ? 'Updating...' : 'Update Stock' }}
            </button>
          </div>
        </div>
      </div>
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
const stockChangeType = ref('add');
const stockChangeQty = ref(null);
const stockChangeReason = ref('');
const stockChangeNotes = ref('');
const updateStockLoading = ref(false);

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

const updateStock = async () => {
  try {
    updateStockLoading.value = true;
    error.value = '';

    const newStock =
      stockChangeType.value === 'add'
        ? product.value.currentStock + stockChangeQty.value
        : product.value.currentStock - stockChangeQty.value;

    if (newStock < 0) {
      error.value = 'Stock cannot be negative';
      return;
    }

    const response = await fetch(
      `${config.public.apiBase}/products/${route.params.id}/update-stock`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          quantity: stockChangeQty.value,
          type: stockChangeType.value === 'add' ? 'IN' : 'OUT',
          reason: stockChangeReason.value,
          notes: stockChangeNotes.value,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update stock');
    }

    // Reset modal
    showUpdateStockModal.value = false;
    stockChangeQty.value = null;
    stockChangeReason.value = '';
    stockChangeNotes.value = '';
    stockChangeType.value = 'add';

    // Refresh product data
    await fetchProduct();
  } catch (err) {
    error.value = err.message || 'Failed to update stock';
  } finally {
    updateStockLoading.value = false;
  }
};

onMounted(() => {
  fetchProduct();
});
</script>
