<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-primary-600 dark:text-primary-400">
                📦 Diaso Inventory
              </h1>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NuxtLink
                to="/"
                class="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900 dark:text-white">
                Dashboard
              </NuxtLink>
              <NuxtLink
                to="/products"
                class="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900 dark:text-white">
                Products
              </NuxtLink>
              <NuxtLink
                to="/sales"
                class="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900 dark:text-white">
                Sales
              </NuxtLink>
              <NuxtLink
                v-if="canManageReturns"
                to="/returns"
                class="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900 dark:text-white">
                Returns
              </NuxtLink>
              <NuxtLink
                to="/lenders"
                class="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900 dark:text-white">
                Lenders
              </NuxtLink>
              <NuxtLink
                v-if="canManageReports"
                to="/stock-reports"
                class="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900 dark:text-white">
                Reports
              </NuxtLink>
              <NuxtLink
                v-if="canViewActivity"
                to="/users"
                class="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900 dark:text-white">
                Users
              </NuxtLink>
              <NuxtLink
                v-if="canViewActivity"
                to="/activity-logs"
                class="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-primary-500 text-gray-900 dark:text-white">
                Activity
              </NuxtLink>
              <a
                href="/pos"
                target="_blank"
                rel="noopener"
                class="border-transparent text-emerald-600 dark:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                POS
              </a>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ roleLabel }}</span>
            <ThemeToggle />
            <button
              @click="logout"
              class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page Content -->
    <slot />
  </div>
</template>

<script setup>
const { user, canManageReturns, canManageReports, canViewActivity } = useAuth();

const roleLabel = computed(() => {
  const r = user.value?.role;
  if (!r) return '';
  return r === 'ADMIN' ? 'Admin' : r === 'MANAGER' ? 'Manager' : 'Sales';
});

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  navigateTo('/login');
};
</script>
