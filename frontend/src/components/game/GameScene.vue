<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { useThree } from '@/composables/useThree'
import { usePhysics } from '@/composables/usePhysics'
import { useCityGrid, ZoneType } from '@/composables/useCityGrid'
import { useTextures } from '@/composables/useTextures'
import { useGameStore } from '@/stores/game'

// Initialize game store
const gameStore = useGameStore()

// Initialize Three.js
const { scene, camera, renderer, initialize } = useThree()

// Initialize physics
const { world, startSimulation } = usePhysics()

// Initialize textures
const { grassTexture, buildingTextures } = useTextures()

// Initialize city grid
const { createSimpleCity } = useCityGrid({ width: 20, height: 20 }, 1)

// Reference to the canvas container
const canvasContainer = ref<HTMLElement | null>(null)

// Animation frame for physics update
let physicsAnimationId: number | null = null

// Last time for game time updates
let lastTime = 0

// Setup the scene when component is mounted
onMounted(() => {
  if (!canvasContainer.value) return
  
  // Initialize Three.js with the container
  initialize(canvasContainer.value)
  
  // Set up camera position for better view
  if (camera.value) {
    camera.value.position.set(10, 15, 20)
    camera.value.lookAt(0, 0, 0)
  }
  
  // Enable shadows in the renderer
  if (renderer.value) {
    renderer.value.shadowMap.enabled = true
    renderer.value.shadowMap.type = THREE.PCFSoftShadowMap
  }
  
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.value.add(ambientLight)
  
  // Add directional light (sun)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(10, 20, 15)
  directionalLight.castShadow = true
  
  // Configure shadow properties
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 50
  directionalLight.shadow.camera.left = -20
  directionalLight.shadow.camera.right = 20
  directionalLight.shadow.camera.top = 20
  directionalLight.shadow.camera.bottom = -20
  
  scene.value.add(directionalLight)
  
  // Add hemisphere light for better ambient lighting
  const hemisphereLight = new THREE.HemisphereLight(0xddeeff, 0x202020, 0.5)
  scene.value.add(hemisphereLight)
  
  // Add a subtle fog effect
  scene.value.fog = new THREE.FogExp2(0xccccff, 0.01)
  
  // Start physics simulation
  startSimulation()
  
  // Create the city
  createSimpleCity(scene.value, world.value)
  
  // Start physics animation update
  updatePhysics()
  
  // Initialize game
  gameStore.initializeGame()
  gameStore.startGame()
  
  // Start game time
  lastTime = performance.now()
})

onBeforeUnmount(() => {
  if (physicsAnimationId !== null) {
    cancelAnimationFrame(physicsAnimationId)
  }
  
  // Stop the game
  gameStore.pauseGame()
})

// Update the physics and game time
const updatePhysics = () => {
  physicsAnimationId = requestAnimationFrame(updatePhysics)
  
  // Update game time
  const currentTime = performance.now()
  const deltaTime = (currentTime - lastTime) / 1000 // in seconds
  lastTime = currentTime
  
  // Update game time in the store
  gameStore.updateGameTime(deltaTime)
}

// Add orbit controls for camera
const addOrbitControls = () => {
  if (!camera.value || !renderer.value) return
  
  // Import OrbitControls dynamically to avoid SSR issues
  import('three/examples/jsm/controls/OrbitControls.js').then(({ OrbitControls }) => {
    const controls = new OrbitControls(camera.value!, renderer.value!.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.screenSpacePanning = false
    controls.minDistance = 5
    controls.maxDistance = 50
    controls.maxPolarAngle = Math.PI / 2 - 0.1 // Prevent going below ground
  })
}

// Add orbit controls when component is mounted
onMounted(() => {
  addOrbitControls()
})
</script>

<template>
  <div class="game-scene">
    <div ref="canvasContainer" class="canvas-container"></div>
    
    <!-- Game time display -->
    <div class="game-time">
      {{ gameStore.formattedGameTime }}
    </div>
  </div>
</template>

<style scoped>
.game-scene {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.canvas-container {
  width: 100%;
  height: 100%;
}

.game-time {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-family: monospace;
}
</style> 