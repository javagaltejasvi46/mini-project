// Central API client — all backend calls go through here
export const API_BASE = 'http://localhost:8000'

export const api = {
  health: () => fetch(`${API_BASE}/health`).then(r => r.json()),

  predict: (body) =>
    fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(r => r.json()),

  findRoutes: (body) =>
    fetch(`${API_BASE}/routes/find`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(r => r.json()),

  traffic: (lat, lon, radius_km = 2) =>
    fetch(`${API_BASE}/traffic?lat=${lat}&lon=${lon}&radius_km=${radius_km}`).then(r => r.json()),

  feedback: (body) =>
    fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(r => r.json()),

  feedbackStats: () => fetch(`${API_BASE}/feedback/stats`).then(r => r.json()),

  modelPerformance: () => fetch(`${API_BASE}/model/performance`).then(r => r.json()),

  fetchLiveData: () =>
    fetch(`${API_BASE}/admin/fetch-data`, { method: 'POST' }).then(r => r.json()),
}
