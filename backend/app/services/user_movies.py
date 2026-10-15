from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.user_movie import UserMovie


def get_movie_state(
    db: Session,
    user_id: int,
    tmdb_id: str,
):
    return db.scalar(
        select(UserMovie).where(
            UserMovie.user_id == user_id,
            UserMovie.tmdb_id == tmdb_id,
        )
    )


def get_all_movie_states(
    db: Session,
    user_id: int,
):
    return db.scalars(
        select(UserMovie).where(
            UserMovie.user_id == user_id,
        )
    ).all()


def update_movie_state(
    db: Session,
    user_id: int,
    tmdb_id: str,
    updates: dict,
):
    movie_state = get_movie_state(
        db,
        user_id,
        tmdb_id,
    )

    if movie_state is None:
        movie_state = UserMovie(
            user_id=user_id,
            tmdb_id=tmdb_id,
            favorite=updates.get("favorite", False),
            watched=updates.get("watched", False),
            rating=updates.get("rating"),
        )

        # Don't create an empty record.
        if (
            not movie_state.favorite
            and not movie_state.watched
            and movie_state.rating is None
        ):
            return {
                "tmdb_id": tmdb_id,
                "favorite": False,
                "watched": False,
                "rating": None,
            }

        db.add(movie_state)

    else:
        for field, value in updates.items():
            setattr(movie_state, field, value)

        # If the user has removed all personal state,
        # remove the database row as well.
        if (
            not movie_state.favorite
            and not movie_state.watched
            and movie_state.rating is None
        ):
            db.delete(movie_state)
            db.commit()

            return {
                "tmdb_id": tmdb_id,
                "favorite": False,
                "watched": False,
                "rating": None,
            }

    db.commit()
    db.refresh(movie_state)

    return movie_state


def delete_movie_state(
    db: Session,
    user_id: int,
    tmdb_id: str,
):
    movie_state = get_movie_state(
        db,
        user_id,
        tmdb_id,
    )

    if movie_state is None:
        return False

    db.delete(movie_state)
    db.commit()

    return True