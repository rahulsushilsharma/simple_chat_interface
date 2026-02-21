import logging

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from utils.config_vars import DATABASE_URL

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
