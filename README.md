# 🎸 Iron Maiden Explorer

## 📌 Problemática
A discografia de uma banda com décadas de carreira está espalhada em dezenas de álbuns, remasters, lançamentos ao vivo e singles. Ter acesso aos dados brutos de uma API não significa que eles sejam fáceis de consultar — como transformar isso em uma experiência simples, visual e organizada?

---

## 🎯 Objetivo da Aplicação
Permitir que fãs do Iron Maiden explorem a discografia completa da banda de forma clara: navegando álbum por álbum (em ordem cronológica), buscando uma música específica em todo o catálogo, ou salvando faixas favoritas para acesso rápido depois.

---

## 🛠️ Tecnologias Utilizadas
* **React + Vite**
* **Axios** (para consumo de API)
* **CSS3** (um arquivo `.css` por componente, sem estilos inline)
* **localStorage** (para persistir os favoritos no navegador)
* **Node.js v18+** (requisito de ambiente)

---

## 🌐 API Utilizada
Foi utilizada a **iTunes Search API**, consumida de duas formas diferentes:

1. `/search (entity=album)` — Lista os álbuns oficiais da banda, já com ano e número real de faixas.
2. `/lookup (entity=song, por ID do álbum)` — Busca a lista completa de faixas de um álbum específico, quando o usuário clica nele.
3. `/search (entity=song)` — Usada na busca por texto, combinando o termo digitado com "iron maiden".

> **Nota:** Não exige chave de API nem autenticação.

---

## ⚡ Principais Funcionalidades
* **Grade de álbuns:** Apresentados em ordem cronológica, com capa, ano e número de faixas.
* **Página de detalhes do álbum:** Capa grande, nome, ano e lista completa de faixas (buscada sob demanda, só quando o álbum é aberto).
* **Busca por texto em tempo real:** Com *debounce* de 400ms, pesquisando o nome da música em toda a discografia.
* **Favoritos:** Clique no coração `♡` de qualquer música para salvá-la; fica guardado no `localStorage`, permanecendo lá mesmo após fechar o navegador. Um botão dedicado exibe apenas as faixas favoritadas.
* **Faixa de estatísticas:** Exibe total de álbuns, total de faixas, período da discografia e número de favoritos.
* **Tratamento de Dados:** Filtragem aplicada para manter apenas resultados do artista oficial "Iron Maiden" (removendo covers, tributos e artistas não relacionados).

---

## 🔗 Links do Projeto

* **Link da aplicação publicada:** [desafio-02-kodie-academy.vercel.app](https://desafio-02-kodie-academy.vercel.app/)
* **Link do repositório:** [github.com/Elton-N/desafio_02_kodie_academy](https://github.com/Elton-N/desafio_02_kodie_academy)

---

## 🤖 Uso de Inteligência Artificial

Utilizei o Claude (Anthropic) como apoio durante todo o desenvolvimento, revisando e testando cada mudança antes de aceitá-la — inclusive resolvendo sozinho, com orientação, os erros que apareciam no terminal e no navegador.

### Prompts Utilizados & Objetivos

> **Prompt utilizado:** "Me ajude com os códigos do header, main e footer e colocar o que tá faltando?"
* **Objetivo:** Gerar a estrutura inicial dos componentes React (Header, Busca, Main, Footer) e a lógica de consumo da API com Axios/useState/useEffect no App.jsx, para eu poder revisar e ajustar a partir de uma base funcional.

> **Prompt utilizado:** "Eu pensei numa API com os álbuns e músicas do Iron Maiden, com busca, filtro etc. Eu queria todas as músicas e os respectivos álbuns, para o usuário percorrer dentro do álbum e escolher as músicas, ou buscar pelas músicas"
* **Objetivo:** Definir a navegação principal da aplicação: uma grade de álbuns como tela inicial, que leva a uma lista de músicas ao clicar, além de uma busca independente por texto.

> **Prompt utilizado:** "Por que eu clico nesses álbuns e não aparece as músicas do álbum?" *(ex: álbuns como "Rock in Rio" e "The X Factor" apareciam com só 1 ou 2 faixas, quando na verdade têm muito mais)*
* **Objetivo:** Entender por que a busca inicial (entity=song, termo "iron maiden") não trazia a lista completa de cada álbum — e descobrir que o endpoint correto para isso é o /lookup por ID do álbum, não uma busca por palavra-chave. Essa correção mudou a arquitetura da aplicação: hoje ela busca a lista de álbuns uma vez, e as faixas de cada álbum só quando o usuário realmente clica nele.

> **Prompt utilizado:** "Tem como elaborar colocando esses itens?" *(colei uma lista de ideias de funcionalidades: página inicial cronológica, filtro de busca, página de detalhes com capa grande, e seção de favoritos com localStorage)*
* **Objetivo:** Comparar o que a aplicação já cobria com essa lista de sugestões e implementar o que faltava: a página de detalhes ganhou a capa grande do álbum em destaque, e foi criada a seção de favoritos usando localStorage, com um botão de coração em cada música.

---

## 🔍 Revisão e Validação Manual

* Corrigi manualmente, com apoio da IA, erros reais de build durante o desenvolvimento (caminhos de import desatualizados após reorganizar os componentes em pastas, um index.css que havia sido apagado, e conteúdo duplicado por engano entre arquivos).
* Percebi e corrigi um problema de qualidade de dados: a busca inicial trazia artistas não relacionados (covers, tributos) e álbuns duplicados com o mesmo nome — ambos filtrados manualmente após identificar a causa.
* Testei a aplicação em diferentes larguras de tela (celular, tablet, desktop) para confirmar a responsividade.
* Confirmei o funcionamento do localStorage testando se os favoritos permanecem salvos após recarregar a página.

---

## 🧪 Testes de Resiliência e Tratamento de Erros

A aplicação foi construída para lidar de forma graciosa com falhas de rede, dados corrompidos e ausência de resultados.

### 1. Teste de Busca sem Resultados
* **Cenário:** O utilizador pesquisa por um termo inexistente no catálogo (ex: `funk carioca`).
* **Comportamento:** A API responde com sucesso (`200 OK`), mas com um array vazio.
* **Resultado:** O sistema exibe uma mensagem amigável informando que nada foi encontrado para o termo pesquisado, mantendo a navegação ativa.

### 2. Teste de Falha de Ligação / Offline
* **Cenário:** A conexão com a internet é interrompida ou a API do iTunes fica indisponível durante uma requisição.
* **Como Simular:** No DevTools do navegador (`F12` > aba *Network*), altere a limitação para **Offline** e execute uma busca.
* **Resultado:** O bloco `.catch()` captura a falha de rede e exibe um alerta destacado:
  > ⚠️ *Erro ao realizar a busca. Tente novamente.*

### 3. Teste de Tolerância a Dados Corrompidos (`localStorage`)
* **Cenário:** O valor salvo na chave de favoritos no navegador é alterado para um JSON inválido.
* **Resultado:** O bloco `try...catch` na inicialização do estado recupera a exceção e redefine a lista de favoritos para um array vazio `[]`, evitando o travamento da interface (*white screen of death*).

### 4. Teste de Limpeza de Entrada (*Debounce*)
* **Cenário:** O utilizador apaga completamente o texto da caixa de pesquisa.
* **Resultado:** O temporizador de 400ms do *debounce* limpa os resultados de busca e a aplicação retorna suavemente para a visualização principal da grade de álbuns e estatísticas.

## 👤 Autor

**Elton do Nascimento**