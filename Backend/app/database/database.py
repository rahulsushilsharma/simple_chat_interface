from sqlalchemy import create_engine
from utils.config_vars import DATABASE_URL
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import logging


db_engine = create_engine(
    DATABASE_URL, echo=True, connect_args={"check_same_thread": False}
)


Session = sessionmaker(autoflush=False, bind=db_engine)


Base = declarative_base()


def get_db():
    db = Session()
    try:
        yield db
    except Exception as e:
        logging.error(f"Error getting db session : {e}")
        raise e
    finally:
        db.close()
