from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    email: str


class UserOut(BaseModel):
    name: str
    email: str

    class Config:
        from_attributes = True
