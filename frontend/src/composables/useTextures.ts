import * as THREE from 'three'

// Simple texture loader with caching
export function useTextures() {
  const textureLoader = new THREE.TextureLoader()
  const textureCache = new Map<string, THREE.Texture>()
  
  // Load a texture with caching
  const loadTexture = (url: string): THREE.Texture => {
    if (textureCache.has(url)) {
      return textureCache.get(url)!
    }
    
    const texture = textureLoader.load(url)
    textureCache.set(url, texture)
    return texture
  }
  
  // Create a procedural grass texture
  const createGrassTexture = (): THREE.Texture => {
    // Create a canvas for the texture
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    
    // Fill with base green
    ctx.fillStyle = '#4a7c10'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add some variation
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 3 + 1
      
      // Random green shade
      const r = Math.floor(Math.random() * 30 + 50)
      const g = Math.floor(Math.random() * 50 + 100)
      const b = Math.floor(Math.random() * 30 + 10)
      
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
      ctx.fillRect(x, y, size, size)
    }
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    
    return texture
  }
  
  // Create a procedural asphalt/road texture
  const createRoadTexture = (): THREE.Texture => {
    // Create a canvas for the texture
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    
    // Fill with base dark gray
    ctx.fillStyle = '#333333'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add some variation for asphalt
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 2 + 0.5
      
      // Random gray shade
      const shade = Math.floor(Math.random() * 20 + 40)
      ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`
      ctx.fillRect(x, y, size, size)
    }
    
    // Add road markings (center line)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(canvas.width / 2 - 5, 0, 10, canvas.height)
    
    // Create dashed lines on the sides
    const dashLength = 20
    const gapLength = 20
    
    for (let y = 0; y < canvas.height; y += dashLength + gapLength) {
      ctx.fillRect(canvas.width / 4 - 3, y, 6, dashLength)
      ctx.fillRect((canvas.width * 3) / 4 - 3, y, 6, dashLength)
    }
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    
    return texture
  }
  
  // Create building textures with windows baked in
  const createBuildingTextures = () => {
    // Create residential building texture
    const createResidentialTexture = (): THREE.Texture => {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 512
      const ctx = canvas.getContext('2d')!
      
      // Base building color
      ctx.fillStyle = '#88aaff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Add concrete texture
      for (let i = 0; i < 10000; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * 2 + 0.5
        
        // Random gray shade
        const shade = Math.floor(Math.random() * 20 + 200)
        ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, 0.1)`
        ctx.fillRect(x, y, size, size)
      }
      
      // Add windows
      const windowRows = 8
      const windowCols = 6
      const windowWidth = 40
      const windowHeight = 40
      const marginX = (canvas.width - (windowCols * windowWidth)) / (windowCols + 1)
      const marginY = (canvas.height - (windowRows * windowHeight)) / (windowRows + 1)
      
      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          const x = marginX + col * (windowWidth + marginX)
          const y = marginY + row * (windowHeight + marginY)
          
          // Window frame
          ctx.fillStyle = '#333333'
          ctx.fillRect(x, y, windowWidth, windowHeight)
          
          // Window glass
          const isLit = Math.random() > 0.3
          if (isLit) {
            // Lit window
            const brightness = Math.floor(Math.random() * 55 + 200)
            ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${Math.floor(brightness * 0.8)})`
          } else {
            // Dark window
            const brightness = Math.floor(Math.random() * 30 + 100)
            ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${Math.floor(brightness * 1.2)})`
          }
          
          ctx.fillRect(x + 2, y + 2, windowWidth - 4, windowHeight - 4)
          
          // Window divider
          ctx.fillStyle = '#333333'
          ctx.fillRect(x + windowWidth/2 - 1, y + 2, 2, windowHeight - 4)
          ctx.fillRect(x + 2, y + windowHeight/2 - 1, windowWidth - 4, 2)
        }
      }
      
      const texture = new THREE.CanvasTexture(canvas)
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      
      return texture
    }
    
    // Create commercial building texture
    const createCommercialTexture = (): THREE.Texture => {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 512
      const ctx = canvas.getContext('2d')!
      
      // Base building color
      ctx.fillStyle = '#aaddff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Add concrete texture
      for (let i = 0; i < 10000; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * 2 + 0.5
        
        // Random gray shade
        const shade = Math.floor(Math.random() * 20 + 200)
        ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, 0.1)`
        ctx.fillRect(x, y, size, size)
      }
      
      // Add windows - more uniform for commercial buildings
      const windowRows = 10
      const windowCols = 8
      const windowWidth = 30
      const windowHeight = 30
      const marginX = (canvas.width - (windowCols * windowWidth)) / (windowCols + 1)
      const marginY = (canvas.height - (windowRows * windowHeight)) / (windowRows + 1)
      
      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          const x = marginX + col * (windowWidth + marginX)
          const y = marginY + row * (windowHeight + marginY)
          
          // Window frame
          ctx.fillStyle = '#333333'
          ctx.fillRect(x, y, windowWidth, windowHeight)
          
          // Window glass
          const isLit = Math.random() > 0.4
          if (isLit) {
            // Lit window
            const brightness = Math.floor(Math.random() * 55 + 200)
            ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${Math.floor(brightness * 0.8)})`
          } else {
            // Dark window
            const brightness = Math.floor(Math.random() * 30 + 100)
            ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${Math.floor(brightness * 1.2)})`
          }
          
          ctx.fillRect(x + 2, y + 2, windowWidth - 4, windowHeight - 4)
        }
      }
      
      const texture = new THREE.CanvasTexture(canvas)
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      
      return texture
    }
    
    // Create industrial building texture
    const createIndustrialTexture = (): THREE.Texture => {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 512
      const ctx = canvas.getContext('2d')!
      
      // Base building color
      ctx.fillStyle = '#ffaa88'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Add concrete texture
      for (let i = 0; i < 10000; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * 2 + 0.5
        
        // Random gray shade
        const shade = Math.floor(Math.random() * 20 + 200)
        ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, 0.1)`
        ctx.fillRect(x, y, size, size)
      }
      
      // Add fewer, larger windows for industrial buildings
      const windowRows = 4
      const windowCols = 3
      const windowWidth = 60
      const windowHeight = 40
      const marginX = (canvas.width - (windowCols * windowWidth)) / (windowCols + 1)
      const marginY = (canvas.height - (windowRows * windowHeight)) / (windowRows + 1)
      
      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          const x = marginX + col * (windowWidth + marginX)
          const y = marginY + row * (windowHeight + marginY)
          
          // Window frame
          ctx.fillStyle = '#333333'
          ctx.fillRect(x, y, windowWidth, windowHeight)
          
          // Window glass
          const isLit = Math.random() > 0.5
          if (isLit) {
            // Lit window
            const brightness = Math.floor(Math.random() * 55 + 200)
            ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${Math.floor(brightness * 0.8)})`
          } else {
            // Dark window
            const brightness = Math.floor(Math.random() * 30 + 100)
            ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${Math.floor(brightness * 1.2)})`
          }
          
          ctx.fillRect(x + 2, y + 2, windowWidth - 4, windowHeight - 4)
          
          // Industrial windows often have multiple panes
          ctx.fillStyle = '#333333'
          ctx.fillRect(x + windowWidth/3, y + 2, 2, windowHeight - 4)
          ctx.fillRect(x + 2*windowWidth/3, y + 2, 2, windowHeight - 4)
          ctx.fillRect(x + 2, y + windowHeight/2, windowWidth - 4, 2)
        }
      }
      
      // Add some industrial details
      ctx.fillStyle = '#555555'
      ctx.fillRect(0, canvas.height - 50, canvas.width, 50) // Base
      
      // Add some pipes
      ctx.fillStyle = '#777777'
      ctx.fillRect(50, 100, 20, canvas.height - 150)
      ctx.fillRect(canvas.width - 70, 150, 20, canvas.height - 200)
      
      const texture = new THREE.CanvasTexture(canvas)
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      
      return texture
    }
    
    return {
      residential: createResidentialTexture(),
      commercial: createCommercialTexture(),
      industrial: createIndustrialTexture()
    }
  }
  
  // Create a procedural concrete texture
  const createConcreteTexture = (): THREE.Texture => {
    // Create a canvas for the texture
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    
    // Fill with base light gray
    ctx.fillStyle = '#cccccc'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add some variation for concrete
    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 2 + 0.5
      
      // Random gray shade
      const shade = Math.floor(Math.random() * 40 + 180)
      ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, 0.5)`
      ctx.fillRect(x, y, size, size)
    }
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    
    return texture
  }
  
  // Create a procedural window texture
  const createWindowTexture = (): THREE.Texture => {
    // Create a canvas for the texture
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')!
    
    // Fill with base blue for glass
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#a8c8ff')
    gradient.addColorStop(0.5, '#c8e0ff')
    gradient.addColorStop(1, '#a8c8ff')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add window frame
    ctx.fillStyle = '#333333'
    ctx.fillRect(0, 0, canvas.width, 5)
    ctx.fillRect(0, 0, 5, canvas.height)
    ctx.fillRect(canvas.width - 5, 0, 5, canvas.height)
    ctx.fillRect(0, canvas.height - 5, canvas.width, 5)
    
    // Add window divider
    ctx.fillRect(canvas.width / 2 - 2, 0, 4, canvas.height)
    ctx.fillRect(0, canvas.height / 2 - 2, canvas.width, 4)
    
    // Add some reflection
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.fillRect(10, 10, 40, 40)
    
    // Add some random light/dark spots to simulate interior
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 15 + 5
      const opacity = Math.random() * 0.3 + 0.1
      
      // Randomly choose between light (interior light) and dark (furniture)
      if (Math.random() > 0.5) {
        ctx.fillStyle = `rgba(255, 255, 200, ${opacity})`
      } else {
        ctx.fillStyle = `rgba(30, 30, 50, ${opacity})`
      }
      
      ctx.fillRect(x, y, size, size)
    }
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    
    return texture
  }
  
  // Create all textures and return them
  const grassTexture = createGrassTexture()
  const roadTexture = createRoadTexture()
  const concreteTexture = createConcreteTexture()
  const windowTexture = createWindowTexture()
  const buildingTextures = createBuildingTextures()
  
  return {
    loadTexture,
    createGrassTexture,
    createRoadTexture,
    createConcreteTexture,
    createWindowTexture,
    grassTexture,
    roadTexture,
    concreteTexture,
    windowTexture,
    buildingTextures
  }
} 