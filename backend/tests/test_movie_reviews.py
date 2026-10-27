"""Focused regression tests for review persistence in the personal movie state."""
import unittest

from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

from app.database import Base
from app.models.user import User
from app.models.user_movie import UserMovie
from app.schemas.user_movies import MovieStateUpdate
from app.services.user_movies import get_movie_state, update_movie_state


class MovieReviewStateTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(self.engine)
        self.db = Session(self.engine)
        self.user = User(
            username="reviewtester",
            email="reviewtester@example.com",
            password_hash="test-hash",
        )
        self.db.add(self.user)
        self.db.commit()
        self.db.refresh(self.user)

    def tearDown(self):
        self.db.close()
        self.engine.dispose()

    def test_review_alone_creates_persistent_movie_state(self):
        review_text = MovieStateUpdate(
            review_text="  A thoughtful, memorable film.  "
        ).review_text
        result = update_movie_state(
            self.db,
            self.user.id,
            "550",
            {"review_text": review_text},
        )
        self.assertEqual(result.review_text, "A thoughtful, memorable film.")
        stored = self.db.scalar(
            select(UserMovie).where(
                UserMovie.user_id == self.user.id,
                UserMovie.tmdb_id == "550",
            )
        )
        self.assertIsNotNone(stored)

    def test_clearing_only_review_removes_empty_state_row(self):
        update_movie_state(
            self.db, self.user.id, "550", {"review_text": "A review"}
        )
        result = update_movie_state(
            self.db, self.user.id, "550", {"review_text": None}
        )
        self.assertIsNone(get_movie_state(self.db, self.user.id, "550"))
        self.assertIsNone(result["review_text"])

    def test_review_is_preserved_when_other_state_changes(self):
        update_movie_state(
            self.db, self.user.id, "550", {"review_text": "A review"}
        )
        result = update_movie_state(
            self.db, self.user.id, "550", {"favorite": True}
        )
        self.assertTrue(result.favorite)
        self.assertEqual(result.review_text, "A review")

    def test_blank_review_normalizes_to_none_and_length_is_limited(self):
        self.assertIsNone(MovieStateUpdate(review_text="   ").review_text)
        with self.assertRaises(ValueError):
            MovieStateUpdate(review_text="x" * 5001)


if __name__ == "__main__":
    unittest.main()
