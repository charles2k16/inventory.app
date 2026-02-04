<template>
  <div>
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Credit Customers (Lenders)</h1>
        <button
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          + Add Customer
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Total Debt Card -->
      <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div class="flex">
          <div class="flex-1">
            <p class="text-sm font-medium text-red-800">Total Outstanding Debt</p>
            <p class="text-2xl font-bold text-red-900 mt-1">GHS 0.00</p>
          </div>
        </div>
      </div>

      <!-- Lenders List -->
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Customers
          </h3>
          <p class="text-gray-500 text-center py-12">
            No credit customers yet.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
