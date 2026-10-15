from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.auth import get_current_user
from app.database import get_db
from app.schemas.user_movies import (
    MovieStateResponse,
    MovieStateUpdate,
)
from app.services.user_movies import (
    delete_movie_state,
    get_all_movie_states,
    get_movie_state,
    update_movie_state,
)


router = APIRouter(
    prefix="/api/my-movies",
    tags=["my-movies"],
)


@router.get(
    "/",
    response_model=list[MovieStateResponse],
)
def get_my_movies(
    current_user: Annotated[object, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    return get_all_movie_states(
        db,
        current_user.id,
    )


@router.get(
    "/{tmdb_id}",
    response_model=MovieStateResponse,
)
def get_my_movie_state(
    tmdb_id: str,
    current_user: Annotated[object, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    movie_state = get_movie_state(
        db,
        current_user.id,
        tmdb_id,
    )

    if movie_state is None:
        return {
            "tmdb_id": tmdb_id,
            "favorite": False,
            "watched": False,
            "rating": None,
        }

    return movie_state


@router.patch(
    "/{tmdb_id}",
    response_model=MovieStateResponse,
)
def update_my_movie_state(
    tmdb_id: str,
    update: MovieStateUpdate,
    current_user: Annotated[object, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    if not update.model_fields_set:
        raise HTTPException(
            status_code=400,
            detail="Nenhum campo foi fornecido",
        )

    updates = {
        field: getattr(update, field)
        for field in update.model_fields_set
    }

    return update_movie_state(
        db,
        current_user.id,
        tmdb_id,
        updates,
    )


@router.delete(
    "/{tmdb_id}",
)
def delete_my_movie_state(
    tmdb_id: str,
    current_user: Annotated[object, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    deleted = delete_movie_state(
        db,
        current_user.id,
        tmdb_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Estado do filme não encontrado",
        )

    return {
        "status": "ok",
    }