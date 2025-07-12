from sqlalchemy import String, Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base


class Users(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)

    sessions = relationship("Session", back_populates="owner")


class Session(Base):
    __tablename__ = "session"

    id = Column(Integer, primary_key=True, index=True)
    session_name = Column(String)
    session_type = Column(String)
    model = Column(String)

    user_id = Column(Integer, ForeignKey("user.id"))
    owner = relationship("Users", back_populates="sessions")
    history = relationship("ChatHistory", back_populates="owner")


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    message = Column(String)
    message_type = Column(String)
    model = Column(String)

    session_id = Column(Integer, ForeignKey("session.id"))
    owner = relationship("Session", back_populates="history")
