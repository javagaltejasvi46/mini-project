import './TrafficChart.css'

const TrafficChart = ({ data }) => {
  const maxTraffic = Math.max(...data.map(d => d.traffic_level))
  const maxSpeed = Math.max(...data.map(d => d.speed))

  return (
    <div className="traffic-chart-container glass-card">
      <div className="section-header">
        <span className="section-icon">📊</span>
        <h2 className="section-title">Traffic Trends</h2>
        <div className="chart-legend">
          <span className="glass-badge badge-blue">Traffic</span>
          <span className="glass-badge badge-green">Speed</span>
        </div>
      </div>

      <div className="chart-area">
        {data.map((point, index) => {
          const trafficHeight = (point.traffic_level / maxTraffic) * 100
          const speedHeight = (point.speed / maxSpeed) * 100
          
          return (
            <div key={index} className="chart-bar-group">
              <div className="bar-container">
                <div 
                  className="bar traffic-bar" 
                  style={{ height: `${trafficHeight}%` }}
                  title={`Traffic: ${point.traffic_level}`}
                >
                  <span className="bar-value">{point.traffic_level}</span>
                </div>
                <div 
                  className="bar speed-bar" 
                  style={{ height: `${speedHeight}%` }}
                  title={`Speed: ${point.speed.toFixed(1)} km/h`}
                >
                  <span className="bar-value">{point.speed.toFixed(0)}</span>
                </div>
              </div>
              {index % 4 === 0 && (
                <div className="time-label">{point.time}</div>
              )}
            </div>
          )
        })}
      </div>

      <div className="chart-stats">
        <div className="stat-item">
          <span className="stat-icon">📈</span>
          <div className="stat-content">
            <span className="stat-label">Peak Traffic</span>
            <span className="stat-value">{maxTraffic}</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon">⚡</span>
          <div className="stat-content">
            <span className="stat-label">Max Speed</span>
            <span className="stat-value">{maxSpeed.toFixed(0)} km/h</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon">⏱️</span>
          <div className="stat-content">
            <span className="stat-label">Time Range</span>
            <span className="stat-value">2 Hours</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrafficChart
