import axios from 'axios'

const API_BASE = 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_BASE,
})

export const fetchDetections = () => api.get('/detection/live').then(r => r.data)
export const fetchTracking = () => api.get('/tracking/live').then(r => r.data)
export const fetchPredictions = () => api.get('/prediction/live').then(r => r.data)
export const fetchRisks = (trainSpeed = 80) =>
  api.get('/risk/live', { params: { train_speed: trainSpeed } }).then(r => r.data)
export const fetchAlerts = () => api.get('/alerts/live').then(r => r.data)
export const fetchHeatmap = () => api.get('/dashboard/heatmap').then(r => r.data)
export const fetchIncidents = () => api.get('/dashboard/incidents').then(r => r.data)
export const fetchSummary = () => api.get('/dashboard/summary').then(r => r.data)

export const ALERTS_WS_URL = 'ws://localhost:8000/api/alerts/ws'
