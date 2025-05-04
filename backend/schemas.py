from typing import Annotated
from fastapi import Form, UploadFile
from pydantic import BaseModel

class FoodNote(BaseModel):
    name: Annotated[str, Form()]
    type: Annotated[str, Form()]
    fileData: UploadFile

