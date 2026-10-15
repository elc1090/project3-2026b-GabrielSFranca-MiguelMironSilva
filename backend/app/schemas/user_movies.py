from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class MovieStateUpdate(BaseModel):
    favorite: Optional[bool] = None
    watched: Optional[bool] = None
    rating: Optional[int] = Field(
        default=None,
        ge=0,
        le=10,
    )


class MovieStateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    tmdb_id: str
    favorite: bool
    watched: bool
    rating: Optional[int] = None