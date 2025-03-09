<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { useThree } from '@/composables/useThree'
import { usePhysics } from '@/composables/usePhysics'

// Initialize Three.js
const { scene, camera, renderer, initialize } = useThree()

// Initialize physics
const { world, startSimulation, createBox, createGround } = usePhysics()

// Map of physics bodies to meshes
const bodyToMesh = new Map()

// Reference to the canvas container
const canvasContainer = ref<HTMLElement | null>(null)

// Animation frame for physics update
let physicsAnimationId: number | null = null

// Setup the scene when component is mounted
onMounted(() => {
  if (!canvasContainer.value) return
  
  // Initialize Three.js with the container
  initialize(canvasContainer.value)
  
  // Start physics simulation
  startSimulation()
  
  // Setup scene
  setupScene()
  
  // Start physics animation update
  updatePhysics()
})

onBeforeUnmount(() => {
  if (physicsAnimationId !== null) {
    cancelAnimationFrame(physicsAnimationId)
  }
})

// Update the physics and sync with visual objects
const updatePhysics = () => {
  physicsAnimationId = requestAnimationFrame(updatePhysics)
  
  // Update visual objects based on physics
  bodyToMesh.forEach((mesh, bodyId) => {
    const body = world.value.bodies.find(b => b.id === bodyId)
    if (body && mesh) {
      // Update position
      mesh.position.x = body.position.x
      mesh.position.y = body.position.y
      mesh.position.z = body.position.z
      
      // Update rotation
      mesh.quaternion.x = body.quaternion.x
      mesh.quaternion.y = body.quaternion.y
      mesh.quaternion.z = body.quaternion.z
      mesh.quaternion.w = body.quaternion.w
    }
  })
}

// Setup the 3D scene
const setupScene = () => {
  // Create a ground plane
  const groundBody = createGround()
  
  // Create a visual representation of the ground
  const groundGeometry = new THREE.PlaneGeometry(20, 20)
  const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x333333,
    roughness: 0.8,
    metalness: 0.2
  })
  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
  groundMesh.rotation.x = -Math.PI / 2
  groundMesh.receiveShadow = true
  scene.value.add(groundMesh)
  
  // Create some boxes
  createCube(0, 5, 0, 1, 0xff0000)
  createCube(-2, 7, 2, 1, 0x00ff00)
  createCube(2, 10, -2, 1, 0x0000ff)
  
  // Create a simple city block for demonstration
  createBuilding(-5, 0.5, -5, 2, 1, 2, 0x8888ff)
  createBuilding(-5, 0.5, 0, 2, 2, 2, 0x88ff88)
  createBuilding(0, 0.5, -5, 3, 4, 2, 0xff8888)
  createBuilding(5, 0.5, 5, 2, 3, 2, 0xffff88)
}

// Create a cube with physics
const createCube = (x: number, y: number, z: number, size: number, color: number) => {
  // Create physics body
  const position = new CANNON.Vec3(x, y, z)
  const boxSize = new CANNON.Vec3(size, size, size)
  const body = createBox(position, boxSize, 1)
  
  // Create visual mesh
  const geometry = new THREE.BoxGeometry(size, size, size)
  const material = new THREE.MeshStandardMaterial({ color })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x, y, z)
  mesh.castShadow = true
  mesh.receiveShadow = true
  scene.value.add(mesh)
  
  // Map the body to the mesh for updates
  bodyToMesh.set(body.id, mesh)
  
  return { body, mesh }
}

// Create a building (static box)
const createBuilding = (x: number, y: number, z: number, width: number, height: number, depth: number, color: number) => {
  // Create physics body
  const position = new CANNON.Vec3(x, y + height / 2, z)
  const boxSize = new CANNON.Vec3(width, height, depth)
  const body = createBox(position, boxSize, 0) // zero mass = static
  
  // Create visual mesh
  const geometry = new THREE.BoxGeometry(width, height, depth)
  const material = new THREE.MeshStandardMaterial({ color })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x, y + height / 2, z)
  mesh.castShadow = true
  mesh.receiveShadow = true
  scene.value.add(mesh)
  
  // Static objects don't need updating
  // But we'll add them to the map anyway for consistency
  bodyToMesh.set(body.id, mesh)
  
  return { body, mesh }
}
</script>

<template>
  <div class="game-scene">
    <div ref="canvasContainer" class="canvas-container"></div>
  </div>
</template>

<style scoped>
.game-scene {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.canvas-container {
  width: 100%;
  height: 100%;
}
</style> 