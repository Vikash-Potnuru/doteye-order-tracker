import {api} from './api'

export const loginUser = async (email, password) => api.post('/auth/login', {email, password})
export const registerUser = async (name, email, password) => api.post('/auth/register', {name, email, password})
export const getCurrentUser = async () => api.get('/auth/me')
