from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class MovieStateUpdate(BaseModel):
    favorite: Optional[bool] = None
    watched: Optional[bool] = None
    rating: Optional[int] = Field(
        default=None,
        ge=0,
        le=10,
    )
    review_text: Optional[str] = Field(
        default=None,
        max_length=5000,
        description="Texto da avaliação do usuário, com até 5000 caracteres.",
    )

    @field_validator("review_text")
    @classmethod
    def normalize_review_text(cls, value: Optional[str]) -> Optional[str]:
        """Trim whitespace and treat an empty review as a request to clear it."""
        if value is None:
            return None
        normalized = value.strip()
        return normalized or None


class MovieStateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    tmdb_id: str
    favorite: bool
    watched: bool
    rating: Optional[int] = None
    review_text: Optional[str] = None
