<template>
  <div class="bg-white overflow-hidden shadow rounded-lg">
    <div class="p-5">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <slot name="icon">
            <div class="h-12 w-12 bg-primary-100 rounded-md flex items-center justify-center">
              <span class="text-2xl">📊</span>
            </div>
          </slot>
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{ title }}
            </dt>
            <dd class="mt-1">
              <div class="text-2xl font-semibold text-gray-900">
                {{ value }}
              </div>
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
  value: [String, Number]
});
</script>
