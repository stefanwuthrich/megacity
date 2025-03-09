<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="game-container">
    <RouterView />
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.game-container {
  width: 100vw;
  height: 100vh;
  background-color: #121212;
  color: white;
}
</style>
