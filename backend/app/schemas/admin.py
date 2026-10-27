from pydantic import BaseModel, ConfigDict, EmailStr, Field


class AdminUserResponse(BaseModel):
    #Informações de usuário retornadas por endpoints administrativos.

    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: EmailStr
    is_superuser: bool


class AdminUserUpdate(BaseModel):
    #Campos que um administrador pode atualizar na conta de outro usuário.

    username: str | None = Field(default=None, min_length=3, max_length=30)
    email: EmailStr | None = None
    is_superuser: bool | None = None
