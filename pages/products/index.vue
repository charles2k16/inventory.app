<template>
  <div>
    <header class="bg-white dark:bg-gray-800 shadow">
      <div
        class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
        <NuxtLink
          to="/products/add"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
          + Add Product
        </NuxtLink>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Search and Filters -->
      <ProductFilters
        v-model:search="search"
        v-model:category="selectedCategory"
        v-model:lowStock="lowStockOnly" />

      <!-- Products Table -->
      <ProductsTable
        :products="paginatedProducts"
        @edit="openEditModal"
        @stock="openQuickStockModal"
        @view="viewProduct" />

      <!-- Pagination -->
      <ProductPagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :start-index="startIndex"
        :end-index="endIndex"
        :total-items="filteredProducts.length"
        @update:page="currentPage = $event" />
    </main>

    <!-- Edit Product Modal -->
    <EditProductModal
      :is-open="showEditModal"
      :product="editingProduct"
      :is-loading="editLoading"
      :error="editError"
      @close="closeEditModal"
      @submit="saveProductChanges" />

    <!-- Stock Update Modal -->
    <StockUpdateModal
      :is-open="showQuickStockModal"
      :product="quickStockProduct"
      :is-loading="quickStockLoading"
      :error="quickStockError"
      @close="closeQuickStockModal"
      @submit="updateStockQuick" />
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

// Edit Modal State
const showEditModal = ref(false);
const editingProduct = ref(null);
const editLoading = ref(false);
const editError = ref('');

// Quick Stock Modal State
const showQuickStockModal = ref(false);
const quickStockProduct = ref(null);
const quickStockLoading = ref(false);
const quickStockError = ref('');

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

const fetchProducts = async () => {
  try {
    const { $api } = useNuxtApp();
    const data = await $api.get('/products');
    products.value = data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const openEditModal = product => {
  editingProduct.value = product;
  editError.value = '';
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editingProduct.value = null;
  editError.value = '';
};

const saveProductChanges = async formData => {
  try {
    editError.value = '';
    editLoading.value = true;
    const { $api } = useNuxtApp();

    await $api.put(`/products/${editingProduct.value.id}`, formData);
    await fetchProducts();
    closeEditModal();
  } catch (error) {
    editError.value = error.message || 'Error updating product';
  } finally {
    editLoading.value = false;
  }
};

const openQuickStockModal = product => {
  quickStockProduct.value = product;
  quickStockError.value = '';
  showQuickStockModal.value = true;
};

const closeQuickStockModal = () => {
  showQuickStockModal.value = false;
  quickStockProduct.value = null;
  quickStockError.value = '';
};

const updateStockQuick = async formData => {
  try {
    quickStockError.value = '';
    quickStockLoading.value = true;

    const stockChange =
      formData.action === 'add' ? formData.quantity : -formData.quantity;
    const { $api } = useNuxtApp();

    await $api.patch(`/products/${quickStockProduct.value.id}/update-stock`, {
      stockChange,
      reason: formData.reason || 'ADJUSTMENT',
      notes: formData.notes,
      quantityBefore: quickStockProduct.value.currentStock,
      quantityAfter:
        formData.action === 'add'
          ? quickStockProduct.value.currentStock + formData.quantity
          : Math.max(0, quickStockProduct.value.currentStock - formData.quantity),
    });

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
