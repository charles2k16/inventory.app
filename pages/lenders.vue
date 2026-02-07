<template>
  <div>
    <header class="bg-white dark:bg-gray-800 shadow">
      <div
        class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Credit Customers (Lenders)
        </h1>
        <button
          @click="openCreateModal"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
          + Add Customer
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Total Debt Card -->
      <div
        class="bg-red-50 dark:bg-red-900 border-l-4 border-red-400 dark:border-red-600 p-4 mb-6">
        <div class="flex">
          <div class="flex-1">
            <p class="text-sm font-medium text-red-800 dark:text-red-200">
              Total Outstanding Debt
            </p>
            <p class="text-2xl font-bold text-red-900 dark:text-red-100 mt-1">
              {{ formatNumber(totalDebt) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Lenders List -->
      <div class="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Customers
          </h3>
          <div v-if="lenders.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Code
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Phone
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Current Debt
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Purchased
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="lender in lenders"
                  :key="lender.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ lender.name }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {{ lender.customerCode }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {{ lender.phone || '-' }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-semibold"
                    :class="
                      lender.currentDebt > 0
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-green-600 dark:text-green-400'
                    ">
                    {{ formatNumber(lender.currentDebt) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ formatNumber(lender.totalPurchased) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                        lender.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                      ]">
                      {{ lender.status }}
                    </span>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      @click="openEditModal(lender)"
                      class="text-primary-600 hover:text-primary-900">
                      Edit
                    </button>
                    <button
                      @click="openTransactionsModal(lender)"
                      class="text-blue-600 hover:text-blue-900">
                      Transactions
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="text-gray-500 dark:text-gray-400 text-center py-12">
            No credit customers yet.
          </p>
        </div>
      </div>
    </main>

    <!-- Create/Edit Customer Modal -->
    <div
      v-if="showCustomerModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full max-h-screen flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editingCustomer ? 'Edit Customer' : 'Create New Customer' }}
          </h3>
        </div>

        <div class="px-6 py-4 overflow-y-auto flex-1">
          <div
            v-if="customerError"
            class="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded">
            {{ customerError }}
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Name</label
              >
              <input
                v-model="customerForm.name"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border"
                required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Phone</label
              >
              <input
                v-model="customerForm.phone"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input
                v-model="customerForm.email"
                type="email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Address</label>
              <input
                v-model="customerForm.address"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Credit Limit</label>
              <input
                v-model.number="customerForm.creditLimit"
                type="number"
                step="0.01"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                v-model="customerForm.notes"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border"
                rows="3"></textarea>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
          <button
            @click="closeCustomerModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Cancel
          </button>
          <button
            @click="saveCustomer"
            :disabled="customerLoading"
            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <span v-if="customerLoading" class="animate-spin">
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
            {{ customerLoading ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Transactions Modal -->
    <div
      v-if="showTransactionsModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            {{ selectedCustomer?.name }} - Transactions
          </h3>
        </div>

        <div class="px-6 py-4 overflow-y-auto flex-1">
          <div
            v-if="selectedCustomer?.sales && selectedCustomer.sales.length > 0"
            class="mb-6">
            <h4 class="font-semibold text-gray-900 mb-3">Sales</h4>
            <div class="space-y-2">
              <div
                v-for="sale in selectedCustomer.sales"
                :key="sale.id"
                class="p-3 bg-gray-50 rounded border border-gray-200">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium text-gray-900">{{ sale.product.itemName }}</p>
                    <p class="text-sm text-gray-600">{{ sale.saleNumber }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-gray-900">
                      {{ formatNumber(sale.totalAmount) }}
                    </p>
                    <p
                      class="text-sm"
                      :class="
                        sale.paymentStatus === 'PAID' ? 'text-green-600' : 'text-red-600'
                      ">
                      {{ sale.paymentStatus }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedCustomer?.payments && selectedCustomer.payments.length > 0">
            <h4 class="font-semibold text-gray-900 mb-3">Payments</h4>
            <div class="space-y-2">
              <div
                v-for="payment in selectedCustomer.payments"
                :key="payment.id"
                class="p-3 bg-gray-50 rounded border border-gray-200">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium text-gray-900">{{ payment.paymentNumber }}</p>
                    <p class="text-sm text-gray-600">{{ payment.paymentMethod }}</p>
                  </div>
                  <p class="font-semibold text-green-600">
                    {{ formatNumber(payment.amount) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="
              (!selectedCustomer?.sales || selectedCustomer.sales.length === 0) &&
              (!selectedCustomer?.payments || selectedCustomer.payments.length === 0)
            "
            class="text-center text-gray-500 py-8">
            No transactions found
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-200">
          <button
            @click="closeTransactionsModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();

const lenders = ref([]);
const totalDebt = ref(0);
const showCustomerModal = ref(false);
const showTransactionsModal = ref(false);
const editingCustomer = ref(null);
const selectedCustomer = ref(null);
const customerLoading = ref(false);
const customerError = ref('');

const customerForm = ref({
  name: '',
  phone: '',
  email: '',
  address: '',
  creditLimit: 0,
  notes: '',
});

const formatNumber = num => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num || 0);
};

const resetForm = () => {
  customerForm.value = {
    name: '',
    phone: '',
    email: '',
    address: '',
    creditLimit: 0,
    notes: '',
  };
  editingCustomer.value = null;
};

const openCreateModal = () => {
  resetForm();
  customerError.value = '';
  showCustomerModal.value = true;
};

const openEditModal = customer => {
  editingCustomer.value = customer;
  customerForm.value = {
    name: customer.name,
    phone: customer.phone || '',
    email: customer.email || '',
    address: customer.address || '',
    creditLimit: customer.creditLimit || 0,
    notes: customer.notes || '',
  };
  customerError.value = '';
  showCustomerModal.value = true;
};

const closeCustomerModal = () => {
  showCustomerModal.value = false;
  resetForm();
};

const openTransactionsModal = async customer => {
  try {
    const { $api } = useNuxtApp();
    const data = await $api.get(`/lenders/${customer.id}`);
    selectedCustomer.value = data;
    showTransactionsModal.value = true;
  } catch (error) {
    console.error('Error fetching transactions:', error);
  }
};

const closeTransactionsModal = () => {
  showTransactionsModal.value = false;
  selectedCustomer.value = null;
};

const saveCustomer = async () => {
  try {
    customerError.value = '';
    const { $api } = useNuxtApp();

    if (!customerForm.value.name.trim()) {
      customerError.value = 'Customer name is required';
      return;
    }

    customerLoading.value = true;

    if (editingCustomer.value) {
      await $api.put(`/lenders/${editingCustomer.value.id}`, customerForm.value);
    } else {
      await $api.post('/lenders', customerForm.value);
    }

    await fetchLenders();
    closeCustomerModal();
  } catch (error) {
    customerError.value = error.message || 'Error saving customer';
  } finally {
    customerLoading.value = false;
  }
};

const fetchLenders = async () => {
  try {
    const { $api } = useNuxtApp();
    const data = await $api.get('/lenders', { limit: 1000 });
    lenders.value = data.lenders || [];

    // Calculate total debt
    totalDebt.value = lenders.value.reduce(
      (sum, lender) => sum + parseFloat(lender.currentDebt || 0),
      0,
    );
  } catch (error) {
    console.error('Error fetching lenders:', error);
  }
};

onMounted(() => {
  fetchLenders();
});
</script>
