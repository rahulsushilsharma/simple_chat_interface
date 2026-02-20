from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    email: str

    class Config:
        from_attributes = True


class UserOut(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True
