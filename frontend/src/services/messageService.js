import {api} from './api'

export const getMessages = async orderId => {
  const data = await api.get(`/orders/${orderId}/messages`)
  return data.messages || []
}

export const getAllMessages = async () => {
  const data = await api.get('/orders/messages/all')
  return data.messages || []
}

export const sendMessage = async (orderId, content) => {
  const data = await api.post(`/orders/${orderId}/messages`, {content})
  return data.message
}

export const markMessagesAsRead = async orderId => {
  const data = await api.patch(`/orders/${orderId}/messages/read`, {})
  return data.messages || []
}
