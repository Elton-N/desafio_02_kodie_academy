# Iron Maiden Explorer

## Problemática
Como transformar a discografia de uma banda, disponível de forma "crua" em uma
API pública, em uma aplicação que facilite a consulta e a exploração dessas
músicas por parte do usuário?

## Objetivo da aplicação
Permitir que fãs da banda Iron Maiden explorem sua discografia de forma
simples e visual, podendo buscar músicas pelo nome, filtrar álbuns e escutar *previews* das faixas.

## Tecnologias utilizadas
- React + Vite
- Axios
- CSS3 (sem estilos inline, um arquivo CSS por componente)

## API utilizada
[iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/)
— endpoint `https://itunes.apple.com/search`, buscando `term=iron+maiden` e
`entity=song`. Não exige chave de API nem autenticação.

## Principais funcionalidades
- Busca por nome da música (filtro em tempo real, conforme o usuário digita).
- Player de áudio com *previews* de 30 segundos das músicas.
- Sistema de Favoritos para salvar faixas preferidas.
- Estado de carregamento enquanto os dados da API ainda não chegaram.
- Mensagem de "nenhum resultado encontrado" quando a busca/filtro não encontra nenhuma música.
- Layout responsivo (grid fluido) otimizado para celular, tablet e desktop.

## Como executar o projeto localmente
```bash
npm install
npm run dev

## Link da aplicação publicada
> https://desafio-02-kodie-academy.vercel.app/.