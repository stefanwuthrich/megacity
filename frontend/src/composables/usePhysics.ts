import { shallowRef, onUnmounted } from 'vue'
import * as CANNON from 'cannon-es'

export function usePhysics() {
  const world = shallowRef<CANNON.World>(new CANNON.World())
  
  // Physics configuration
  world.value.gravity.set(0, -9.82, 0) // Earth gravity
  world.value.broadphase = new CANNON.NaiveBroadphase()
  world.value.solver.iterations = 10
  
  let lastCallTime = performance.now()
  let animationFrameId: number | null = null
  
  // Start physics simulation
  const startSimulation = () => {
    lastCallTime = performance.now()
    animationFrameId = requestAnimationFrame(simulationLoop)
  }
  
  // Physics simulation loop
  const simulationLoop = () => {
    animationFrameId = requestAnimationFrame(simulationLoop)
    
    const time = performance.now()
    const dt = (time - lastCallTime) / 1000
    
    // Cap the delta time to prevent large jumps
    const maxDt = 1 / 30
    world.value.step(Math.min(dt, maxDt))
    
    lastCallTime = time
  }
  
  // Stop physics simulation
  const stopSimulation = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  }
  
  // Create a ground plane
  const createGround = () => {
    const groundShape = new CANNON.Plane()
    const groundBody = new CANNON.Body({
      mass: 0, // static body
      shape: groundShape,
    })
    
    // Rotate the ground plane to make it horizontal
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    world.value.addBody(groundBody)
    
    return groundBody
  }
  
  // Create a physics box
  const createBox = (position: CANNON.Vec3, size: CANNON.Vec3, mass: number) => {
    const boxShape = new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2))
    const boxBody = new CANNON.Body({
      mass,
      shape: boxShape,
    })
    
    boxBody.position.copy(position)
    world.value.addBody(boxBody)
    
    return boxBody
  }
  
  // Clean up resources when component is unmounted
  onUnmounted(() => {
    stopSimulation()
  })
  
  return {
    world,
    startSimulation,
    stopSimulation,
    createGround,
    createBox
  }
} 