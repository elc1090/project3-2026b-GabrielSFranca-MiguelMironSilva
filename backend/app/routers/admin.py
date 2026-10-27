
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import require_superuser
from app.database import get_db
from app.models.user import User
from app.schemas.admin import AdminUserResponse, AdminUserUpdate
from app.services import admin as admin_service

router = APIRouter(
    prefix="/api/admin",
    tags=["admin"],
)


@router.get("/users", response_model=list[AdminUserResponse])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_superuser),
):
    #Lista todos usuários registrados
    return admin_service.list_users(db)


@router.get(
    "/users/{user_id}",
    response_model=AdminUserResponse,
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_superuser),
):
    #Pega detalhes da conta do usuário
    user = admin_service.get_user(db, user_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado",
        )

    return user


@router.patch(
    "/users/{user_id}",
    response_model=AdminUserResponse,
)
def update_user(
    user_id: int,
    user_data: AdminUserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_superuser),
):
    """Atualiza detalhes da conta do usuário.
    Previne um administrador de demover a si mesmo."""
    if (
        user_id == current_user.id
        and user_data.is_superuser is False
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Você  não pode demover a própria conta",
        )

    try:
        user = admin_service.update_user(db, user_id, user_data)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado",
        )

    return user


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_superuser),
):
    """Deleta a conta do usuário.
    Previne o administrador de deletar a própria conta"""
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Você não pode deletar a própria conta",
        )

    try:
        deleted = admin_service.delete_user(db, user_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não  encontrado",
        )

    return {"message": "Usuário deletado com sucesso"}
