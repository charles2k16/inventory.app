<template>
  <div class="min-h-screen bg-slate-900 text-slate-100">
    <!-- POS Header -->
    <header class="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-xl font-bold tracking-tight text-emerald-400">
            DIASO POS
          </h1>
          <span class="text-slate-400 text-sm">
            Point of Sale
          </span>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm text-slate-400">
            {{ userDisplay }}
          </span>
          <NuxtLink
            to="/"
            class="text-slate-400 hover:text-white text-sm transition-colors">
            Back to App
          </NuxtLink>
          <button
            @click="logout"
            class="px-3 py-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors rounded border border-slate-600 hover:border-red-500/50">
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Page Content -->
    <main class="p-6">
      <slot />
    </main>
  </div>
</template>

<script setup>
const userDisplay = ref('');

onMounted(() => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      userDisplay.value = user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.username || 'Sales Person';
    } else {
      userDisplay.value = 'Sales Person';
    }
  } catch {
    userDisplay.value = 'Sales Person';
  }
});

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  navigateTo('/login');
};
</script>
