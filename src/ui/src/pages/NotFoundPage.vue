<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-800 dark:text-gray-200">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mt-4">Page Not Found</h2>
      <p class="text-gray-600 dark:text-gray-400 mt-2 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <router-link 
        to="/" 
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Go Home
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed
</script> 