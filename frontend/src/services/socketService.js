import {io} from 'socket.io-client'
import {SOCKET_URL} from '../config/api'

let socket = null

const socketService = {
  connect: token => {
    if (!token) return null

    if (socket) {
      socket.auth = {token}
      if (!socket.connected) socket.connect()
      return socket
    }

    socket = io(SOCKET_URL, {
      auth: {token},
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    })

    return socket
  },

  disconnect: () => {
    if (socket) {
      socket.removeAllListeners()
      socket.disconnect()
      socket = null
    }
  },

  isConnected: () => Boolean(socket?.connected),

  joinOrderRoom: orderId => socket?.emit('join-order', orderId),
  leaveOrderRoom: orderId => socket?.emit('leave-order', orderId),
  sendTypingStart: orderId => socket?.emit('typing-start', orderId),
  sendTypingStop: orderId => socket?.emit('typing-stop', orderId),

  onConnect: callback => {
    socket?.on('connect', callback)
    return () => socket?.off('connect', callback)
  },
  onDisconnect: callback => {
    socket?.on('disconnect', callback)
    return () => socket?.off('disconnect', callback)
  },
  onOrderUpdate: callback => {
    socket?.on('order-status-updated', callback)
    return () => socket?.off('order-status-updated', callback)
  },
  onNewMessage: callback => {
    socket?.on('new-message', callback)
    return () => socket?.off('new-message', callback)
  },
  onTypingStart: callback => {
    socket?.on('typing-start', callback)
    return () => socket?.off('typing-start', callback)
  },
  onTypingStop: callback => {
    socket?.on('typing-stop', callback)
    return () => socket?.off('typing-stop', callback)
  },
  onMessagesRead: callback => {
    socket?.on('messages-read', callback)
    return () => socket?.off('messages-read', callback)
  },
  onDisputeUpdate: callback => {
    socket?.on('dispute-updated', callback)
    return () => socket?.off('dispute-updated', callback)
  },
  onSocketError: callback => {
    socket?.on('socket-error', callback)
    return () => socket?.off('socket-error', callback)
  },
}

export default socketService
