import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('game', () => {
  // Game state
  const isInitialized = ref(false)
  const isLoading = ref(false)
  const isRunning = ref(false)
  const isPaused = ref(false)
  
  // Player information
  const playerName = ref('Guest')
  const playerLevel = ref(1)
  const playerPoints = ref(0)
  
  // City information
  const cityName = ref('New City')
  const cityPopulation = ref(0)
  const cityFunds = ref(10000)
  const cityHappiness = ref(50) // 0-100 scale
  
  // Game settings
  const gameSpeed = ref(1) // 1 = normal, 2 = fast, 0.5 = slow
  
  // Game time
  const gameTime = ref(0) // in-game time in milliseconds
  const gameDay = ref(1)
  const gameHour = ref(8) // start at 8 AM
  
  // Computed properties
  const formattedGameTime = computed(() => {
    const hours = gameHour.value.toString().padStart(2, '0')
    const minutes = Math.floor((gameTime.value / 1000 / 60) % 60).toString().padStart(2, '0')
    return `Day ${gameDay.value} - ${hours}:${minutes}`
  })
  
  // Actions
  function initializeGame() {
    isInitialized.value = true
    isLoading.value = false
    resetGame()
  }
  
  function startGame() {
    if (!isInitialized.value) {
      initializeGame()
    }
    isRunning.value = true
    isPaused.value = false
  }
  
  function pauseGame() {
    isPaused.value = true
  }
  
  function resumeGame() {
    isPaused.value = false
  }
  
  function resetGame() {
    isRunning.value = false
    isPaused.value = false
    playerLevel.value = 1
    playerPoints.value = 0
    cityPopulation.value = 0
    cityFunds.value = 10000
    cityHappiness.value = 50
    gameTime.value = 0
    gameDay.value = 1
    gameHour.value = 8
  }
  
  function updateGameTime(deltaTime: number) {
    if (!isRunning.value || isPaused.value) return
    
    // Update game time (1 real second = 1 minute in game)
    const timeScale = 60 * gameSpeed.value
    gameTime.value += deltaTime * timeScale
    
    // Update game hour (24 hour system)
    gameHour.value = 8 + Math.floor((gameTime.value / 1000 / 60) % 24)
    
    // Update game day
    if (gameHour.value === 0) {
      gameDay.value++
    }
  }
  
  function earnPoints(points: number) {
    playerPoints.value += points
    
    // Level up logic (very simple for now)
    if (playerPoints.value >= playerLevel.value * 1000) {
      playerLevel.value++
    }
  }
  
  function updateCityFunds(amount: number) {
    cityFunds.value += amount
  }
  
  function updateCityPopulation(amount: number) {
    cityPopulation.value += amount
  }
  
  function updateCityHappiness(amount: number) {
    cityHappiness.value = Math.max(0, Math.min(100, cityHappiness.value + amount))
  }
  
  function setGameSpeed(speed: number) {
    gameSpeed.value = speed
  }
  
  function setPlayerName(name: string) {
    playerName.value = name
  }
  
  function setCityName(name: string) {
    cityName.value = name
  }
  
  return {
    // State
    isInitialized,
    isLoading,
    isRunning,
    isPaused,
    playerName,
    playerLevel,
    playerPoints,
    cityName,
    cityPopulation,
    cityFunds,
    cityHappiness,
    gameSpeed,
    gameTime,
    gameDay,
    gameHour,
    
    // Computed
    formattedGameTime,
    
    // Actions
    initializeGame,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    updateGameTime,
    earnPoints,
    updateCityFunds,
    updateCityPopulation,
    updateCityHappiness,
    setGameSpeed,
    setPlayerName,
    setCityName
  }
}) 