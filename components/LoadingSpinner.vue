<template>
  <div class="flex justify-center items-center" :class="containerClass">
    <div
      class="animate-spin rounded-full border-b-2"
      :class="spinnerClass"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'md' // sm, md, lg
  },
  containerClass: {
    type: String,
    default: 'py-12'
  }
});

const spinnerClass = computed(() => {
  const size = props.size;
  if (size === 'sm') return 'h-6 w-6 border-primary-600';
  if (size === 'lg') return 'h-16 w-16 border-primary-600';
  return 'h-12 w-12 border-primary-600';
});
</script>
