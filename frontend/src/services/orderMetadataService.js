import {api} from './api'

export const getOrderMetadata = async () => {
  return api.get('/orders/metadata')
}
