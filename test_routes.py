"""
Quick test script for the routes endpoint
"""
import requests
import json

# Test coordinates in Bangalore
start_lat = 12.9716  # MG Road area
start_lon = 77.5946
end_lat = 12.9352    # Koramangala area
end_lon = 77.6245

print("Testing Routes API...")
print(f"Start: ({start_lat}, {start_lon})")
print(f"End: ({end_lat}, {end_lon})")
print()

try:
    response = requests.post(
        'http://localhost:8000/routes/find',
        json={
            'start_lat': start_lat,
            'start_lon': start_lon,
            'end_lat': end_lat,
            'end_lon': end_lon
        },
        timeout=30
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Success! Found {data['total_routes']} routes")
        print()
        
        for i, route in enumerate(data['routes'], 1):
            print(f"Route {i} ({route['route_type']}):")
            print(f"  Distance: {route['distance']:.2f} km")
            print(f"  Est. Time: {route['estimated_time']:.0f} min")
            print(f"  Traffic Level: {route['traffic_level']}%")
            print(f"  Predicted Delay: {route['predicted_delay']:.1f} min")
            print(f"  Total Time: {route['estimated_time'] + route['predicted_delay']:.0f} min")
            print()
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
        
except requests.exceptions.ConnectionError:
    print("❌ Could not connect to backend. Make sure it's running on http://localhost:8000")
except Exception as e:
    print(f"❌ Error: {e}")
