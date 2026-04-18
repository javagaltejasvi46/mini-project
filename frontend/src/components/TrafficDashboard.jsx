import { useState, useRef, useEffect } from 'react'
import LocationInput from './LocationInput'
import TrafficChart from './TrafficChart'
import AlternateRoutes from './AlternateRoutes'
import TrafficInfo from './TrafficInfo'
import { useScrollAnimation } from '../useScrollAnimation'
import './TrafficDashboard.css'

const TrafficDashboard = () => {
  const [trafficData, setTrafficData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(false)
  const resultsRef = useRef(null)

  useScrollAnimation([trafficData, loading])

  useEffect(() => {
    if (trafficData && !loading && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [trafficData, loading])

  const handleLocationSubmit = async (locationData) => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(locationData),
      })
      const data = await response.json()
      setTrafficData(data)
    } catch (error) {
      console.error('Error fetching traffic data:', error)
      alert('Failed to fetch traffic data. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleFetchData = async () => {
    setFetchingData(true)
    try {
      const response = await fetch('http://localhost:8000/admin/fetch-data', {
        method: 'POST',
      })
      const data = await response.json()
      if (data.status === 'success') {
        alert(`✅ Data fetched successfully for ${data.locations} locations!`)
      } else {
        alert(`❌ Error: ${data.message}`)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Failed to fetch data. Make sure the backend is running.')
    } finally {
      setFetchingData(false)
    }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">🚌</div>
            <div className="header-title-section">
              <h1 className="dashboard-title">SANJAYA insight engine</h1>
              <p className="dashboard-subtitle">Intelligent Traffic Prediction & Route Optimization</p>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <div className="header-badge">
            <span>🎯</span>
            <span>Autodetect</span>
          </div>
          <button 
            className="fetch-data-btn"
            onClick={handleFetchData}
            disabled={fetchingData}
          >
            {fetchingData ? '⏳ Fetching...' : '🔄 Fetch Live Data'}
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="animate-on-scroll">
          <LocationInput onSubmit={handleLocationSubmit} loading={loading} />
        </div>
        
        {loading && (
          <div className="loading-container animate-scale">
            <div className="loading-spinner"></div>
            <p>Analyzing traffic patterns...</p>
          </div>
        )}

        {trafficData && !loading && (
          <div className="results-grid" ref={resultsRef}>
            <div className="animate-on-scroll animate-delay-1">
              <TrafficInfo data={trafficData} />
            </div>
            <div className="animate-on-scroll animate-delay-2">
              <TrafficChart data={trafficData.traffic_data} />
            </div>
            <div className="animate-on-scroll animate-delay-3">
              <AlternateRoutes routes={trafficData.alternate_routes} recommendations={trafficData.recommendations} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrafficDashboard
