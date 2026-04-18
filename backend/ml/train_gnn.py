"""
GNN Training Script for SmartRoute AI
Trains Graph Neural Network for spatial traffic prediction
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TrafficGNN(nn.Module):
    """Graph Attention Network for traffic prediction"""
    
    def __init__(self, num_node_features, hidden_channels=64):
        super(TrafficGNN, self).__init__()
        
        try:
            from torch_geometric.nn import GATConv
        except ImportError:
            logger.error("torch-geometric not installed. Run: pip install torch-geometric")
            raise
        
        # Graph Attention Network layers
        self.conv1 = GATConv(num_node_features, hidden_channels, heads=4)
        self.conv2 = GATConv(hidden_channels * 4, hidden_channels, heads=4)
        self.conv3 = GATConv(hidden_channels * 4, hidden_channels, heads=1)
        
        # Output layer
        self.lin = nn.Linear(hidden_channels, 1)
        
        self.dropout = nn.Dropout(0.3)
    
    def forward(self, x, edge_index):
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
        x = torch.sigmoid(x)
        
        return x.squeeze()

def prepare_graph_data(lat, lon, radius_m=5000):
    """Prepare graph data from road network"""
    
    try:
        from torch_geometric.data import Data
        from clients.osmnx_client import OSMnxClient
    except ImportError as e:
        logger.error(f"Required library not installed: {e}")
        raise
    
    logger.info(f"Fetching road network for ({lat}, {lon})...")
    
    # Get road network
    G = OSMnxClient.get_road_network(lat, lon, radius_m)
    
    logger.info(f"Network: {len(G.nodes())} nodes, {len(G.edges())} edges")
    
    # Create node mapping
    node_mapping = {node: idx for idx, node in enumerate(G.nodes())}
    
    # Prepare edge index
    edge_index = []
    for u, v in G.edges():
        edge_index.append([node_mapping[u], node_mapping[v]])
        edge_index.append([node_mapping[v], node_mapping[u]])  # Bidirectional
    
    edge_index = torch.tensor(edge_index, dtype=torch.long).t().contiguous()
    
    # Prepare node features (placeholder - replace with actual features)
    node_features = []
    for node in G.nodes():
        # Feature vector (customize based on available data)
        features = [
            np.random.rand(),  # Current traffic level (placeholder)
            np.random.rand(),  # Historical average (placeholder)
            np.random.rand(),  # Time of day encoded (placeholder)
        ]
        node_features.append(features)
    
    x = torch.tensor(node_features, dtype=torch.float)
    
    # Prepare labels (placeholder - replace with actual traffic levels)
    y = torch.rand(len(G.nodes()))
    
    # Create PyTorch Geometric Data object
    data = Data(x=x, edge_index=edge_index, y=y)
    
    return data, G, node_mapping

def train_gnn_model():
    """Train GNN model"""
    
    logger.info("=" * 50)
    logger.info("GNN Training")
    logger.info("=" * 50)
    
    # Check for GPU
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    logger.info(f"Using device: {device}")
    
    # Prepare data (using Bangalore coordinates)
    logger.info("Preparing training data...")
    train_data, _, _ = prepare_graph_data(12.97, 77.59, radius_m=5000)
    
    logger.info("Preparing validation data...")
    val_data, _, _ = prepare_graph_data(12.93, 77.62, radius_m=5000)
    
    # Move data to device
    train_data = train_data.to(device)
    val_data = val_data.to(device)
    
    # Initialize model
    num_features = train_data.x.shape[1]
    model = TrafficGNN(num_features).to(device)
    
    logger.info(f"Model parameters: {sum(p.numel() for p in model.parameters())}")
    
    # Training setup
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    criterion = nn.MSELoss()
    
    # Training loop
    best_val_loss = float('inf')
    patience = 10
    patience_counter = 0
    epochs = 100
    
    logger.info("=" * 50)
    logger.info("Starting training...")
    logger.info("=" * 50)
    
    for epoch in range(epochs):
        # Train
        model.train()
        optimizer.zero_grad()
        
        out = model(train_data.x, train_data.edge_index)
        loss = criterion(out, train_data.y)
        
        loss.backward()
        optimizer.step()
        
        # Validate
        model.eval()
        with torch.no_grad():
            val_out = model(val_data.x, val_data.edge_index)
            val_loss = criterion(val_out, val_data.y)
            val_mae = torch.mean(torch.abs(val_out - val_data.y))
        
        logger.info(f'Epoch {epoch+1}/{epochs} | '
                   f'Train Loss: {loss.item():.4f} | '
                   f'Val Loss: {val_loss.item():.4f} | '
                   f'Val MAE: {val_mae.item():.4f}')
        
        # Early stopping
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            patience_counter = 0
            
            # Save best model
            os.makedirs('models', exist_ok=True)
            torch.save(model.state_dict(), 'models/gnn_model.pth')
            logger.info(f'✓ New best model saved (Val Loss: {val_loss.item():.4f})')
        else:
            patience_counter += 1
        
        if patience_counter >= patience:
            logger.info(f'Early stopping at epoch {epoch+1}')
            break
    
    logger.info("=" * 50)
    logger.info("✓ GNN training complete!")
    logger.info(f"Best validation loss: {best_val_loss:.4f}")
    logger.info("Model saved to models/gnn_model.pth")
    logger.info("=" * 50)
    
    return True

if __name__ == "__main__":
    import sys
    try:
        success = train_gnn_model()
        sys.exit(0 if success else 1)
    except Exception as e:
        logger.error(f"Training failed: {e}")
        sys.exit(1)
