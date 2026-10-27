12. Ordem recomendada de implementação
Para não misturar os problemas de interface com os de autenticação, desenvolva nesta ordem:
1. Criar o projeto Next.js, configurar o CSS global e implementar o cliente api.ts.
2. Implementar a busca de filmes e confirmar que os resultados do FastAPI aparecem na tela.
3. Implementar a página dinâmica de detalhes e o carregamento do elenco.
4. Implementar login, cadastro e restauração do usuário autenticado.
5. Implementar os controles de favorito, assistido e nota.
6. Implementar a biblioteca, combinando os estados do usuário com os detalhes do TMDB.
7. Testar erros de rede, resultados vazios, sessão expirada e layout em dispositivos móveis.
Execute o backend conforme o README.md do repositório e inicie o Next.js com npm run dev. Com esses componentes, o front-end poderá ser desenvolvido de forma independente, sem duplicar a lógica do TMDB ou a persistência que já pertence ao FastAPI.