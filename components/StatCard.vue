<template>
  <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
    <div class="p-5">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div
            class="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-md flex items-center justify-center">
            <span class="text-2xl">{{ icon || '📊' }}</span>
          </div>
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              {{ title }}
            </dt>
            <dd class="mt-1">
              <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ value }}
              </div>
            </dd>
            <dd v-if="subtitle" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ subtitle }}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  subtitle: String,
  icon: String,
});
</script>
