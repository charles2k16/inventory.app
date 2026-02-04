<template>
  <div>
    <header class="bg-white shadow">
      <div
        class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Products</h1>
        <NuxtLink
          to="/products/add"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
          + Add Product
        </NuxtLink>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Search and Filters -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            v-model="search"
            type="text"
            placeholder="Search products..."
            class="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
          <select
            v-model="selectedCategory"
            class="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
            <option value="">All Categories</option>
            <option value="Equipment">Equipment</option>
            <option value="Tools">Tools</option>
          </select>
          <div class="flex items-center">
            <input
              id="low-stock"
              v-model="lowStockOnly"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
            <label for="low-stock" class="ml-2 block text-sm text-gray-900">
              Low Stock Only
            </label>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in paginatedProducts" :key="product.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ product.itemName }}
                </div>
                <div class="text-sm text-gray-500">{{ product.barcodeNumber }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ product.category }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    product.currentStock <= product.reorderLevel
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800',
                  ]">
                  {{ product.currentStock }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                GHS {{ formatNumber(product.sellingPrice) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                GHS {{ formatNumber(product.currentStock * product.sellingPrice) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="openEditModal(product)"
                  class="text-primary-600 hover:text-primary-900 mr-3">
                  Edit
                </button>
                <button
                  @click="openQuickStockModal(product)"
                  class="text-blue-600 hover:text-blue-900 mr-3">
                  Stock
                </button>
                <button
                  @click="viewProduct(product)"
                  class="text-gray-600 hover:text-gray-900">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ startIndex + 1 }}</span>
                to
                <span class="font-medium">{{ endIndex }}</span>
                of
                <span class="font-medium">{{ filteredProducts.length }}</span>
                results
              </p>
            </div>
            <nav
              class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination">
              <button
                @click="currentPage = Math.max(1, currentPage - 1)"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="sr-only">Previous</span>
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </button>
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium',
                  page === currentPage
                    ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:bg-gray-50',
                ]">
                {{ page }}
              </button>
              <button
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="sr-only">Next</span>
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </main>

    <!-- Edit Product Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div
        class="bg-white rounded-lg shadow-lg max-w-md w-full max-h-screen flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Edit Product</h3>
        </div>

        <div class="px-6 py-4 overflow-y-auto flex-1">
          <div
            v-if="editError"
            class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ editError }}
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                v-model="editFormData.itemName"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                v-model="editFormData.itemDescription"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                rows="3"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Category</label>
              <input
                v-model="editFormData.category"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Barcode</label>
              <input
                v-model="editFormData.barcodeNumber"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Cost Price</label>
                <input
                  v-model.number="editFormData.costPrice"
                  type="number"
                  step="0.01"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Selling Price</label
                >
                <input
                  v-model.number="editFormData.sellingPrice"
                  type="number"
                  step="0.01"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                  required />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Reorder Level</label>
              <input
                v-model.number="editFormData.reorderLevel"
                type="number"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border" />
            </div>

            <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
              <p class="text-sm font-medium text-gray-900 mb-2">
                Current Stock:
                <span class="text-primary-600">{{ editingProduct?.currentStock }}</span>
              </p>
              <p class="text-xs text-gray-600 mb-3">
                To update stock,
                <NuxtLink
                  :to="`/products/${editingProduct?.id}`"
                  class="text-primary-600 hover:text-primary-900 font-medium"
                  >click here</NuxtLink
                >
              </p>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
          <button
            @click="closeEditModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Cancel
          </button>
          <button
            @click="saveProductChanges"
            :disabled="editLoading"
            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <span v-if="editLoading" class="animate-spin">
              <svg
                class="h-4 w-4"
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
            {{ editLoading ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Stock Update Modal -->
    <div
      v-if="showQuickStockModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div
        class="bg-white rounded-lg shadow-lg max-w-md w-full max-h-screen flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Update Stock</h3>
          <p class="text-sm text-gray-500">{{ quickStockProduct?.itemName }}</p>
        </div>

        <div class="px-6 py-4 overflow-y-auto flex-1">
          <div
            v-if="quickStockError"
            class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ quickStockError }}
          </div>

          <div class="space-y-4">
            <div class="bg-gray-50 p-3 rounded-md border border-gray-200">
              <p class="text-sm text-gray-600">
                Current Stock:
                <span class="font-semibold text-gray-900">{{
                  quickStockProduct?.currentStock
                }}</span>
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Action</label>
              <div class="flex gap-4">
                <label class="flex items-center">
                  <input
                    v-model="quickStockFormData.action"
                    type="radio"
                    value="add"
                    class="h-4 w-4 rounded border-gray-300 text-primary-600" />
                  <span class="ml-2 text-sm text-gray-700">Add Stock</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="quickStockFormData.action"
                    type="radio"
                    value="reduce"
                    class="h-4 w-4 rounded border-gray-300 text-primary-600" />
                  <span class="ml-2 text-sm text-gray-700">Reduce Stock</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                v-model.number="quickStockFormData.quantity"
                type="number"
                min="1"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                placeholder="Enter quantity"
                required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Reason</label>
              <select
                v-model="quickStockFormData.reason"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border">
                <option value="">Select a reason</option>
                <option value="Purchase">Purchase</option>
                <option value="Return">Return</option>
                <option value="Damage">Damage</option>
                <option value="Loss">Loss</option>
                <option value="Adjustment">Adjustment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                v-model="quickStockFormData.notes"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                rows="2"
                placeholder="Additional notes..."></textarea>
            </div>

            <div
              v-if="quickStockFormData.quantity"
              class="bg-primary-50 p-3 rounded-md border border-primary-200">
              <p class="text-sm text-gray-700">
                <span
                  v-if="quickStockFormData.action === 'add'"
                  class="text-primary-600 font-semibold">
                  New stock:
                  {{ quickStockProduct?.currentStock + quickStockFormData.quantity }}
                </span>
                <span v-else class="text-primary-600 font-semibold">
                  New stock:
                  {{
                    Math.max(
                      0,
                      quickStockProduct?.currentStock - quickStockFormData.quantity,
                    )
                  }}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
          <button
            @click="closeQuickStockModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Cancel
          </button>
          <button
            @click="updateStockQuick"
            :disabled="quickStockLoading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <span v-if="quickStockLoading" class="animate-spin">
              <svg
                class="h-4 w-4"
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
            {{ quickStockLoading ? 'Updating...' : 'Update Stock' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const products = ref([]);
const search = ref('');
const selectedCategory = ref('');
const lowStockOnly = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);

const formatNumber = num => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num || 0);
};

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = product.itemName
      .toLowerCase()
      .includes(search.value.toLowerCase());
    const matchesCategory =
      !selectedCategory.value || product.category === selectedCategory.value;
    const matchesLowStock =
      !lowStockOnly.value || product.currentStock <= product.reorderLevel;
    return matchesSearch && matchesCategory && matchesLowStock;
  });
});

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value;
});

const endIndex = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, filteredProducts.value.length);
});

const paginatedProducts = computed(() => {
  return filteredProducts.value.slice(startIndex.value, endIndex.value);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const fetchProducts = async () => {
  try {
    const response = await fetch(`${config.public.apiBase}/products`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    products.value = data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

// Edit Modal
const showEditModal = ref(false);
const editingProduct = ref(null);
const editFormData = ref({});
const editLoading = ref(false);
const editError = ref('');

const openEditModal = product => {
  editingProduct.value = product;
  editFormData.value = {
    itemName: product.itemName,
    itemDescription: product.itemDescription,
    category: product.category,
    barcodeNumber: product.barcodeNumber,
    sellingPrice: product.sellingPrice,
    costPrice: product.costPrice,
    reorderLevel: product.reorderLevel,
  };
  editError.value = '';
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editingProduct.value = null;
  editFormData.value = {};
  editError.value = '';
};

const saveProductChanges = async () => {
  try {
    editError.value = '';
    editLoading.value = true;

    const response = await fetch(
      `${config.public.apiBase}/products/${editingProduct.value.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(editFormData.value),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      editError.value = error.message || 'Failed to update product';
      return;
    }

    await fetchProducts();
    closeEditModal();
  } catch (error) {
    editError.value = error.message || 'Error updating product';
  } finally {
    editLoading.value = false;
  }
};

// Quick Stock Update Modal
const showQuickStockModal = ref(false);
const quickStockProduct = ref(null);
const quickStockFormData = ref({
  action: 'add',
  quantity: null,
  reason: '',
  notes: '',
});
const quickStockLoading = ref(false);
const quickStockError = ref('');

const openQuickStockModal = product => {
  quickStockProduct.value = product;
  quickStockFormData.value = {
    action: 'add',
    quantity: null,
    reason: '',
    notes: '',
  };
  quickStockError.value = '';
  showQuickStockModal.value = true;
};

const closeQuickStockModal = () => {
  showQuickStockModal.value = false;
  quickStockProduct.value = null;
  quickStockFormData.value = {
    action: 'add',
    quantity: null,
    reason: '',
    notes: '',
  };
  quickStockError.value = '';
};

const updateStockQuick = async () => {
  try {
    quickStockError.value = '';

    if (!quickStockFormData.value.quantity || quickStockFormData.value.quantity <= 0) {
      quickStockError.value = 'Please enter a valid quantity';
      return;
    }

    quickStockLoading.value = true;

    const stockChange =
      quickStockFormData.value.action === 'add'
        ? quickStockFormData.value.quantity
        : -quickStockFormData.value.quantity;

    const response = await fetch(
      `${config.public.apiBase}/products/${quickStockProduct.value.id}/update-stock`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          stockChange,
          reason: quickStockFormData.value.reason || 'Manual adjustment',
          notes: quickStockFormData.value.notes,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      quickStockError.value = error.message || 'Failed to update stock';
      return;
    }

    await fetchProducts();
    closeQuickStockModal();
  } catch (error) {
    quickStockError.value = error.message || 'Error updating stock';
  } finally {
    quickStockLoading.value = false;
  }
};

const viewProduct = product => {
  navigateTo(`/products/${product.id}`);
};

// Reset to first page when filters change
watch([search, selectedCategory, lowStockOnly], () => {
  currentPage.value = 1;
});

onMounted(() => {
  fetchProducts();
});
</script>
