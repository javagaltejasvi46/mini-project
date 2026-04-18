from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager
from typing import Generator
from config import settings
from models import Base

class DatabaseManager:
    def __init__(self, database_url: str):
        self.engine = create_engine(
            database_url,
            pool_size=10,
            max_overflow=20,
            pool_pre_ping=True,
            pool_recycle=3600
        )
        self.SessionLocal = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=self.engine
        )
    
    def create_tables(self):
        Base.metadata.create_all(bind=self.engine)
    
    @contextmanager
    def get_session(self) -> Generator[Session, None, None]:
        session = self.SessionLocal()
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()

# Global database manager instance
db_manager = DatabaseManager(settings.DATABASE_URL)

# Dependency injection for FastAPI
def get_db() -> Generator[Session, None, None]:
    db = db_manager.SessionLocal()
    try:
        yield db
    finally:
        db.close()
