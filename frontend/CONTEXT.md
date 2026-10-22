# 1. Functionality / Objective

Front-end for a movie web application that uses a FastAPI API based on data from the TMDB API.

# 2. Technologies

Use the following technologies:

1. **Programming language:** TypeScript
2. **Framework:** Next.js 16
3. **Runtime:** Node.js
4. **Styling:** CSS Modules (No Tailwind CSS).

# 3. Implementation Guidelines

1. Adopt simple and secure solutions, avoiding unnecessary complexity.
2. Handle errors and validate input data when necessary.
3. Consider security, performance, and relevant edge cases for the project.
4. Follow the existing project structure and conventions whenever they are provided.
5. Do not introduce additional libraries or technologies unless they are necessary for the requested implementation.

# 4. Response Format

1. Provide the folder and file structure when applicable.
2. Provide the complete code for each file created or modified, including its respective file path.
3. Provide configuration, execution, and testing instructions when applicable.
4. Clearly indicate which files were created or modified.

# 5. Missing Information

If essential information is missing to implement the solution correctly, ask concise and specific questions before proceeding.

Do not make assumptions about essential requirements, existing files, APIs, libraries, or project configurations.

# 6. Explanation

Explain in detail what was implemented, including relevant technical decisions and how the implementation works.

# 7. Language Requirement

Write the response in **Brazilian Portuguese (pt-BR)**, including explanations, comments, and instructions.

==========================================


A Lucide casa com o minimalismo pelo traço fino e pelo catálogo de ícones de uso geral. Conferi no pacote que existem Star, Trash2, Plus, Search, Pencil, User, ArrowLeft, Check e Film, que cobrem as telas do MVP. Instalação: npm install lucide-react. Exemplo de uso, com a acessibilidade necessária:

tsx
import { Trash2 } from "lucide-react";

<button type="button" aria-label="Remover filme">
  <Trash2 size={18} aria-hidden="true" />
</button>

Ícone decorativo leva aria-hidden="true". Botão que tem só ícone precisa de aria-label, senão leitores de tela não sabem o que ele faz.

