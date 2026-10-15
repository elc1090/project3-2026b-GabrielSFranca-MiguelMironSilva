from fastapi import APIRouter, HTTPException
from app.services.tmdb import get_movie, search_movies, get_movie_credits


router = APIRouter(prefix="/api/movies", tags=["movies"])


@router.get("/search")
def search(query: str):
    if not query.strip():
        raise HTTPException(
            status_code=400,
            detail="Search query cannot be empty",
        )

    try:
        return search_movies(query)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"TMDB error: {exc}",
        ) from exc

@router.get("/{tmdb_id}")
def movie_details(tmdb_id: int):
    try:
        return get_movie(tmdb_id)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"TMDB error: {exc}",
        ) from exc

@router.get("/{tmdb_id}/credits")
def movie_credits(tmdb_id: int):
    try:
        return get_movie_credits(tmdb_id)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"TMDB error: {exc}",
        ) from exc