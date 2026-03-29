from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

engine = create_engine(
    "sqlite:///./rag_database.db", echo=True, connect_args={"check_same_thread": False}
)

Session = sessionmaker(autoflush=False, bind=engine)

Base = declarative_base()


async def get_db():
    db = Session()
    try:
        yield db
    except Exception as e:
        logger.error(f"Error creating db session: {str(e)}")
        raise e
    finally:
        db.close()
