<script setup lang="ts">
import { ref } from 'vue'
import GameScene from '@/components/game/GameScene.vue'

const gameStarted = ref(false)

const startGame = () => {
  gameStarted.value = true
}
</script>

<template>
  <main class="game-main">
    <!-- Game intro screen -->
    <div v-if="!gameStarted" class="game-intro">
      <h1 class="text-4xl font-bold mb-4">Megacity</h1>
      <p class="mb-6">Welcome to the multiplayer city simulation game</p>
      <button @click="startGame" class="game-button">Start Game</button>
    </div>
    
    <!-- Actual game view -->
    <div v-else class="game-view">
      <GameScene />
      
      <!-- Simple game UI overlay -->
      <div class="game-ui">
        <div class="game-header">
          <h2>Megacity</h2>
          <div class="player-info">
            <span>Player: Guest</span>
            <span class="ml-4">Level: 1</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.game-main {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #121212;
  color: white;
  text-align: center;
}

.game-intro {
  max-width: 600px;
  padding: 2rem;
}

.game-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.game-button:hover {
  background-color: #45a049;
}

.game-view {
  position: relative;
  width: 100%;
  height: 100%;
}

.game-ui {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 10;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.5);
}

.player-info {
  font-size: 0.9rem;
}
</style>
