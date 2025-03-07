<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <header class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Megacity</h1>
      </div>
    </header>
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4 flex flex-col items-center justify-center">
            <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Welcome to Megacity MMO Browser Game
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-lg">
              Build and manage your own city in this multiplayer online simulation game. Collaborate with other players, get elected as mayor, and shape the future of your city.
            </p>
            <div class="flex space-x-4">
              <button 
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                @click="navigateToLogin"
              >
                Get Started
              </button>
              <button 
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

const router = useRouter();
const userStore = useUserStore();

const navigateToLogin = () => {
  if (userStore.isLoggedIn) {
    router.push('/city');
  } else {
    router.push('/login');
  }
};
</script> 