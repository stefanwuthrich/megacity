import { ref, onMounted, watch } from 'vue';
import { useLocalStorage } from './useLocalStorage';

export function useDarkMode() {
  // Use localStorage to persist the theme preference
  const darkMode = useLocalStorage<boolean>('darkMode', false);
  const systemPrefersDark = ref(false);
  
  // Check system preference
  onMounted(() => {
    // Check if the system prefers dark mode
    systemPrefersDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // If no user preference is set, use system preference
    if (localStorage.getItem('darkMode') === null) {
      darkMode.value = systemPrefersDark.value;
    }
    
    // Apply the theme
    applyTheme();
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      systemPrefersDark.value = e.matches;
      // Only update if the user hasn't set a preference
      if (localStorage.getItem('darkMode') === null) {
        darkMode.value = systemPrefersDark.value;
      }
    });
  });
  
  // Watch for changes and apply the theme
  watch(darkMode, () => {
    applyTheme();
  });
  
  // Toggle dark mode
  function toggleDarkMode() {
    darkMode.value = !darkMode.value;
  }
  
  // Apply the theme to the document
  function applyTheme() {
    if (darkMode.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  
  return {
    darkMode,
    systemPrefersDark,
    toggleDarkMode
  };
} 