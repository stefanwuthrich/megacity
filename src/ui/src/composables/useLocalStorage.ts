import { ref, watch } from 'vue';

export function useLocalStorage<T>(key: string, defaultValue: T) {
  // Try to get the value from localStorage
  const storedValue = localStorage.getItem(key);
  
  // Create a ref with either the stored value or the default
  const value = ref<T>(
    storedValue ? JSON.parse(storedValue) : defaultValue
  );
  
  // Watch for changes and update localStorage
  watch(
    value,
    (newValue) => {
      if (newValue === null || newValue === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    },
    { deep: true }
  );
  
  // Return the ref
  return value;
} 