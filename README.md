# FilmsBR

Aplicação web para pesquisar filmes e manter uma biblioteca pessoal. Com uma conta, a pessoa pode marcar filmes como favoritos ou assistidos e registrar uma avaliação. As informações de catálogo vêm da API do The Movie Database (TMDB).

## Acesso

Aplicação publicada: [https://effervescent-cranachan-cb04c0.netlify.app](https://effervescent-cranachan-cb04c0.netlify.app)

## Desenvolvedores

- **Gabriel da Silva França** — estudante da disciplina de Desenvolvimento de Software para a Web.
- **Miguel Miron Silva** — estudante da disciplina de Desenvolvimento de Software para a Web.

## Proposta

Desenvolver uma aplicação web com cadastro e autenticação de usuários, integrando frontend, backend e persistência de dados. O projeto aplica essa proposta a um catálogo de filmes: visitantes podem pesquisar títulos e consultar detalhes; usuários autenticados podem manter estados pessoais dos filmes em uma biblioteca.

## Funcionalidades

- Pesquisa de filmes e consulta de detalhes e créditos pelo TMDB.
- Cadastro de usuário e login com nome de usuário ou e-mail.
- Biblioteca vinculada à conta, com estados de favorito, assistido e nota pessoal.
- Persistência local em SQLite.
- Interface responsiva em português.

## Executar localmente

### Requisitos

- Python 3.10 ou superior.
- Node.js compatível com Next.js 16 e pnpm.
- Chave de API do TMDB.

### Backend

No diretório `backend`, crie um arquivo `.env` com as configurações abaixo. Use uma chave JWT longa e aleatória; não compartilhe nem versione esse arquivo.

```env
TMDB_API_KEY=sua_chave_do_tmdb
JWT_SECRET_KEY=uma_chave_secreta_longa_e_aleatoria
```

Instale as dependências e inicie a API:

```bash
cd backend
python -m venv .venv
```

Ative o ambiente virtual (Windows: `.venv\Scripts\Activate.ps1`; macOS/Linux: `source .venv/bin/activate`) e rode:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

A API ficará em `http://127.0.0.1:8000`. A documentação interativa está disponível em `http://127.0.0.1:8000/docs`. O banco `webapp_filmes.db` é criado no diretório de execução do backend.

### Frontend

Em outro terminal, configure e inicie a aplicação:

```bash
cd frontend
pnpm install
pnpm dev
```

Acesse `http://localhost:3000`. O cliente da API usa `http://127.0.0.1:8000/api` por padrão. Para outro ambiente, defina `NEXT_PUBLIC_API_BASE_URL` antes de iniciar o frontend (por exemplo, `http://127.0.0.1:8000/api`).

## API

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `GET` | `/api/movies/search?query=...` | Público | Pesquisa filmes no TMDB. |
| `GET` | `/api/movies/{tmdb_id}` | Público | Consulta detalhes de um filme. |
| `GET` | `/api/movies/{tmdb_id}/credits` | Público | Consulta créditos do filme. |
| `POST` | `/api/auth/register` | Público | Cria uma conta. |
| `POST` | `/api/auth/login` | Público | Autentica e retorna um token Bearer. |
| `GET` | `/api/auth/me` | Autenticado | Retorna os dados da conta atual. |
| `GET` | `/api/my-movies/` | Autenticado | Lista estados de filmes da conta. |
| `GET` | `/api/my-movies/{tmdb_id}` | Autenticado | Consulta o estado de um filme. |
| `PATCH` | `/api/my-movies/{tmdb_id}` | Autenticado | Atualiza favorito, assistido ou nota. |
| `DELETE` | `/api/my-movies/{tmdb_id}` | Autenticado | Remove o estado do filme. |

## Desenvolvimento

### Processo

O histórico do repositório registra contribuições de Gabriel da Silva França e Miguel Miron Silva. A implementação está organizada em duas partes: o frontend concentra as telas e a comunicação com a API; o backend reúne autenticação, acesso ao banco e integração com o TMDB. O fluxo principal conecta pesquisa e detalhes de filmes à biblioteca associada à conta.

Uma decisão importante foi manter os dados de catálogo no TMDB e persistir no SQLite apenas a relação do usuário com o filme. Assim, cada estado de favorito, visualização ou avaliação fica associado à conta e ao identificador do filme no catálogo. A autenticação usa senha armazenada como hash e token com prazo de expiração. Para desenvolvimento local, a configuração do frontend e a lista de origens CORS do backend permitem executar os dois serviços separadamente.

A implementação do superusuário consistiu na simples adição de uma nova classe admin em serviços, routers e schemas para o backend, com as conexões apropriadas sendo feitas com o main.py. A implementação do sistema de avaliações/resenhas também foi similar, consistindo em modificações aos arquivos user_movies.py e a adição de novas colunas na base de dados.

### Trechos de código para destaque

1. **Hash e verificação de senha** — `backend/app/services/auth.py`: `PasswordHash.recommended()` cria o hash no cadastro, e `password_hash.verify(...)` valida a senha no login sem armazená-la em texto puro.
2. **Token de acesso** — `backend/app/services/auth.py`: `create_access_token` assina um JWT com identificador do usuário (`sub`) e expiração; `backend/app/auth.py` protege as rotas que exigem login.
3. **Atualização parcial da biblioteca** — `backend/app/routes/user_movies.py`: a rota `PATCH` considera apenas os campos enviados (`model_fields_set`), permitindo alterar um estado sem sobrescrever os demais.
4. **Integração com o catálogo** — `backend/app/services/tmdb.py`: as chamadas à API externa usam o token configurado no ambiente, verificam erros HTTP e têm timeout.

## Tecnologias

### Linguagens e ferramentas

- **TypeScript, React 19 e Next.js 16** no frontend, com CSS Modules.
- **Python e FastAPI** no backend, com endpoints REST e documentação OpenAPI.
- **SQLAlchemy e SQLite** para modelos e persistência.
- **Pydantic Settings** para carregar configurações do ambiente.
- **PyJWT** para tokens, **pwdlib/Argon2** para hash de senha e **Requests** para chamadas ao TMDB.
- **Lucide React** para ícones da interface.
- **pnpm** para dependências do frontend e **pip** para dependências do backend.

### Autenticação e autorização

O cadastro recebe nome de usuário, e-mail e senha. O backend armazena o hash da senha e rejeita duplicatas de usuário ou e-mail. O login aceita usuário ou e-mail e retorna um JWT Bearer com validade de 30 minutos. O frontend envia o token nas requisições protegidas; o backend identifica a conta pelo token e limita as operações da biblioteca aos dados daquele usuário.

### Ambiente de desenvolvimento

- Editor de código e terminal com suporte a Python e Node.js.
- Python com ambiente virtual, FastAPI e Uvicorn para executar a API.
- Node.js e pnpm para executar o Next.js.
- Navegador para acessar a aplicação e a documentação interativa da API.
- Variáveis locais em `backend/.env` para credenciais e segredo JWT; esse arquivo não deve ser enviado ao repositório.

## Referências e créditos

- [The Movie Database (TMDB) API](https://developer.themoviedb.org/docs) — busca, dados e créditos de filmes. Os dados e imagens pertencem ao TMDB e são fornecidos conforme os termos da plataforma.
- [Documentação do Next.js](https://nextjs.org/docs) — framework do frontend.
- [Documentação do FastAPI](https://fastapi.tiangolo.com/) — framework da API.
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/) — persistência relacional.
- [Lucide](https://lucide.dev/) — biblioteca de ícones.
- [Disciplina Desenvolvimento de Software para a Web](https://github.com/andreainfufsm/elc1090-2026b) — contexto acadêmico do projeto.

---

Projeto desenvolvido para a disciplina de [Desenvolvimento de Software para a Web](https://github.com/andreainfufsm/elc1090-2026b), em 2026b.
