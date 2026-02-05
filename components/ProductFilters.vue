<template>
  <div class="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        :value="search"
        @input="$emit('update:search', $event.target.value)"
        type="text"
        placeholder="Search products..."
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-primary-500 focus:border-primary-500" />
      <select
        :value="category"
        @input="$emit('update:category', $event.target.value)"
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-primary-500 focus:border-primary-500">
        <option value="">All Categories</option>
        <option value="Equipment">Equipment</option>
        <option value="Tools">Tools</option>
      </select>
      <div class="flex items-center">
        <input
          id="low-stock"
          :checked="lowStock"
          @change="$emit('update:lowStock', $event.target.checked)"
          type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
        <label
          for="low-stock"
          class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
          Low Stock Only
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  search: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: '',
  },
  lowStock: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['update:search', 'update:category', 'update:lowStock']);
</script>
