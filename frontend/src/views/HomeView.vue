<script setup lang="ts">
import { ref } from 'vue'
import GameScene from '@/components/game/GameScene.vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
const gameStarted = ref(false)
const isLoading = ref(false)

const startGame = () => {
  isLoading.value = true
  
  // Simulate loading time (in a real app, this would be actual loading)
  setTimeout(() => {
    gameStarted.value = true
    isLoading.value = false
    gameStore.startGame()
  }, 1500)
}
</script>

<template>
  <main class="game-main">
    <!-- Game intro screen -->
    <div v-if="!gameStarted" class="game-intro">
      <h1 class="text-4xl font-bold mb-4">Megacity</h1>
      <p class="mb-6">Welcome to the multiplayer city simulation game</p>
      
      <button 
        @click="startGame" 
        class="game-button"
        :disabled="isLoading"
      >
        <span v-if="!isLoading">Start Game</span>
        <span v-else class="loading-spinner">
          <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      </button>
    </div>
    
    <!-- Actual game view -->
    <div v-else class="game-view">
      <GameScene />
      
      <!-- Simple game UI overlay -->
      <div class="game-ui">
        <div class="game-header">
          <h2>Megacity</h2>
          <div class="player-info">
            <span>Player: {{ gameStore.playerName }}</span>
            <span class="ml-4">Level: {{ gameStore.playerLevel }}</span>
          </div>
        </div>
        
        <!-- Game controls -->
        <div class="game-controls">
          <button class="control-button" @click="gameStore.isPaused ? gameStore.resumeGame() : gameStore.pauseGame()">
            {{ gameStore.isPaused ? 'Resume' : 'Pause' }}
          </button>
          
          <div class="speed-controls">
            <button 
              class="speed-button" 
              :class="{ active: gameStore.gameSpeed === 0.5 }"
              @click="gameStore.setGameSpeed(0.5)"
            >
              0.5x
            </button>
            <button 
              class="speed-button" 
              :class="{ active: gameStore.gameSpeed === 1 }"
              @click="gameStore.setGameSpeed(1)"
            >
              1x
            </button>
            <button 
              class="speed-button" 
              :class="{ active: gameStore.gameSpeed === 2 }"
              @click="gameStore.setGameSpeed(2)"
            >
              2x
            </button>
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
  min-width: 120px;
}

.game-button:hover {
  background-color: #45a049;
}

.game-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
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
  height: 100%;
  pointer-events: none;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

.game-controls {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}

.control-button {
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.control-button:hover {
  background-color: #0b7dda;
}

.speed-controls {
  display: flex;
  gap: 8px;
}

.speed-button {
  background-color: #555555;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.speed-button:hover {
  background-color: #666666;
}

.speed-button.active {
  background-color: #ff9800;
}
</style>
