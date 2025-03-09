import { ref, reactive } from 'vue'

type MessageHandler = (data: any) => void

// Reactive state for WebSocket service
const state = reactive({
  connected: false,
  connecting: false,
  reconnectAttempts: 0,
  error: null as Error | null,
})

export function useWebSocket() {
  let socket: WebSocket | null = null
  let reconnectTimeout: number | null = null
  const messageHandlers = ref<Record<string, MessageHandler[]>>({})
  
  // Create a connection to the WebSocket server
  const connect = (url: string = 'ws://localhost:8080/ws') => {
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket already connected or connecting')
      return
    }
    
    state.connecting = true
    state.error = null
    
    socket = new WebSocket(url)
    
    socket.onopen = () => {
      console.log('WebSocket connected')
      state.connected = true
      state.connecting = false
      state.reconnectAttempts = 0
    }
    
    socket.onclose = (event) => {
      console.log(`WebSocket closed: ${event.code} ${event.reason}`)
      state.connected = false
      
      // Attempt to reconnect if the close wasn't intentional
      if (!event.wasClean) {
        scheduleReconnect()
      }
    }
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
      state.error = new Error('WebSocket connection error')
    }
    
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        handleMessage(message)
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }
  }
  
  // Attempt to reconnect with exponential backoff
  const scheduleReconnect = () => {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout)
    }
    
    const maxReconnectAttempts = 10
    
    if (state.reconnectAttempts < maxReconnectAttempts) {
      const delay = Math.min(1000 * Math.pow(2, state.reconnectAttempts), 30000)
      state.reconnectAttempts++
      
      console.log(`Scheduling reconnect attempt ${state.reconnectAttempts} in ${delay}ms`)
      
      reconnectTimeout = window.setTimeout(() => {
        console.log(`Attempting to reconnect (${state.reconnectAttempts}/${maxReconnectAttempts})`)
        connect()
      }, delay)
    } else {
      console.error('Maximum reconnect attempts reached')
      state.error = new Error('Failed to reconnect after multiple attempts')
    }
  }
  
  // Close the WebSocket connection
  const disconnect = () => {
    if (socket) {
      socket.close()
      socket = null
    }
    
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout)
      reconnectTimeout = null
    }
    
    state.connected = false
    state.connecting = false
  }
  
  // Send a message to the WebSocket server
  const send = (type: string, data: any = {}) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('Cannot send message: WebSocket is not connected')
      return false
    }
    
    try {
      const message = JSON.stringify({ type, data })
      socket.send(message)
      return true
    } catch (error) {
      console.error('Error sending message:', error)
      return false
    }
  }
  
  // Register a message handler
  const on = (type: string, handler: MessageHandler) => {
    if (!messageHandlers.value[type]) {
      messageHandlers.value[type] = []
    }
    messageHandlers.value[type].push(handler)
    
    // Return a function to remove this handler
    return () => {
      const handlers = messageHandlers.value[type]
      const index = handlers.indexOf(handler)
      if (index !== -1) {
        handlers.splice(index, 1)
      }
    }
  }
  
  // Handle incoming messages
  const handleMessage = (message: any) => {
    const { type, data } = message
    
    if (!type) {
      console.warn('Received message without type:', message)
      return
    }
    
    const handlers = messageHandlers.value[type]
    if (handlers && handlers.length > 0) {
      handlers.forEach(handler => handler(data))
    } else {
      console.log(`No handlers registered for message type: ${type}`)
    }
  }
  
  return {
    state,
    connect,
    disconnect,
    send,
    on
  }
} 