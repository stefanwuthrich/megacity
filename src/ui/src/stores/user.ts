import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isLoggedIn = computed(() => !!user.value);
  const username = computed(() => user.value?.username || 'Guest');
  const userRole = computed(() => user.value?.role || 'visitor');

  // Actions
  async function login(credentials: { email: string; password: string }) {
    isLoading.value = true;
    error.value = null;
    
    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      user.value = {
        id: '1',
        username: 'testuser',
        email: credentials.email,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed';
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    user.value = null;
  }

  return {
    // State
    user,
    isLoading,
    error,
    
    // Getters
    isLoggedIn,
    username,
    userRole,
    
    // Actions
    login,
    logout,
  };
}); 