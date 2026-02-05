<template>
  <button
    @click="toggleTheme"
    :title="`Switch to ${isDark ? 'light' : 'dark'} mode`"
    class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
    <!-- Sun Icon (shown in dark mode) -->
    <svg v-if="isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fill-rule="evenodd"
        d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-2.12-2.12a1 1 0 111.415-1.415l2.12 2.12a1 1 0 11-1.415 1.415zM2.05 2.464a1 1 0 111.415-1.415l2.12 2.12a1 1 0 11-1.415 1.415L2.05 2.464zm7.071 7.071L9.414 9.414a1 1 0 00-1.415 0l-.707.707a1 1 0 001.415 1.415l.707-.707zM15.364 5.464l-2.12-2.12a1 1 0 011.415-1.415l2.12 2.12a1 1 0 01-1.415 1.415zM2.464 15.364l2.12-2.12a1 1 0 011.415 1.415l-2.12 2.12a1 1 0 01-1.415-1.415zM15.536 15.536a1 1 0 01-1.414 0l-2.12-2.12a1 1 0 011.414-1.414l2.12 2.12a1 1 0 010 1.414zM19 10a1 1 0 11-2 0 1 1 0 012 0zM2 10a1 1 0 11-2 0 1 1 0 012 0z"
        clip-rule="evenodd" />
    </svg>

    <!-- Moon Icon (shown in light mode) -->
    <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  </button>
</template>

<script setup>
const { isDark, toggleTheme } = useTheme();
</script>
