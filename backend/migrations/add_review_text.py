"""Add the optional review_text column to an existing SQLite database.

Run from the backend directory with the backend virtual environment active:
    python -m migrations.add_review_text

New databases get the column automatically from SQLAlchemy metadata. This script
is only needed when upgrading a database that already has the user_movies table.
"""
from sqlalchemy import inspect, text

from app.database import engine


def migrate() -> None:
    inspector = inspect(engine)
    table_names = set(inspector.get_table_names())

    if "user_movies" not in table_names:
        print("No user_movies table found; nothing to migrate yet.")
        return

    columns = {column["name"] for column in inspector.get_columns("user_movies")}
    if "review_text" in columns:
        print("Column user_movies.review_text already exists; nothing to do.")
        return

    with engine.begin() as connection:
        connection.execute(
            text("ALTER TABLE user_movies ADD COLUMN review_text TEXT NULL")
        )

    print("Added nullable column user_movies.review_text.")


if __name__ == "__main__":
    migrate()
