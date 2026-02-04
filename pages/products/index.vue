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
                  @click="editProduct(product)"
                  class="text-primary-600 hover:text-primary-900 mr-3">
                  Edit
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

const editProduct = product => {
  console.log('Edit product:', product);
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
