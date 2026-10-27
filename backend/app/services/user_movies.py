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


def _empty_movie_state(tmdb_id: str) -> dict:
    return {
        "tmdb_id": tmdb_id,
        "favorite": False,
        "watched": False,
        "rating": None,
        "review_text": None,
    }


def _has_personal_state(movie_state: UserMovie) -> bool:
    #Uma resenha é motivo suficiente para manter a linha de filme do usuário.
    return (
        movie_state.favorite
        or movie_state.watched
        or movie_state.rating is not None
        or movie_state.review_text is not None
    )


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
            review_text=updates.get("review_text"),
        )

        #Não se cria uma linha sem dados pessoais. Uma avaliação já conta.
        if not _has_personal_state(movie_state):
            return _empty_movie_state(tmdb_id)

        db.add(movie_state)

    else:
        for field, value in updates.items():
            setattr(movie_state, field, value)

        #Remove-se a linha apenas quando os campos de favorito, assistido, avaliação e resenha estiverem vazios.
        if not _has_personal_state(movie_state):
            db.delete(movie_state)
            db.commit()
            return _empty_movie_state(tmdb_id)

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


def delete_user_review(
    db: Session,
    user_id: int,
    tmdb_id: str,
):
    movie_state = get_movie_state(
        db,
        user_id,
        tmdb_id,
    )

    if movie_state is None or movie_state.review_text is None:
        return False

    movie_state.review_text = None

    if not _has_personal_state(movie_state):
        db.delete(movie_state)

    db.commit()

    return True

