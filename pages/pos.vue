<template>
  <div class="pos-container max-w-6xl mx-auto">
    <!-- Auth redirect -->
    <div v-if="!isAuthenticated" class="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
      <p class="mb-4">You need to sign in to use the POS.</p>
      <NuxtLink
        to="/login"
        class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500">
        Go to Login
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Products Panel -->
      <div class="lg:col-span-2 h-[calc(100vh-11rem)] min-h-0 flex flex-col">
        <div class="bg-slate-800 rounded-xl border border-slate-700 p-4 h-full overflow-y-auto flex flex-col">
          <div class="relative mb-4 flex-shrink-0">
            <input
              v-model="productSearch"
              type="text"
              placeholder="Search by product name or barcode..."
              class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              @keydown.enter.prevent="addFirstMatch" />
            <div
              v-if="productSearch && filteredProducts.length > 0"
              class="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-xl max-h-64 overflow-y-auto">
              <button
                v-for="p in filteredProducts.slice(0, 8)"
                :key="p.id"
                type="button"
                class="w-full text-left px-4 py-3 hover:bg-slate-600 flex justify-between items-center"
                @click="addProduct(p)">
                <span>{{ p.itemName }}</span>
                <span class="text-emerald-400 text-sm">{{ formatPrice(p.sellingPrice) }} · Stock: {{ p.currentStock }}</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 flex-1 min-h-0 overflow-y-auto">
            <button
              v-for="p in productsWithStock"
              :key="p.id"
              type="button"
              class="bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg p-3 text-left transition-colors"
              @click="addProduct(p)">
              <p class="font-medium text-white truncate">{{ p.itemName }}</p>
              <p class="text-emerald-400 text-sm mt-1">{{ formatPrice(p.sellingPrice) }}</p>
              <p class="text-slate-500 text-xs mt-0.5">Stock: {{ p.currentStock }}</p>
            </button>
          </div>
        </div>
      </div>

      <!-- Cart & Checkout Panel -->
      <div class="h-[calc(100vh-11rem)] min-h-0 flex flex-col">
        <div class="bg-slate-800 rounded-xl border border-slate-700 p-4 h-full overflow-y-auto flex flex-col">
          <h2 class="text-lg font-semibold text-white mb-4">Cart</h2>

          <div v-if="cart.length === 0" class="text-slate-500 py-8 text-center text-sm">
            No items. Search or tap a product to add.
          </div>

          <div v-else class="space-y-2 flex-1 min-h-0 overflow-y-auto mb-4">
            <div
              v-for="(item, idx) in cart"
              :key="idx"
              class="flex items-center justify-between bg-slate-700 rounded-lg px-3 py-2">
              <div class="min-w-0 flex-1">
                <p class="text-white truncate text-sm">{{ item.product.itemName }}</p>
                <p class="text-slate-400 text-xs">{{ formatPrice(item.unitPrice) }} × {{ item.quantity }}</p>
              </div>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="w-7 h-7 rounded bg-slate-600 hover:bg-slate-500 text-white text-sm font-bold"
                  @click="decrementQty(idx)">
                  −
                </button>
                <span class="text-white w-6 text-center text-sm">{{ item.quantity }}</span>
                <button
                  type="button"
                  class="w-7 h-7 rounded bg-slate-600 hover:bg-slate-500 text-white text-sm font-bold disabled:opacity-50"
                  :disabled="item.quantity >= item.product.currentStock"
                  @click="incrementQty(idx)">
                  +
                </button>
                <button
                  type="button"
                  class="text-red-400 hover:text-red-300 text-sm ml-1"
                  @click="removeFromCart(idx)">
                  ✕
                </button>
              </div>
            </div>
          </div>

          <div class="border-t border-slate-600 pt-4 flex-shrink-0">
            <div class="flex justify-between text-slate-400 text-sm mb-2">
              <span>Total</span>
              <span class="text-xl font-bold text-emerald-400">{{ formatPrice(cartTotal) }}</span>
            </div>

            <div class="mb-4">
              <label class="block text-slate-400 text-xs mb-1">Customer / Lender (optional)</label>
              <select
                v-model="selectedLenderId"
                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">Walk-in customer</option>
                <option v-for="l in lenders" :key="l.id" :value="l.id">
                  {{ l.name }}
                </option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-slate-400 text-xs mb-1">Payment Status</label>
              <select
                v-model="paymentStatus"
                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="PAID">Paid</option>
                <option value="UNPAID">Unpaid</option>
              </select>
              <p v-if="paymentStatus === 'UNPAID'" class="text-amber-400 text-xs mt-1">
                Unpaid sales require a lender. Select a customer above.
              </p>
            </div>

            <div class="mb-4">
              <label class="block text-slate-400 text-xs mb-1">Payment Method</label>
              <select
                v-model="paymentMethod"
                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="CASH">Cash</option>
                <option value="MOBILE_MONEY">Mobile Money</option>
                <option value="CREDIT">Credit</option>
              </select>
            </div>

            <div v-if="saleError" class="mb-4 text-amber-400 text-sm">
              {{ saleError }}
            </div>

            <button
              :disabled="!canCompleteSale || completing"
              class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              @click="completeSale">
              {{ completing ? 'Processing...' : 'Complete Sale' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sale Complete Modal -->
    <Teleport to="body">
      <div
        v-if="showCompleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        @click.self="closeCompleteModal">
        <div class="bg-slate-800 rounded-xl border border-slate-600 p-6 max-w-sm w-full shadow-xl">
          <div class="text-center mb-6">
            <div class="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
              <span class="text-2xl text-emerald-400">✓</span>
            </div>
            <h3 class="text-lg font-semibold text-white">Sale Completed</h3>
            <p class="text-slate-400 text-sm mt-1">Order {{ completedSale?.orderNumber }}</p>
          </div>

          <ReceiptPrint
            ref="receiptRef"
            :sale="completedSale"
            :items="completedSaleItems"
            :total="completedTotal"
            :payment-method="paymentMethod"
            :cashier-name="cashierName"
            :show="true"
            class="sr-only" />

          <div class="flex gap-3 mt-4">
            <button
              class="flex-1 py-3 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-lg"
              @click="printReceipt">
              Print Receipt
            </button>
            <button
              class="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg"
              @click="closeCompleteModal">
              New Sale
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'pos',
});

const { $api } = useNuxtApp();
const products = ref([]);
const lenders = ref([]);
const productSearch = ref('');
const cart = ref([]);
const selectedLenderId = ref('');
const paymentStatus = ref('PAID');
const paymentMethod = ref('CASH');
const completing = ref(false);
const saleError = ref('');
const isAuthenticated = ref(false);
const showCompleteModal = ref(false);
const completedSale = ref(null);
const completedSaleItems = ref([]);
const completedTotal = ref(0);
const receiptRef = ref(null);

const cashierName = computed(() => {
  try {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    return u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.username || 'Cashier';
  } catch {
    return 'Cashier';
  }
});

const productsWithStock = computed(() => {
  return products.value.filter((p) => p.currentStock > 0);
});

const filteredProducts = computed(() => {
  const q = productSearch.value.toLowerCase().trim();
  if (!q) return [];
  return productsWithStock.value.filter(
    (p) =>
      p.itemName.toLowerCase().includes(q) ||
      (p.barcodeNumber && p.barcodeNumber.toLowerCase().includes(q))
  );
});

const cartTotal = computed(() => {
  return cart.value.reduce((s, i) => s + i.quantity * Number(i.unitPrice), 0);
});

const customerName = computed(() => {
  if (selectedLenderId.value) {
    const l = lenders.value.find((x) => x.id === selectedLenderId.value);
    return l?.name || 'Customer';
  }
  return 'Walk-in Customer';
});

const amountPaid = computed(() =>
  paymentStatus.value === 'PAID' ? cartTotal.value : 0
);

const canCompleteSale = computed(() => {
  if (cart.value.length === 0) return false;
  if (paymentStatus.value === 'UNPAID' && !selectedLenderId.value) return false;
  return true;
});

const formatPrice = (n) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(n) || 0);
};

const addProduct = (product) => {
  const existing = cart.value.find((c) => c.productId === product.id);
  if (existing) {
    if (existing.quantity < product.currentStock) existing.quantity++;
  } else {
    cart.value.push({
      productId: product.id,
      product,
      quantity: 1,
      unitPrice: product.sellingPrice,
    });
  }
  productSearch.value = '';
};

const addFirstMatch = () => {
  if (filteredProducts.value.length > 0) {
    addProduct(filteredProducts.value[0]);
  }
};

const incrementQty = (idx) => {
  const item = cart.value[idx];
  if (item.quantity < item.product.currentStock) item.quantity++;
};

const decrementQty = (idx) => {
  const item = cart.value[idx];
  if (item.quantity > 1) item.quantity--;
  else cart.value.splice(idx, 1);
};

const removeFromCart = (idx) => {
  cart.value.splice(idx, 1);
};

const completeSale = async () => {
  if (!canCompleteSale.value) {
    saleError.value =
      paymentStatus.value === 'UNPAID' && !selectedLenderId.value
        ? 'Select a lender for unpaid sales'
        : 'Add items to cart';
    return;
  }
  saleError.value = '';
  completing.value = true;
  try {
    const total = cartTotal.value;
    const paid = amountPaid.value;
    const saleData = cart.value.map((i) => {
      const itemTotal = i.quantity * Number(i.unitPrice);
      const itemAmountPaid =
        total > 0 ? (itemTotal / total) * paid : 0;
      return {
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        customerId: selectedLenderId.value || null,
        customerName: customerName.value,
        paymentMethod: paymentMethod.value,
        paymentStatus: paymentStatus.value,
        amountPaid: Math.round(itemAmountPaid * 100) / 100,
        notes: 'POS Sale',
      };
    });

    const res = await $api.post('/sales/bulk', {
      sales: saleData,
      totalAmount: cartTotal.value,
    });

    completedSale.value = { orderNumber: res.orderNumber };
    completedSaleItems.value = [...cart.value];
    completedTotal.value = cartTotal.value;

    cart.value = [];
    showCompleteModal.value = true;
  } catch (err) {
    alert(err.message || 'Failed to complete sale');
  } finally {
    completing.value = false;
  }
};

const printReceipt = () => {
  receiptRef.value?.print();
};

const closeCompleteModal = () => {
  showCompleteModal.value = false;
  completedSale.value = null;
  completedSaleItems.value = [];
  completedTotal.value = 0;
  saleError.value = '';
};

const fetchProducts = async () => {
  try {
    const data = await $api.get('/products', { limit: 500 });
    products.value = data.products || [];
  } catch (err) {
    console.error('Failed to load products:', err);
  }
};

const fetchLenders = async () => {
  try {
    const data = await $api.get('/lenders', { limit: 200 });
    lenders.value = data.lenders || [];
  } catch (err) {
    console.error('Failed to load lenders:', err);
  }
};

onMounted(() => {
  const token = localStorage.getItem('token');
  isAuthenticated.value = !!token;
  if (token) {
    fetchProducts();
    fetchLenders();
  }
});
</script>
