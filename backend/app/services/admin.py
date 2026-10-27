
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.admin import AdminUserUpdate


def list_users(db: Session) -> list[User]:
    #Retorna todos os usuários registrados.
    return db.query(User).order_by(User.id.asc()).all()


def get_user(db: Session, user_id: int) -> User | None:
    #Encontre um usuário pelo ID ou retorne None caso ele não exista.
    return db.query(User).filter(User.id == user_id).first()


def update_user(
    db: Session,
    user_id: int,
    user_data: AdminUserUpdate,
) -> User | None:
    #Atualizar os dados da conta de um usuário.
    user = get_user(db, user_id)

    if user is None:
        return None

    """Atualize apenas os campos fornecidos explicitamente na solicitação
    Ignore valores nulos em vez de atribuí-los a colunas obrigatórias"""
    updates = user_data.model_dump(exclude_unset=True, exclude_none=True)

    #Previne a remoção acidental do último superusuário
    if (
        updates.get("is_superuser") is False
        and user.is_superuser
    ):
        superuser_count = (
            db.query(User)
            .filter(User.is_superuser.is_(True))
            .count()
        )

        if superuser_count <= 1:
            raise ValueError("Não pode se rebaixar o último superusuário")

    for field, value in updates.items():
        setattr(user, field, value)

    try:
        db.commit()
        db.refresh(user)
    except IntegrityError as exc:
        db.rollback()
        raise ValueError(
            "Nome de usuário ou email já está sendo utilizado"
        ) from exc

    return user


def delete_user(db: Session, user_id: int) -> bool:
    #Deleta usuário. Retorna falso se o usuário não existe
    user = get_user(db, user_id)

    if user is None:
        return False

    #Previne de deletar o último superusuário
    if user.is_superuser:
        superuser_count = (
            db.query(User)
            .filter(User.is_superuser.is_(True))
            .count()
        )

        if superuser_count <= 1:
            raise ValueError("Não pode se deletar o último superusuário")

    try:
        db.delete(user)
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise ValueError("Não pode se deletawr esse usuário") from exc

    return True
