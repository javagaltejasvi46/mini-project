import './AlternateRoutes.css'

const AlternateRoutes = ({ routes, recommendations }) => {
  const getTrafficBadgeClass = (level) => {
    const classes = {
      'Low': 'badge-green',
      'Medium': 'badge-yellow',
      'High': 'badge-red'
    }
    return classes[level] || 'badge-blue'
  }

  const routeLabels = ['A', 'B', 'C']
  const routeImages = ['/maps/route-a.png', '/maps/route-b.png', '/maps/route-c.png']

  return (
    <div className="alternate-routes-container glass-card">
      <div className="section-header">
        <span className="section-icon">🗺️</span>
        <h2 className="section-title">Alternate Routes</h2>
      </div>

      <div className="routes-list">
        {routes.map((route, index) => (
          <div key={index} className="route-item">
            <div className="route-badge">{routeLabels[index]}</div>
            
            <div className="route-map">
              <img src={routeImages[index % routeImages.length]} alt={`Route ${routeLabels[index]} map`} />
            </div>

            <div className="route-info">
              <div className="route-name">{route.route_name}</div>
              
              <div className="route-metrics">
                <div className="metric">
                  <span className="metric-icon">📏</span>
                  <span className="metric-value">{route.distance} km</span>
                </div>
                <div className="metric">
                  <span className="metric-icon">⏱️</span>
                  <span className="metric-value">{route.estimated_time} min</span>
                </div>
                <span className={`glass-badge ${getTrafficBadgeClass(route.traffic_level)}`}>
                  {route.traffic_level}
                </span>
              </div>

              <div className="route-progress">
                <div className="glass-progress">
                  <div 
                    className="glass-progress-fill" 
                    style={{ 
                      width: `${(route.estimated_time / 60) * 100}%`,
                      background: route.traffic_level === 'Low' 
                        ? 'var(--primary-green)' 
                        : route.traffic_level === 'Medium' 
                        ? 'var(--primary-yellow)' 
                        : 'var(--primary-red)'
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <button className="glass-button route-select-btn">
              <span>SELECT</span>
              <span>→</span>
            </button>
          </div>
        ))}
      </div>

      <div className="recommendations-section">
        <div className="section-header">
          <span className="section-icon">💡</span>
          <h3 className="section-title">Recommendations</h3>
        </div>
        <div className="recommendations-list">
          {recommendations.map((rec, index) => (
            <div key={index} className="recommendation-item">
              <span className="rec-check">✓</span>
              <span className="rec-text">{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AlternateRoutes
