import requests
from app.config import settings


TMDB_BASE_URL = "https://api.themoviedb.org/3"


def search_movies(query: str) -> dict:
    response = requests.get(
        f"{TMDB_BASE_URL}/search/movie",
        params={
            "query": query,
        },
        headers={
            "Authorization": f"Bearer {settings.tmdb_api_key}",
            "accept": "application/json",
        },
        timeout=10,
    )

    response.raise_for_status()
    return response.json()

def get_movie(movie_id: int) -> dict:
    response = requests.get(
        f"{TMDB_BASE_URL}/movie/{movie_id}",
        params={
        "language": "en-US"
        },
        headers={
            "Authorization": f"Bearer {settings.tmdb_api_key}",
            "accept": "application/json",
        },
        timeout=10,
    )

    response.raise_for_status()
    return response.json()

def get_movie_credits(movie_id: int) -> dict:
    response = requests.get(
        f"{TMDB_BASE_URL}/movie/{movie_id}/credits",
        params={
            "language": "en-US",
        },
        headers={
            "Authorization": f"Bearer {settings.tmdb_api_key}",
            "accept": "application/json",
        },
        timeout=10,
    )

    response.raise_for_status()
    return response.json()