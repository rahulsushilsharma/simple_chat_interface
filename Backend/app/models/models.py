from database.database import Base
from sqlalchemy import Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class Users(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)

    sessions = relationship("Session", back_populates="owner")
    file = relationship("File", back_populates="owner")


class Session(Base):
    __tablename__ = "session"

    id = Column(Integer, primary_key=True, index=True)
    session_name = Column(String)
    session_type = Column(String)
    model_name = Column(String)
    temperature = Column(Float)
    file_id = Column(String)
    user_id = Column(Integer, ForeignKey("user.id"))
    owner = relationship("Users", back_populates="sessions")
    history = relationship("ChatHistory", back_populates="owner")
    files = Column(String)


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    message = Column(String)
    message_type = Column(String)

    session_id = Column(Integer, ForeignKey("session.id"))
    owner = relationship("Session", back_populates="history")
    citation = relationship("Citation", back_populates="owner")


class File(Base):
    __tablename__ = "file"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    md5 = Column(String)
    file_name = Column(String)
    file_type = Column(String)
    file_path = Column(String)
    chunking_status = Column(String, nullable=True)
    embedding_status = Column(String, nullable=True)
    owner = relationship("Users", back_populates="file")


class Citation(Base):
    __tablename__ = "citation"

    id = Column(Integer, primary_key=True, index=True)
    citation = Column(String)
    file_name = Column(String)
    file_id = Column(Integer)
    chat_id = Column(Integer, ForeignKey("chat_history.id"))

    owner = relationship("ChatHistory", back_populates="citation")
