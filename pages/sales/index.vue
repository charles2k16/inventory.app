<template>
  <div>
    <header class="bg-white shadow">
      <div
        class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Sales</h1>
        <div class="flex gap-3">
          <NuxtLink
            to="/sales/bulk-create"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            + Bulk Sale
          </NuxtLink>
          <button
            @click="showNewSaleModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
            + New Sale
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Today's Sales</h3>
          <p class="text-2xl font-bold text-gray-900 mt-2">GHS 0.00</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">This Week</h3>
          <p class="text-2xl font-bold text-gray-900 mt-2">GHS 0.00</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Pending Payments</h3>
          <p class="text-2xl font-bold text-red-600 mt-2">GHS 0.00</p>
        </div>
      </div>

      <!-- Sales List -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Recent Sales</h3>
        </div>
        <div class="border-t border-gray-200">
          <ul class="divide-y divide-gray-200">
            <li class="px-4 py-4 sm:px-6">
              <p class="text-center text-gray-500 py-8">
                No sales yet. Create your first sale!
              </p>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const showNewSaleModal = ref(false);
</script>
