from database import db_manager
from models import Base
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    logger.info("Creating database tables...")
    db_manager.create_tables()
    logger.info("Database tables created successfully!")
