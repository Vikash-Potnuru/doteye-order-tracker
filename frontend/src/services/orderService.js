import {api} from './api'

export const getOrders = async () => {
  const data = await api.get('/orders?page=1&limit=100')
  return data.orders || []
}

export const getOrderById = async orderId => {
  const data = await api.get(`/orders/${orderId}`)
  return data.order
}

export const getOrderTimeline = async orderId => {
  const data = await api.get(`/orders/${orderId}/timeline`)
  return data.timelineHistory || []
}

export const updateOrderStatus = async (orderId, newStatus, note = '') => {
  const data = await api.patch(`/orders/${orderId}/status`, {status: newStatus, note})
  return data
}

export const cancelOrder = async (orderId, note = '') => {
  const data = await api.patch(`/orders/${orderId}/cancel`, {note})
  return data
}
