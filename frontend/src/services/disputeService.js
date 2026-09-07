import {api} from './api'

export const getDisputes = async () => {
  const data = await api.get('/disputes')
  return data.disputes || []
}

export const getDisputeById = async disputeId => {
  const data = await api.get(`/disputes/${disputeId}`)
  return data.dispute
}

export const createDispute = async data => {
  const response = await api.post('/disputes', {
    orderId: data.orderId,
    reasonCategory: data.reasonCategory,
    description: data.description,
  })
  return response.dispute
}

export const updateDisputeStatus = async (disputeId, status, adminResolutionNotes = '') => {
  const data = await api.patch(`/disputes/${disputeId}/status`, {
    status,
    adminResolutionNotes,
  })
  return data
}
