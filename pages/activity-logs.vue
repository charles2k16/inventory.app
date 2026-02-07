<template>
  <main class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white">Activity Monitor</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Track all system changes and user activities
        </p>
      </div>

      <!-- Summary Stats -->
      <div v-if="summary" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Activities" :value="summary.totalActivities" icon="📊" />
        <StatCard
          title="Top User Activity"
          :value="summary.topUsers[0]?.count || 0"
          :subtitle="
            summary.topUsers[0]?.user?.firstName +
            ' ' +
            summary.topUsers[0]?.user?.lastName
          "
          icon="👤" />
        <StatCard
          title="Resource Types"
          :value="summary.byResourceType.length"
          icon="📦" />
      </div>

      <!-- Filters Section -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- Search -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Description
            </label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              @keyup.enter="fetchActivities" />
          </div>

          <!-- Action Filter -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Action
            </label>
            <select
              v-model="filters.action"
              class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              @change="fetchActivities">
              <option value="">All Actions</option>
              <option v-for="action in availableActions" :key="action" :value="action">
                {{ action }}
              </option>
            </select>
          </div>

          <!-- Resource Type Filter -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Resource Type
            </label>
            <select
              v-model="filters.resourceType"
              class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              @change="fetchActivities">
              <option value="">All Types</option>
              <option v-for="type in availableResourceTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>

          <!-- Date Range -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From Date
            </label>
            <input
              v-model="filters.startDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              @change="fetchActivities" />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To Date
            </label>
            <input
              v-model="filters.endDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              @change="fetchActivities" />
          </div>
        </div>

        <!-- Filter Buttons -->
        <div class="mt-4 flex gap-2">
          <button
            @click="fetchActivities"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Apply Filters
          </button>
          <button
            @click="clearFilters"
            class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-md hover:bg-gray-400 transition">
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Activity Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div v-if="loading" class="p-8 text-center">
          <LoadingSpinner />
        </div>

        <div v-else-if="activities.length === 0" class="p-8 text-center">
          <EmptyState
            title="No activities found"
            message="Try adjusting your filters or check back later" />
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead
              class="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Resource
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  IP Address
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date/Time
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="activity in activities"
                :key="activity.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ activity.user.firstName }} {{ activity.user.lastName }}
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    @{{ activity.user.username }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    :class="getActionBadgeClass(activity.action)"
                    class="px-3 py-1 rounded-full text-xs font-medium">
                    {{ activity.action }}
                  </span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {{ activity.resourceType }}
                </td>
                <td
                  class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                  {{ activity.description }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {{ activity.ipAddress || '-' }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate(activity.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="pagination && pagination.pages > 1"
          class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to
            {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of
            {{ pagination.total }} activities
          </div>
          <div class="flex gap-2">
            <button
              v-if="pagination.page > 1"
              @click="changePage(pagination.page - 1)"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
              Previous
            </button>
            <span class="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
              Page {{ pagination.page }} of {{ pagination.pages }}
            </span>
            <button
              v-if="pagination.page < pagination.pages"
              @click="changePage(pagination.page + 1)"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useNuxtApp } from '#app';
import StatCard from '~/components/StatCard.vue';
import EmptyState from '~/components/EmptyState.vue';
import LoadingSpinner from '~/components/LoadingSpinner.vue';

const { $api } = useNuxtApp();

const loading = ref(false);
const activities = ref([]);
const summary = ref(null);
const pagination = ref(null);
const availableActions = ref([]);
const availableResourceTypes = ref([]);

const filters = ref({
  search: '',
  action: '',
  resourceType: '',
  startDate: '',
  endDate: '',
  page: 1,
  limit: 50,
});

const getActionBadgeClass = action => {
  const classes = {
    CREATE: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
    UPDATE: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100',
    DELETE: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100',
    LOGIN: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100',
    LOGIN_FAILED: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100',
    BULK_CREATE: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100',
  };
  return (
    classes[action] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
  );
};

const formatDate = date => {
  return new Date(date).toLocaleString();
};

const fetchActivities = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      page: filters.value.page,
      limit: filters.value.limit,
      ...(filters.value.search && { search: filters.value.search }),
      ...(filters.value.action && { action: filters.value.action }),
      ...(filters.value.resourceType && { resourceType: filters.value.resourceType }),
      ...(filters.value.startDate && { startDate: filters.value.startDate }),
      ...(filters.value.endDate && { endDate: filters.value.endDate }),
    });

    const url = `/activity/log?${params}`;

    const response = await $api.get(url);

    activities.value = response.activities || [];
    pagination.value = response.pagination;
  } catch (error) {
    console.error('Error details:', error.message, error.response?.data);
  } finally {
    loading.value = false;
  }
};

const fetchSummary = async () => {
  try {
    const params = new URLSearchParams({
      ...(filters.value.startDate && { startDate: filters.value.startDate }),
      ...(filters.value.endDate && { endDate: filters.value.endDate }),
    });

    const url = `/activity/summary?${params}`;

    const response = await $api.get(url);

    // The API returns { summary: {...}, byAction: [...], byResourceType: [...], topUsers: [...] }
    // We need to merge it so summary contains all the data
    summary.value = {
      totalActivities: response.summary.totalActivities,
      byAction: response.byAction,
      byResourceType: response.byResourceType,
      topUsers: response.topUsers,
    };
  } catch (error) {
    console.error('❌ Failed to fetch summary:', error);
  }
};

const fetchActivityTypes = async () => {
  try {
    const response = await $api.get('/activity/types');

    availableActions.value = response.actions || [];
    availableResourceTypes.value = response.resourceTypes || [];
  } catch (error) {
    console.error('❌ Failed to fetch activity types:', error);
  }
};

const clearFilters = () => {
  filters.value = {
    search: '',
    action: '',
    resourceType: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 50,
  };
  fetchActivities();
  fetchSummary();
};

const changePage = newPage => {
  filters.value.page = newPage;
  fetchActivities();
};

onMounted(() => {
  fetchActivities();
  fetchSummary();
  fetchActivityTypes();
});
</script>
