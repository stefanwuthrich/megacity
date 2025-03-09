import { ref, shallowRef, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

export function useThree() {
  const container = ref<HTMLElement | null>(null)
  // Use shallowRef for Three.js objects to avoid reactivity issues
  const scene = shallowRef<THREE.Scene>(new THREE.Scene())
  const camera = shallowRef<THREE.PerspectiveCamera | null>(null)
  const renderer = shallowRef<THREE.WebGLRenderer | null>(null)
  
  let animationFrameId: number | null = null

  // Initialize the 3D scene
  const initialize = (el: HTMLElement) => {
    container.value = el
    
    // Setup camera
    const aspect = container.value.clientWidth / container.value.clientHeight
    const cam = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    cam.position.z = 5
    camera.value = cam
    
    // Setup renderer
    const rend = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    rend.setSize(container.value.clientWidth, container.value.clientHeight)
    rend.setPixelRatio(window.devicePixelRatio)
    container.value.appendChild(rend.domElement)
    renderer.value = rend
    
    // Handle window resize
    window.addEventListener('resize', handleResize)
    
    // Add default lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.value.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.value.add(directionalLight)
    
    // Start the animation loop
    animate()
  }
  
  // Handle window resize
  const handleResize = () => {
    if (!container.value || !camera.value || !renderer.value) return
    
    camera.value.aspect = container.value.clientWidth / container.value.clientHeight
    camera.value.updateProjectionMatrix()
    renderer.value.setSize(container.value.clientWidth, container.value.clientHeight)
  }
  
  // Animation loop
  const animate = () => {
    if (!renderer.value || !scene.value || !camera.value) return
    
    animationFrameId = requestAnimationFrame(animate)
    renderer.value.render(scene.value, camera.value)
  }
  
  // Clean up resources when component is unmounted
  onUnmounted(() => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }
    
    window.removeEventListener('resize', handleResize)
    
    if (renderer.value && container.value) {
      container.value.removeChild(renderer.value.domElement)
      renderer.value.dispose()
    }
  })
  
  return {
    scene,
    camera,
    renderer,
    initialize
  }
} 