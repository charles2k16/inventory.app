<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="bg-white shadow mb-8 -mx-4 px-4">
        <div class="max-w-6xl mx-auto py-6 px-0">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Create Bulk Sale</h1>
              <p class="text-gray-600 mt-2">
                Select multiple products and create a sale order
              </p>
            </div>
            <NuxtLink
              to="/sales"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              ← Back to Sales
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Product Selection -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Select Products</h2>

            <!-- Available Products -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Search & Select Product</label
              >
              <div class="flex gap-2 mb-2">
                <input
                  v-model="productSearch"
                  type="text"
                  placeholder="Search products..."
                  class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border" />
                <button
                  @click="
                    selectedProductId = '';
                    productSearch = '';
                  "
                  v-if="productSearch"
                  class="px-3 py-2 text-gray-600 hover:text-gray-900 font-medium">
                  ✕
                </button>
                <button
                  @click="addProductToSale"
                  :disabled="!selectedProductId || addingProduct"
                  class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium whitespace-nowrap">
                  {{ addingProduct ? 'Adding...' : 'Add' }}
                </button>
              </div>
              <select
                v-if="filteredProducts.length > 0"
                v-model="selectedProductId"
                size="5"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border">
                <option value="">Choose a product...</option>
                <option
                  v-for="product in filteredProducts"
                  :key="product.id"
                  :value="product.id">
                  {{ product.itemName }} (Stock: {{ product.currentStock }})
                </option>
              </select>
              <div
                v-else-if="productSearch"
                class="mt-2 p-3 text-sm text-gray-600 bg-gray-50 rounded-md border border-gray-300">
                No products found matching "{{ productSearch }}"
              </div>
              <div
                v-else
                class="mt-2 p-3 text-sm text-gray-500 bg-gray-50 rounded-md border border-dashed border-gray-300">
                Type to search for products
              </div>
            </div>

            <!-- Selected Products -->
            <div v-if="saleItems.length > 0" class="space-y-4">
              <h3 class="text-md font-semibold text-gray-900">Products in Sale</h3>
              <div
                class="max-h-96 overflow-y-auto space-y-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div
                  v-for="(item, index) in saleItems"
                  :key="index"
                  class="border border-gray-200 rounded-lg p-4 bg-white">
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <p class="font-semibold text-gray-900">
                        {{ item.product.itemName }}
                      </p>
                      <p class="text-sm text-gray-600">
                        Available stock: {{ item.product.currentStock }}
                      </p>
                    </div>
                    <button
                      @click="removeSaleItem(index)"
                      class="text-red-600 hover:text-red-900 text-sm font-medium">
                      Remove
                    </button>
                  </div>

                  <div class="grid grid-cols-3 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700"
                        >Quantity</label
                      >
                      <input
                        v-model.number="item.quantity"
                        type="number"
                        min="1"
                        :max="item.product.currentStock"
                        @change="calculateTotals"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700"
                        >Unit Price</label
                      >
                      <div
                        class="mt-1 px-3 py-2 bg-gray-50 rounded-md border border-gray-300 text-gray-900 font-semibold">
                        {{ formatNumber(item.unitPrice) }}
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Total</label>
                      <div
                        class="mt-1 px-3 py-2 bg-gray-50 rounded-md border border-gray-300 text-gray-900 font-semibold">
                        {{ formatNumber(item.quantity * item.unitPrice) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else
              class="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p class="text-gray-600">
                No products selected yet. Add products to create a sale.
              </p>
            </div>
          </div>
        </div>

        <!-- Sale Summary & Customer Details -->
        <div>
          <!-- Sale Summary -->
          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Sale Summary</h2>

            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-gray-700">
                <span>Products Count:</span>
                <span class="font-semibold">{{ saleItems.length }}</span>
              </div>
              <div class="flex justify-between text-gray-700">
                <span>Total Quantity:</span>
                <span class="font-semibold">{{ totalQuantity }}</span>
              </div>
              <div
                class="border-t border-gray-200 pt-3 flex justify-between text-gray-900 font-bold text-lg">
                <span>Total Amount:</span>
                <span class="text-primary-600">{{ formatNumber(totalAmount) }}</span>
              </div>
            </div>

            <hr class="my-6" />

            <!-- Customer Details -->
            <div class="space-y-4">
              <h3 class="font-semibold text-gray-900">Customer Details</h3>

              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Customer Name</label
                >
                <input
                  v-model="formData.customerName"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border"
                  placeholder="Enter customer name"
                  required />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Payment Method</label
                >
                <select
                  v-model="formData.paymentMethod"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border">
                  <option value="CASH">Cash</option>
                  <option value="CREDIT">Credit</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="TRANSFER">Transfer</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Payment Status</label
                >
                <select
                  v-model="formData.paymentStatus"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border">
                  <option value="PAID">Paid</option>
                  <option value="PARTIAL">Partial</option>
                  <option value="UNPAID">Unpaid</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Amount Paid</label>
                <input
                  v-model.number="formData.amountPaid"
                  type="number"
                  step="0.01"
                  min="0"
                  :max="totalAmount"
                  @change="updatePaymentStatus"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border" />
              </div>

              <div class="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p class="text-sm text-gray-600">
                  Amount Due:
                  <span class="font-semibold text-gray-900">{{
                    formatNumber(totalAmount - formData.amountPaid)
                  }}</span>
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  v-model="formData.notes"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border"
                  rows="3"
                  placeholder="Additional notes..."></textarea>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            @click="createBulkSale"
            :disabled="!canSubmit || loading"
            class="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2">
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
            {{ loading ? 'Creating Sale...' : 'Create Bulk Sale' }}
          </button>

          <!-- Error Message -->
          <div
            v-if="error"
            class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const router = useRouter();

const products = ref([]);
const saleItems = ref([]);
const selectedProductId = ref('');
const productSearch = ref('');
const addingProduct = ref(false);
const loading = ref(false);
const error = ref('');

const formData = ref({
  customerName: '',
  paymentMethod: 'CASH',
  paymentStatus: 'PAID',
  amountPaid: 0,
  notes: '',
});

const formatNumber = num => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num || 0);
};

const availableProducts = computed(() => {
  return products.value.filter(
    p => p.currentStock > 0 && !saleItems.value.some(item => item.productId === p.id),
  );
});

const filteredProducts = computed(() => {
  const search = productSearch.value.toLowerCase();
  return availableProducts.value.filter(
    p =>
      p.itemName.toLowerCase().includes(search) ||
      (p.barcodeNumber && p.barcodeNumber.toLowerCase().includes(search)),
  );
});

const totalQuantity = computed(() => {
  return saleItems.value.reduce((sum, item) => sum + (item.quantity || 0), 0);
});

const totalAmount = computed(() => {
  return saleItems.value.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0,
  );
});

const canSubmit = computed(() => {
  return (
    saleItems.value.length > 0 &&
    formData.value.customerName.trim() !== '' &&
    totalAmount.value > 0
  );
});

const fetchProducts = async () => {
  try {
    const response = await fetch(`${config.public.apiBase}/products?limit=1000`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    products.value = data.products || [];
  } catch (err) {
    error.value = 'Failed to load products';
    console.error(err);
  }
};

const addProductToSale = async () => {
  try {
    addingProduct.value = true;
    const product = products.value.find(p => p.id === selectedProductId.value);

    if (!product) {
      error.value = 'Product not found';
      return;
    }

    saleItems.value.push({
      productId: product.id,
      product,
      quantity: 1,
      unitPrice: product.sellingPrice,
    });

    selectedProductId.value = '';
    error.value = '';
  } finally {
    addingProduct.value = false;
  }
};

const removeSaleItem = index => {
  saleItems.value.splice(index, 1);
};

const calculateTotals = () => {
  // Computed properties handle recalculation
};

const updatePaymentStatus = () => {
  const amountDue = totalAmount.value - formData.value.amountPaid;
  if (amountDue <= 0) {
    formData.value.paymentStatus = 'PAID';
  } else if (formData.value.amountPaid > 0) {
    formData.value.paymentStatus = 'PARTIAL';
  } else {
    formData.value.paymentStatus = 'UNPAID';
  }
};

const createBulkSale = async () => {
  try {
    error.value = '';
    loading.value = true;

    if (!canSubmit.value) {
      error.value = 'Please fill in all required fields';
      return;
    }

    const saleData = saleItems.value.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      customerId: null,
      customerName: formData.value.customerName,
      paymentMethod: formData.value.paymentMethod,
      paymentStatus: formData.value.paymentStatus,
      amountPaid: formData.value.amountPaid,
      notes: formData.value.notes,
    }));

    const response = await fetch(`${config.public.apiBase}/sales/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        sales: saleData,
        totalAmount: totalAmount.value,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      error.value = data.message || 'Failed to create bulk sale';
      return;
    }

    // Redirect to sales page
    navigateTo('/sales');
  } catch (err) {
    error.value = err.message || 'Error creating bulk sale';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProducts();
});
</script>
