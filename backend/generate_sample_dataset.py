"""
Sample Dataset Generator for SmartRoute AI
Generates synthetic training data matching real API response format
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json

def generate_sample_dataset(n_samples=10000, output_format='csv'):
    """
    Generate synthetic training dataset
    
    Args:
        n_samples: Number of samples to generate
        output_format: 'csv', 'json', or 'both'
    
    Returns:
        DataFrame with generated samples
    """
    
    np.random.seed(42)
    print(f"Generating {n_samples} samples...")
    
    # Bangalore key locations with names
    locations = [
        (12.9716, 77.5946, "MG Road"),
        (12.9789, 77.5996, "Chinnaswamy Stadium"),
        (12.9698, 77.7499, "Whitefield"),
        (12.8456, 77.6603, "Electronic City"),
        (13.0358, 77.6208, "Manyata Tech Park"),
        (12.9716, 77.6040, "Brigade Road"),
        (12.9952, 77.6969, "Phoenix Marketcity"),
        (13.0102, 77.5525, "Orion Mall"),
        (12.9767, 77.5713, "City Railway Station"),
        (13.1986, 77.7066, "Airport Road"),
    ]
    
    data = []
    start_date = datetime(2026, 1, 1)
    
    for i in range(n_samples):
        # Random timestamp (4 months of data)
        timestamp = start_date + timedelta(minutes=np.random.randint(0, 60*24*120))
        hour = timestamp.hour
        day_of_week = timestamp.weekday()  # 0=Monday, 6=Sunday
        
        # Random location
        lat, lon, location_name = locations[np.random.randint(0, len(locations))]
        # Add small random offset (±100 meters)
        lat += np.random.uniform(-0.001, 0.001)
        lon += np.random.uniform(-0.001, 0.001)
        
        # Determine scenario based on time and random factors
        is_rush_hour = (6 <= hour <= 10) or (16 <= hour <= 20)
        is_weekend = day_of_week >= 5
        
        # Random events (with realistic probabilities)
        has_accident = np.random.random() < 0.08  # 8% chance
        has_event = np.random.random() < 0.15  # 15% chance
        has_rain = np.random.random() < 0.12  # 12% chance (Bangalore climate)
        has_construction = np.random.random() < 0.10  # 10% chance
        
        # Generate traffic speed based on scenario
        if has_accident:
            # Accident: Very slow traffic
            current_speed = np.random.uniform(3, 12)
            free_flow_speed = np.random.uniform(50, 65)
            cause = 2  # Accident
            
        elif has_event:
            # Event: Slow to moderate traffic
            current_speed = np.random.uniform(8, 22)
            free_flow_speed = np.random.uniform(45, 60)
            cause = 3  # Event
            
        elif has_rain:
            # Rain: Moderate traffic
            current_speed = np.random.uniform(18, 38)
            free_flow_speed = np.random.uniform(50, 70)
            cause = 4  # Weather
            
        elif has_construction:
            # Construction: Slow traffic
            current_speed = np.random.uniform(12, 28)
            free_flow_speed = np.random.uniform(45, 60)
            cause = 1  # Construction
            
        elif is_rush_hour and not is_weekend:
            # Rush hour: Slow to moderate traffic
            current_speed = np.random.uniform(8, 28)
            free_flow_speed = np.random.uniform(50, 70)
            cause = 0  # Rush hour
            
        else:
            # Normal conditions: Moderate to fast traffic
            current_speed = np.random.uniform(30, 75)
            free_flow_speed = np.random.uniform(50, 80)
            cause = 0 if np.random.random() < 0.7 else 1
        
        # Calculate congestion ratio
        # Formula: (free_flow_speed - current_speed) / 10
        # This gives us a 0-5 scale where higher = more congestion
        congestion_ratio = (free_flow_speed - current_speed) / 10
        congestion_ratio = max(0.0, min(5.0, congestion_ratio))
        
        # Rain amount (if raining)
        if has_rain:
            rain = np.random.uniform(0.5, 25)  # Light to heavy rain
        else:
            rain = 0.0
        
        # Calculate delay based on congestion and cause
        base_delay = congestion_ratio * 10
        
        # Add cause-specific multipliers
        if cause == 2:  # Accident
            delay = base_delay * np.random.uniform(1.5, 2.0)
        elif cause == 3:  # Event
            delay = base_delay * np.random.uniform(1.2, 1.5)
        elif cause == 4:  # Weather
            delay = base_delay * np.random.uniform(1.1, 1.4)
        elif cause == 1:  # Construction
            delay = base_delay * np.random.uniform(1.0, 1.3)
        else:  # Rush hour
            delay = base_delay * np.random.uniform(0.9, 1.2)
        
        # Add some random variation
        delay += np.random.uniform(-3, 5)
        delay = max(0, delay)  # No negative delays
        
        data.append({
            'id': i + 1,
            'latitude': round(lat, 4),
            'longitude': round(lon, 4),
            'location_name': location_name,
            'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'hour': hour,
            'day_of_week': day_of_week,
            'is_weekend': int(is_weekend),
            'current_speed': round(current_speed, 1),
            'free_flow_speed': round(free_flow_speed, 1),
            'congestion_ratio': round(congestion_ratio, 2),
            'rain': round(rain, 1),
            'accident': int(has_accident),
            'event': int(has_event),
            'cause_label': cause,
            'delay_minutes': round(delay, 1)
        })
    
    df = pd.DataFrame(data)
    
    # Save to file(s)
    if output_format in ['csv', 'both']:
        df.to_csv('training_data.csv', index=False)
        print(f"✓ Saved to training_data.csv")
    
    if output_format in ['json', 'both']:
        df.to_json('training_data.json', orient='records', indent=2)
        print(f"✓ Saved to training_data.json")
    
    # Print statistics
    print("\n" + "="*50)
    print("DATASET STATISTICS")
    print("="*50)
    
    print(f"\nTotal samples: {len(df)}")
    
    print("\n--- Speed Statistics ---")
    print(f"Current speed: {df['current_speed'].min():.1f} - {df['current_speed'].max():.1f} km/h")
    print(f"Average speed: {df['current_speed'].mean():.1f} km/h")
    
    print("\n--- Congestion Statistics ---")
    print(f"Congestion ratio: {df['congestion_ratio'].min():.2f} - {df['congestion_ratio'].max():.2f}")
    print(f"Average congestion: {df['congestion_ratio'].mean():.2f}")
    
    print("\n--- Weather Statistics ---")
    print(f"Rain samples: {(df['rain'] > 0).sum()} ({(df['rain'] > 0).sum()/len(df)*100:.1f}%)")
    print(f"Max rain: {df['rain'].max():.1f} mm/h")
    
    print("\n--- Incident Statistics ---")
    print(f"Accidents: {df['accident'].sum()} ({df['accident'].sum()/len(df)*100:.1f}%)")
    print(f"Events: {df['event'].sum()} ({df['event'].sum()/len(df)*100:.1f}%)")
    
    print("\n--- Cause Distribution ---")
    cause_names = {
        0: "Rush Hour",
        1: "Construction",
        2: "Accident",
        3: "Event",
        4: "Weather"
    }
    for cause, count in df['cause_label'].value_counts().sort_index().items():
        print(f"{cause_names[cause]}: {count} ({count/len(df)*100:.1f}%)")
    
    print("\n--- Delay Statistics ---")
    print(f"Delay range: {df['delay_minutes'].min():.1f} - {df['delay_minutes'].max():.1f} minutes")
    print(f"Average delay: {df['delay_minutes'].mean():.1f} minutes")
    
    print("\n--- Temporal Distribution ---")
    print(f"Weekday samples: {(df['is_weekend'] == 0).sum()} ({(df['is_weekend'] == 0).sum()/len(df)*100:.1f}%)")
    print(f"Weekend samples: {(df['is_weekend'] == 1).sum()} ({(df['is_weekend'] == 1).sum()/len(df)*100:.1f}%)")
    
    print("\n--- Location Distribution ---")
    for location, count in df['location_name'].value_counts().head(5).items():
        print(f"{location}: {count} samples")
    
    print("\n" + "="*50)
    
    return df

def generate_small_sample():
    """Generate a small sample for documentation"""
    df = generate_sample_dataset(n_samples=100, output_format='csv')
    
    # Save first 20 rows as example
    df.head(20).to_csv('sample_data_example.csv', index=False)
    print("\n✓ Saved first 20 rows to sample_data_example.csv")
    
    return df

if __name__ == "__main__":
    import sys
    
    # Parse command line arguments
    n_samples = 10000
    output_format = 'both'
    
    if len(sys.argv) > 1:
        try:
            n_samples = int(sys.argv[1])
        except ValueError:
            print("Usage: python generate_sample_dataset.py [n_samples] [format]")
            print("  n_samples: Number of samples to generate (default: 10000)")
            print("  format: 'csv', 'json', or 'both' (default: 'both')")
            sys.exit(1)
    
    if len(sys.argv) > 2:
        output_format = sys.argv[2]
        if output_format not in ['csv', 'json', 'both']:
            print("Error: format must be 'csv', 'json', or 'both'")
            sys.exit(1)
    
    # Generate dataset
    df = generate_sample_dataset(n_samples, output_format)
    
    print("\n✅ Dataset generation complete!")
    print("\nNext steps:")
    print("1. Review the generated data in training_data.csv")
    print("2. Validate data quality")
    print("3. Use for model training: python ml/train_tabnet.py")
