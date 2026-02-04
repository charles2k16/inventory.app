<template>
  <div>
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">Weekly Stock Reports</h1>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Current Week Card -->
      <div class="bg-primary-50 border-l-4 border-primary-400 p-4 mb-6">
        <div class="flex">
          <div class="flex-1">
            <p class="text-sm font-medium text-primary-800">Current Week</p>
            <p class="text-lg font-semibold text-primary-900 mt-1">
              Week {{ getCurrentWeek() }} - {{ new Date().getFullYear() }}
            </p>
          </div>
        </div>
      </div>

      <!-- Reports List -->
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Weekly Reports
          </h3>
          <p class="text-gray-500 text-center py-12">
            Stock reports will appear here.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const getCurrentWeek = () => {
  const now = new Date();
  return Math.ceil(now.getDate() / 7);
};
</script>
