<template>
  <div class="flex gap-2 mb-6 flex-wrap">
    <button
      v-for="option in dateOptions"
      :key="option.value"
      @click="$emit('update:range', option.value)"
      :class="[
        'px-4 py-2 rounded-md font-medium text-sm transition',
        modelValue === option.value
          ? 'bg-primary-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
      ]">
      {{ option.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: 'today',
  },
});

defineEmits(['update:range']);

const dateOptions = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'All Time', value: 'all' },
];
</script>
