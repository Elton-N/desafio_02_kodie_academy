import { useState, useEffect } from 'react'
import './Main.css'
import GradeAlbuns from '../Gradealbuns/Gradealbuns.jsx'
import GradeMusicas from '../Grademusicas/Grademusicas.jsx'

// Substitui a resolução da imagem da capa da API do iTunes (100x100) para alta qualidade (600x600)
function obterCapaGrande(url) {
  return url.replace('100x100', '600x600')
}

function Main({
  modo,               // Define qual visão renderizar: 'albuns', 'album', 'busca' ou 'favoritos'
  carregando,         // Estado booleano de carregamento
  erro,               // Mensagem de erro de conexão/API (se houver)
  textoBusca,         // <--- Adicionado: Termo digitado pelo utilizador na caixa de busca
  albuns,             // Lista com todos os álbuns
  musicas,            // Lista de músicas a exibir (resultados da busca, faixas do álbum ou favoritos)
  albumAtual,         // Dados do álbum selecionado atualmente
  favoritos,          // Lista de músicas favoritadas
  aoAlternarFavorito, // Função para adicionar/remover dos favoritos
  aoSelecionarAlbum,  // Função ao clicar em um álbum
  aoVoltar,           // Função para retornar à tela inicial de álbuns
  aoFecharFavoritos,  // Função para fechar a tela de favoritos
}) {
  // Controla a direção atual do botão flutuante de navegação: 'baixo' ou 'cima'
  const [direcao, setDirecao] = useState('baixo')

  // Redefine a seta para 'baixo' sempre que o utilizador muda de tela ou de álbum
  useEffect(() => {
    setDirecao('baixo')
  }, [modo, albumAtual])

  // Monitora a rolagem (scroll) para inverter a seta do botão flutuante no topo ou no fim da página
  useEffect(() => {
    const monitorarLimites = () => {
      const topoAbsoluto = window.scrollY <= 10
      const fimAbsoluto =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20

      // Verifica se a página é longa o suficiente para exigir rolagem
      const temRolagem = document.documentElement.scrollHeight > window.innerHeight + 50

      // Só aponta para cima se realmente estiver no fim, tiver rolagem e NÃO estiver no topo
      if (fimAbsoluto && temRolagem && !topoAbsoluto) {
        setDirecao('cima')
      } else if (topoAbsoluto) {
        setDirecao('baixo') // No topo, sempre garante a seta para baixo
      }
    }

    window.addEventListener('scroll', monitorarLimites)
    return () => window.removeEventListener('scroll', monitorarLimites)
  }, [])

  // Função para rolar a página em blocos/fileiras mantendo o sentido indicado pela seta
  const navegarPorFileira = () => {
    const alturaFileira = 380

    if (direcao === 'cima') {
      window.scrollBy({
        top: -alturaFileira,
        behavior: 'smooth',
      })
    } else {
      window.scrollBy({
        top: alturaFileira,
        behavior: 'smooth',
      })
    }
  }

  // 1. PRIORIDADE: Exibe indicação visual enquanto dados estão a ser procurados na API
  if (carregando) {
    return (
      <main className="secao-principal">
        <p className="mensagem-status">Carregando discografia...</p>
      </main>
    )
  }

  // 2. PRIORIDADE: Exibe alerta em vermelho caso ocorra falha de rede/API
  if (erro) {
    return (
      <main className="secao-principal">
        {modo !== 'albuns' && (
          <button className="botao-voltar" onClick={aoVoltar}>
            ← Voltar aos álbuns
          </button>
        )}
        <div style={{ textAlign: 'center', margin: '40px 0', padding: '20px' }}>
          <p className="mensagem-status" style={{ color: '#ff6b6b' }}>
            ⚠️ {erro}
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="secao-principal">
      {/* 3. VISÃO DE BUSCA */}
      {modo === 'busca' && (
        <>
          {/* Botão no topo da busca */}
          <button className="botao-voltar" onClick={aoVoltar}>
            ← Voltar aos álbuns
          </button>

          <h2 className="titulo-secao">Resultado da busca</h2>

          {/* Renderização condicional: Mostra mensagem personalizada com o termo pesquisado se não houver resultados */}
          {musicas.length === 0 ? (
            <p className="mensagem-status">
              Nenhum álbum ou música encontrado para "{textoBusca}". Tente pesquisar por outro termo!
            </p>
          ) : (
            <>
              <GradeMusicas
                musicas={musicas}
                favoritos={favoritos}
                aoAlternarFavorito={aoAlternarFavorito}
              />
              {/* Botão no final dos resultados da busca */}
              <div style={{ marginTop: '30px', marginBottom: '10px' }}>
                <button className="botao-voltar" onClick={aoVoltar}>
                  ← Voltar aos álbuns
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* 4. VISÃO DE DETALHES DO ÁLBUM */}
      {modo === 'album' && albumAtual && (
        <>
          <button className="botao-voltar" onClick={aoVoltar}>
            ← Voltar aos álbuns
          </button>

          <div className="detalhe-album">
            <img
              className="detalhe-album-capa"
              src={obterCapaGrande(albumAtual.capa)}
              alt={`Capa do álbum ${albumAtual.nome}`}
            />
            <div>
              <h2 className="detalhe-album-titulo">{albumAtual.nome}</h2>
              <p className="detalhe-album-meta">
                {albumAtual.ano} · {albumAtual.quantidadeFaixas}{' '}
                {albumAtual.quantidadeFaixas === 1 ? 'faixa' : 'faixas'}
              </p>
            </div>
          </div>

          <GradeMusicas
            musicas={musicas}
            favoritos={favoritos}
            aoAlternarFavorito={aoAlternarFavorito}
          />

          {/* Botão no final da lista de músicas do álbum */}
          <div style={{ marginTop: '30px', marginBottom: '10px' }}>
            <button className="botao-voltar" onClick={aoVoltar}>
              ← Voltar aos álbuns
            </button>
          </div>
        </>
      )}

      {/* 5. VISÃO DE FAVORITOS */}
      {modo === 'favoritos' && (
        <>
          <button className="botao-voltar" onClick={aoFecharFavoritos}>
            ← Voltar aos álbuns
          </button>
          <h2 className="titulo-secao">Suas músicas favoritas</h2>
          {musicas.length === 0 ? (
            <p className="mensagem-status">
              Você ainda não adicionou nenhuma música aos favoritos. Clique no
              coração ♡ de uma música para adicioná-la aqui.
            </p>
          ) : (
            <>
              <GradeMusicas
                musicas={musicas}
                favoritos={favoritos}
                aoAlternarFavorito={aoAlternarFavorito}
              />
              {/* Botão no final da tela de favoritos */}
              <div style={{ marginTop: '30px', marginBottom: '10px' }}>
                <button className="botao-voltar" onClick={aoFecharFavoritos}>
                  ← Voltar aos álbuns
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* 6. VISÃO INICIAL (GRADE DE ÁLBUNS E ESTATÍSTICAS) */}
      {modo === 'albuns' && (
        <>
          <h2 className="titulo-secao">Álbuns</h2>
          <GradeAlbuns albuns={albuns} aoSelecionarAlbum={aoSelecionarAlbum} />

          {/* Bloco de estatísticas calculado dinamicamente a partir da lista de álbuns */}
          {albuns.length > 0 && (
            <div className="estatisticas">
              <div className="estatistica-item">
                <span className="estatistica-numero">{albuns.length}</span>
                <span className="estatistica-rotulo">Álbuns</span>
              </div>
              <div className="estatistica-item">
                <span className="estatistica-numero">
                  {albuns.reduce((total, album) => total + album.quantidadeFaixas, 0)}
                </span>
                <span className="estatistica-rotulo">Faixas</span>
              </div>
              <div className="estatistica-item">
                <span className="estatistica-numero">
                  {Math.min(...albuns.map((a) => Number(a.ano)))}–
                  {Math.max(...albuns.map((a) => Number(a.ano)))}
                </span>
                <span className="estatistica-rotulo">Período</span>
              </div>
              <div className="estatistica-item">
                <span className="estatistica-numero">{favoritos.length}</span>
                <span className="estatistica-rotulo">Favoritos</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Botão flutuante com seta adaptativa (sobe/desce) */}
      <button
        className="botao-topo"
        onClick={navegarPorFileira}
        aria-label={direcao === 'cima' ? 'Subir uma fileira' : 'Descer uma fileira'}
        title={direcao === 'cima' ? 'Subir uma fileira' : 'Descer uma fileira'}
      >
        {direcao === 'cima' ? '↑' : '↓'}
      </button>
    </main>
  )
}

export default Main