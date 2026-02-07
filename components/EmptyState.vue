<template>
  <div class="text-center py-12">
    <div class="text-6xl mb-4">{{ icon }}</div>
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ title }}</h3>
    <p class="text-gray-500 dark:text-gray-400 mb-6">{{ message }}</p>
    <slot name="action"></slot>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: '📦',
  },
  title: {
    type: String,
    default: 'No items found',
  },
  message: {
    type: String,
    default: 'Get started by creating a new item',
  },
});
</script>
