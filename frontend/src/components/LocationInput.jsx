import { useState } from 'react'
import './LocationInput.css'

const LocationInput = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    location_name: '',
    latitude: '',
    longitude: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      location_name: formData.location_name,
      latitude: parseFloat(formData.latitude) || 0,
      longitude: parseFloat(formData.longitude) || 0
    })
  }

  const handleQuickLocation = (location) => {
    setFormData(location)
  }

  const quickLocations = [
    { location_name: 'Downtown Business District', latitude: 40.7128, longitude: -74.0060 },
    { location_name: 'Airport Highway', latitude: 34.0522, longitude: -118.2437 },
    { location_name: 'University Campus', latitude: 37.7749, longitude: -122.4194 }
  ]

  return (
    <div className="location-input-container glass-card">
      <form onSubmit={handleSubmit} className="location-form">
        <div className="form-header">
          <span className="form-icon">📍</span>
          <h2>Enter Your Route</h2>
        </div>

        <div className="form-main-input">
          <label style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location Name</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="glass-input"
              placeholder="Airport Highway"
              value={formData.location_name}
              onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
              required
            />
            <button type="button" className="add-btn">+</button>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Latitude</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="glass-input"
                placeholder="40.7128"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                required
              />
              <button type="button" className="dropdown-btn">▼</button>
            </div>
          </div>

          <div className="form-group">
            <label>Longitude</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="glass-input"
                placeholder="-74.0060"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                required
              />
              <button type="button" className="refresh-btn">⟳</button>
            </div>
          </div>
        </div>

        <button type="submit" className="submit-btn glass-button" disabled={loading}>
          <span>➜</span>
          {loading ? 'ANALYZING...' : 'PREDICT TRAFFIC'}
        </button>

        <div className="quick-locations">
          <p className="quick-title">Quick Locations</p>
          <div className="quick-buttons">
            {quickLocations.map((loc, index) => (
              <button
                key={index}
                type="button"
                className="quick-btn"
                onClick={() => handleQuickLocation(loc)}
              >
                {loc.location_name}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  )
}

export default LocationInput
