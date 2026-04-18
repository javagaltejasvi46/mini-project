# SmartRoute AI - Deep Learning Model Blueprint

## Overview

This blueprint outlines the implementation of TabNet and GNN models for traffic prediction in the SmartRoute AI system.

## Architecture

```
Input Data → Feature Engineering → TabNet (Cause + Delay) → GNN (Spatial) → A* Routing → Output
```

---

## Part 1: TabNet Model (Cause & Delay Prediction)

### Purpose
Predict traffic cause and expected delay based on current conditions.

### Input Features (5 dimensions)
1. `current_speed` (float): Current traffic speed in km/h
2. `congestion_ratio` (float): 0-5 scale (0=free flow, 5=gridlock)
3. `rain` (float): Rainfall in mm/hour
4. `accident` (bool → float): 0 or 1
5. `event` (bool → float): 0 or 1

### Output
1. **Cause Classification** (5 classes):
   - 0: Heavy rush hour traffic
   - 1: Road construction ahead
   - 2: Traffic accident reported
   - 3: Special event in the area
   - 4: Weather conditions affecting traffic

2. **Delay Regression** (float):
   - Expected delay in minutes

### Model Architecture

```python
import torch
import torch.nn as nn
from pytorch_tabnet.tab_model import TabNetClassifier, TabNetRegressor

class TrafficTabNet:
    def __init__(self):
        # Cause classifier
        self.cause_model = TabNetClassifier(
            n_d=8,                    # Width of decision prediction layer
            n_a=8,                    # Width of attention embedding
            n_steps=3,                # Number of steps in architecture
            gamma=1.3,                # Coefficient for feature reusage
            n_independent=2,          # Number of independent GLU layers
            n_shared=2,               # Number of shared GLU layers
            cat_idxs=[],              # No categorical features
            cat_dims=[],
            cat_emb_dim=1,
            lambda_sparse=1e-3,       # Sparsity regularization
            momentum=0.02,
            mask_type='sparsemax'
        )
        
        # Delay regressor
        self.delay_model = TabNetRegressor(
            n_d=8,
            n_a=8,
            n_steps=3,
            gamma=1.3,
            n_independent=2,
            n_shared=2,
            cat_idxs=[],
            cat_dims=[],
            cat_emb_dim=1,
            lambda_sparse=1e-3,
            momentum=0.02,
            mask_type='sparsemax'
        )
    
    def train_cause_classifier(self, X_train, y_train, X_val, y_val):
        self.cause_model.fit(
            X_train, y_train,
            eval_set=[(X_val, y_val)],
            max_epochs=100,
            patience=10,
            batch_size=256,
            virtual_batch_size=128,
            num_workers=0,
            drop_last=False
        )
    
    def train_delay_regressor(self, X_train, y_train, X_val, y_val):
        self.delay_model.fit(
            X_train, y_train,
            eval_set=[(X_val, y_val)],
            max_epochs=100,
            patience=10,
            batch_size=256,
            virtual_batch_size=128,
            num_workers=0,
            drop_last=False
        )
    
    def predict(self, X):
        cause = self.cause_model.predict(X)
        delay = self.delay_model.predict(X)
        return cause, delay
    
    def save_models(self, cause_path, delay_path):
        self.cause_model.save_model(cause_path)
        self.delay_model.save_model(delay_path)
    
    def load_models(self, cause_path, delay_path):
        self.cause_model.load_model(cause_path)
        self.delay_model.load_model(delay_path)
```

### Training Data Requirements

**Minimum Dataset Size**: 10,000 samples
**Recommended**: 50,000+ samples

**Data Collection Strategy**:
1. Historical traffic data from TomTom API
2. Weather data from OpenWeather API
3. Event data from Google Places API
4. Manual labeling of causes (initial dataset)
5. Continuous learning from new data

**Data Format**:
```python
# Training data structure
X_train = np.array([
    [current_speed, congestion_ratio, rain, accident, event],
    # ... more samples
])

y_cause = np.array([0, 1, 2, ...])  # Cause labels
y_delay = np.array([5.2, 12.5, ...])  # Delay in minutes
```

### Training Script

```python
# backend/ml/train_tabnet.py
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import pickle

def prepare_data():
    # Load data from database
    from database import db_manager
    from models import TrafficData
    from sqlalchemy import func
    
    with db_manager.get_session() as session:
        # Query all traffic data
        data = session.query(
            TrafficData.current_speed,
            TrafficData.congestion_ratio,
            TrafficData.rain,
            TrafficData.accident,
            TrafficData.event
        ).all()
    
    # Convert to numpy array
    X = np.array([[d[0], d[1], d[2], float(d[3]), float(d[4])] for d in data])
    
    # Generate labels (you'll need actual labels from your data)
    # For now, using rule-based labels as example
    y_cause = []
    y_delay = []
    
    for row in X:
        speed, congestion, rain, accident, event = row
        
        # Rule-based labeling (replace with actual labels)
        if accident > 0:
            y_cause.append(2)
            y_delay.append(congestion * 15)
        elif event > 0:
            y_cause.append(3)
            y_delay.append(congestion * 10)
        elif rain > 2.0:
            y_cause.append(4)
            y_delay.append(congestion * 8)
        elif congestion > 3.0:
            y_cause.append(0)
            y_delay.append(congestion * 12)
        else:
            y_cause.append(1)
            y_delay.append(congestion * 5)
    
    y_cause = np.array(y_cause)
    y_delay = np.array(y_delay)
    
    return X, y_cause, y_delay

def train_tabnet_models():
    # Prepare data
    X, y_cause, y_delay = prepare_data()
    
    # Split data
    X_train, X_test, y_cause_train, y_cause_test = train_test_split(
        X, y_cause, test_size=0.2, random_state=42
    )
    _, _, y_delay_train, y_delay_test = train_test_split(
        X, y_delay, test_size=0.2, random_state=42
    )
    
    # Further split for validation
    X_train, X_val, y_cause_train, y_cause_val = train_test_split(
        X_train, y_cause_train, test_size=0.2, random_state=42
    )
    _, _, y_delay_train, y_delay_val = train_test_split(
        X_train, y_delay_train, test_size=0.2, random_state=42
    )
    
    # Initialize model
    model = TrafficTabNet()
    
    # Train cause classifier
    print("Training cause classifier...")
    model.train_cause_classifier(X_train, y_cause_train, X_val, y_cause_val)
    
    # Train delay regressor
    print("Training delay regressor...")
    model.train_delay_regressor(X_train, y_delay_train, X_val, y_delay_val)
    
    # Evaluate
    cause_pred = model.cause_model.predict(X_test)
    delay_pred = model.delay_model.predict(X_test)
    
    from sklearn.metrics import accuracy_score, mean_absolute_error
    print(f"Cause Accuracy: {accuracy_score(y_cause_test, cause_pred):.4f}")
    print(f"Delay MAE: {mean_absolute_error(y_delay_test, delay_pred):.4f} minutes")
    
    # Save models
    model.save_models('models/tabnet_cause.pkl', 'models/tabnet_delay.pkl')
    print("Models saved successfully!")

if __name__ == "__main__":
    train_tabnet_models()
```

---

## Part 2: GNN Model (Spatial Traffic Prediction)

### Purpose
Predict traffic levels across the entire road network using graph structure.

### Input
1. **Graph Structure**: Road network from OSMnx
   - Nodes: Intersections
   - Edges: Road segments
   
2. **Node Features** (per intersection):
   - Current traffic level
   - Historical average
   - Time of day (encoded)
   - Day of week (encoded)
   - Weather conditions
   - Nearby events

3. **Edge Features** (per road segment):
   - Road type (highway, arterial, local)
   - Number of lanes
   - Speed limit
   - Length

### Output
Traffic level prediction for each node (0-1 scale)

### Model Architecture

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import GCNConv, GATConv
from torch_geometric.data import Data

class TrafficGNN(nn.Module):
    def __init__(self, num_node_features, hidden_channels=64):
        super(TrafficGNN, self).__init__()
        
        # Graph Attention Network layers
        self.conv1 = GATConv(num_node_features, hidden_channels, heads=4)
        self.conv2 = GATConv(hidden_channels * 4, hidden_channels, heads=4)
        self.conv3 = GATConv(hidden_channels * 4, hidden_channels, heads=1)
        
        # Output layer
        self.lin = nn.Linear(hidden_channels, 1)
        
        self.dropout = nn.Dropout(0.3)
    
    def forward(self, x, edge_index):
        # x: Node features [num_nodes, num_features]
        # edge_index: Graph connectivity [2, num_edges]
        
        # Layer 1
        x = self.conv1(x, edge_index)
        x = F.elu(x)
        x = self.dropout(x)
        
        # Layer 2
        x = self.conv2(x, edge_index)
        x = F.elu(x)
        x = self.dropout(x)
        
        # Layer 3
        x = self.conv3(x, edge_index)
        x = F.elu(x)
        
        # Output
        x = self.lin(x)
        x = torch.sigmoid(x)  # Traffic level between 0 and 1
        
        return x.squeeze()

class TrafficGNNTrainer:
    def __init__(self, model, device='cpu'):
        self.model = model.to(device)
        self.device = device
        self.optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
        self.criterion = nn.MSELoss()
    
    def train_epoch(self, data):
        self.model.train()
        self.optimizer.zero_grad()
        
        out = self.model(data.x, data.edge_index)
        loss = self.criterion(out, data.y)
        
        loss.backward()
        self.optimizer.step()
        
        return loss.item()
    
    def evaluate(self, data):
        self.model.eval()
        with torch.no_grad():
            out = self.model(data.x, data.edge_index)
            loss = self.criterion(out, data.y)
            mae = torch.mean(torch.abs(out - data.y))
        
        return loss.item(), mae.item()
    
    def train(self, train_data, val_data, epochs=100):
        best_val_loss = float('inf')
        patience = 10
        patience_counter = 0
        
        for epoch in range(epochs):
            train_loss = self.train_epoch(train_data)
            val_loss, val_mae = self.evaluate(val_data)
            
            print(f'Epoch {epoch+1}/{epochs}, Train Loss: {train_loss:.4f}, '
                  f'Val Loss: {val_loss:.4f}, Val MAE: {val_mae:.4f}')
            
            if val_loss < best_val_loss:
                best_val_loss = val_loss
                patience_counter = 0
                torch.save(self.model.state_dict(), 'models/gnn_model.pth')
            else:
                patience_counter += 1
            
            if patience_counter >= patience:
                print(f'Early stopping at epoch {epoch+1}')
                break
        
        print('Training complete!')
```

### Data Preparation for GNN

```python
# backend/ml/prepare_gnn_data.py
import torch
import networkx as nx
import numpy as np
from torch_geometric.data import Data
from clients.osmnx_client import OSMnxClient

def prepare_graph_data(lat, lon, radius_m=5000):
    # Get road network
    G = OSMnxClient.get_road_network(lat, lon, radius_m)
    
    # Convert to directed graph if needed
    if not G.is_directed():
        G = G.to_directed()
    
    # Create node mapping
    node_mapping = {node: idx for idx, node in enumerate(G.nodes())}
    
    # Prepare edge index
    edge_index = []
    for u, v in G.edges():
        edge_index.append([node_mapping[u], node_mapping[v]])
    
    edge_index = torch.tensor(edge_index, dtype=torch.long).t().contiguous()
    
    # Prepare node features
    node_features = []
    for node in G.nodes():
        # Extract node data
        node_data = G.nodes[node]
        
        # Feature vector (customize based on available data)
        features = [
            node_data.get('traffic_level', 0.5),  # Current traffic
            node_data.get('historical_avg', 0.5),  # Historical average
            # Add more features as needed
        ]
        node_features.append(features)
    
    x = torch.tensor(node_features, dtype=torch.float)
    
    # Prepare labels (traffic levels)
    # In practice, you'd get these from your database
    y = torch.rand(len(G.nodes()))  # Placeholder
    
    # Create PyTorch Geometric Data object
    data = Data(x=x, edge_index=edge_index, y=y)
    
    return data, G, node_mapping

def train_gnn_model():
    # Prepare data
    train_data, _, _ = prepare_graph_data(12.97, 77.59)
    val_data, _, _ = prepare_graph_data(12.93, 77.62)
    
    # Initialize model
    num_features = train_data.x.shape[1]
    model = TrafficGNN(num_features)
    
    # Train
    trainer = TrafficGNNTrainer(model)
    trainer.train(train_data, val_data, epochs=100)
    
    print("GNN model trained successfully!")

if __name__ == "__main__":
    train_gnn_model()
```

---

## Part 3: Integration with Backend

### Update TabNet Predictor

```python
# backend/ml/tabnet_predictor.py (updated)
import numpy as np
from typing import Tuple
import logging
import pickle

logger = logging.getLogger(__name__)

class TabNetPredictor:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.cause_model = None
        self.delay_model = None
        try:
            self._load_models(model_path)
        except Exception as e:
            logger.warning(f"Could not load TabNet models: {e}. Using fallback predictions.")
    
    def predict_cause_and_delay(self, traffic_features: np.ndarray) -> Tuple[str, float]:
        if self.cause_model is None or self.delay_model is None:
            return self._fallback_prediction(traffic_features)
        
        try:
            cause_code = self.cause_model.predict(traffic_features)[0]
            delay = self.delay_model.predict(traffic_features)[0]
            cause = self._decode_cause(int(cause_code))
            return cause, float(delay)
        except Exception as e:
            logger.error(f"TabNet prediction failed: {e}")
            return self._fallback_prediction(traffic_features)
    
    def _load_models(self, path: str):
        # Load TabNet models
        from pytorch_tabnet.tab_model import TabNetClassifier, TabNetRegressor
        
        self.cause_model = TabNetClassifier()
        self.cause_model.load_model(f"{path}_cause.pkl")
        
        self.delay_model = TabNetRegressor()
        self.delay_model.load_model(f"{path}_delay.pkl")
        
        logger.info("TabNet models loaded successfully")
    
    def _fallback_prediction(self, features: np.ndarray) -> Tuple[str, float]:
        speed = features[0][0]
        congestion = features[0][1]
        rain = features[0][2]
        accident = features[0][3]
        event = features[0][4]
        
        if accident > 0:
            return "Traffic accident reported", congestion * 15
        elif event > 0:
            return "Special event in the area", congestion * 10
        elif rain > 2.0:
            return "Weather conditions affecting traffic", congestion * 8
        elif congestion > 3.0:
            return "Heavy rush hour traffic", congestion * 12
        else:
            return "Road construction ahead", congestion * 5
    
    def _decode_cause(self, cause_code: int) -> str:
        causes = {
            0: "Heavy rush hour traffic",
            1: "Road construction ahead",
            2: "Traffic accident reported",
            3: "Special event in the area",
            4: "Weather conditions affecting traffic"
        }
        return causes.get(cause_code, "Unknown cause")
```

### Update GNN Predictor

```python
# backend/ml/gnn_predictor.py (updated)
import torch
import numpy as np
import networkx as nx
from typing import Dict
import logging

logger = logging.getLogger(__name__)

class GNNPredictor:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        try:
            self._load_model(model_path)
        except Exception as e:
            logger.warning(f"Could not load GNN model: {e}. Using fallback predictions.")
    
    def predict_spatial_traffic(
        self,
        graph: nx.Graph,
        node_features: Dict[int, np.ndarray]
    ) -> Dict[int, float]:
        if self.model is None:
            return self._fallback_predictions(node_features)
        
        try:
            # Prepare data for GNN
            from torch_geometric.data import Data
            
            # Convert node features to tensor
            x = torch.tensor(
                [node_features[node] for node in sorted(node_features.keys())],
                dtype=torch.float
            ).to(self.device)
            
            # Prepare edge index
            edge_index = []
            node_mapping = {node: idx for idx, node in enumerate(sorted(node_features.keys()))}
            
            for u, v in graph.edges():
                if u in node_mapping and v in node_mapping:
                    edge_index.append([node_mapping[u], node_mapping[v]])
            
            edge_index = torch.tensor(edge_index, dtype=torch.long).t().contiguous().to(self.device)
            
            # Predict
            self.model.eval()
            with torch.no_grad():
                predictions = self.model(x, edge_index)
            
            # Convert to dictionary
            result = {}
            for node, idx in node_mapping.items():
                result[node] = float(predictions[idx].cpu().numpy())
            
            return result
            
        except Exception as e:
            logger.error(f"GNN prediction failed: {e}")
            return self._fallback_predictions(node_features)
    
    def _load_model(self, path: str):
        from ml.train_gnn import TrafficGNN
        
        # Initialize model architecture
        num_features = 3  # Adjust based on your features
        self.model = TrafficGNN(num_features).to(self.device)
        
        # Load weights
        self.model.load_state_dict(torch.load(path, map_location=self.device))
        self.model.eval()
        
        logger.info("GNN model loaded successfully")
    
    def _fallback_predictions(self, node_features: Dict[int, np.ndarray]) -> Dict[int, float]:
        return {node: float(np.mean(features)) for node, features in node_features.items()}
```

---

## Part 4: Training Pipeline

### Complete Training Script

```python
# backend/ml/train_models.py
import sys
import logging
from train_tabnet import train_tabnet_models
from train_gnn import train_gnn_model

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    logger.info("Starting model training pipeline...")
    
    # Step 1: Train TabNet models
    logger.info("=" * 50)
    logger.info("Training TabNet models...")
    logger.info("=" * 50)
    try:
        train_tabnet_models()
        logger.info("✓ TabNet training complete")
    except Exception as e:
        logger.error(f"✗ TabNet training failed: {e}")
        return False
    
    # Step 2: Train GNN model
    logger.info("=" * 50)
    logger.info("Training GNN model...")
    logger.info("=" * 50)
    try:
        train_gnn_model()
        logger.info("✓ GNN training complete")
    except Exception as e:
        logger.error(f"✗ GNN training failed: {e}")
        return False
    
    logger.info("=" * 50)
    logger.info("✓ All models trained successfully!")
    logger.info("=" * 50)
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
```

---

## Part 5: Requirements

### Additional Dependencies

```txt
# Add to backend/requirements.txt

# TabNet
pytorch-tabnet==4.1.0

# GNN
torch>=2.0.0
torch-geometric>=2.3.0
torch-scatter>=2.1.0
torch-sparse>=0.6.0

# Additional ML tools
scikit-learn>=1.3.0
matplotlib>=3.7.0
seaborn>=0.12.0
```

---

## Part 6: Data Collection Strategy

### Phase 1: Initial Dataset (Week 1-2)
1. Collect 10,000+ traffic samples from TomTom API
2. Manual labeling of 1,000 samples for causes
3. Use rule-based labels for remaining samples
4. Train initial models

### Phase 2: Active Learning (Week 3-4)
1. Deploy models with confidence thresholds
2. Flag low-confidence predictions for manual review
3. Continuously retrain with new labeled data
4. Improve model accuracy

### Phase 3: Production (Week 5+)
1. Automated retraining pipeline (weekly)
2. A/B testing of model versions
3. Performance monitoring
4. Continuous improvement

---

## Part 7: Evaluation Metrics

### TabNet Metrics
- **Cause Classification**: Accuracy, F1-score, Confusion Matrix
- **Delay Regression**: MAE, RMSE, R²

### GNN Metrics
- **Traffic Prediction**: MAE, RMSE, Spatial Correlation
- **Network Coverage**: Percentage of nodes with accurate predictions

### Target Performance
- Cause Accuracy: > 85%
- Delay MAE: < 5 minutes
- Spatial Traffic MAE: < 0.15 (on 0-1 scale)

---

## Next Steps

1. **Collect Training Data** (2-4 weeks)
   - Run data ingestion scheduler
   - Accumulate 50,000+ samples
   - Manual labeling of key samples

2. **Train Initial Models** (1 week)
   - Run training scripts
   - Evaluate performance
   - Tune hyperparameters

3. **Deploy Models** (1 week)
   - Replace fallback predictions
   - Monitor performance
   - Collect feedback

4. **Iterate and Improve** (Ongoing)
   - Retrain with new data
   - Add new features
   - Optimize architecture

---

## File Structure

```
backend/ml/
├── __init__.py
├── tabnet_predictor.py      # TabNet inference
├── gnn_predictor.py          # GNN inference
├── astar_router.py           # A* routing
├── orchestrator.py           # Pipeline coordinator
├── train_tabnet.py           # TabNet training script
├── train_gnn.py              # GNN training script
├── prepare_gnn_data.py       # GNN data preparation
└── train_models.py           # Complete training pipeline

models/
├── tabnet_cause.pkl          # Trained TabNet cause classifier
├── tabnet_delay.pkl          # Trained TabNet delay regressor
└── gnn_model.pth             # Trained GNN model
```

---

## Summary

This blueprint provides a complete roadmap for implementing TabNet and GNN models in SmartRoute AI. The system is designed to:

1. Start with rule-based fallbacks
2. Gradually transition to ML-based predictions
3. Continuously improve with new data
4. Maintain high accuracy and reliability

The modular design allows you to train and deploy models independently, making it easy to iterate and improve over time.
