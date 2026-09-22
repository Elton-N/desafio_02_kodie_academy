import { useState, useEffect } from 'react'
import './Main.css'
import GradeAlbuns from '../Gradealbuns/Gradealbuns.jsx'
import GradeMusicas from '../Grademusicas/Grademusicas.jsx'

function obterCapaGrande(url) {
  return url.replace('100x100', '600x600')
}

function Main({
  modo,
  carregando,
  albuns,
  musicas,
  albumAtual,
  favoritos,
  aoAlternarFavorito,
  aoSelecionarAlbum,
  aoVoltar,
  aoFecharFavoritos,
}) {
  // Controla a direção atual da navegação: 'baixo' ou 'cima'
  const [direcao, setDirecao] = useState('baixo')

  // Atualiza a direção automaticamente nos limites da página
  useEffect(() => {
    const monitorarLimites = () => {
      const topoAbsoluto = window.scrollY <= 10
      const fimAbsoluto =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20

      if (fimAbsoluto) {
        setDirecao('cima') // Quando chega ao fim da página, força a direção para SUBIR
      } else if (topoAbsoluto) {
        setDirecao('baixo') // Quando chega ao topo, força a direção para DESCER
      }
    }

    window.addEventListener('scroll', monitorarLimites)
    return () => window.removeEventListener('scroll', monitorarLimites)
  }, [])

  // Função para navegar linha por linha mantendo o sentido
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

  if (carregando) {
    return (
      <main className="secao-principal">
        <p className="mensagem-status">Carregando discografia...</p>
      </main>
    )
  }

  return (
    <main className="secao-principal">
      {modo === 'busca' && (
        <>
          {/* Botão no topo da busca */}
          <button className="botao-voltar" onClick={aoVoltar}>
            ← Voltar aos álbuns
          </button>

          <h2 className="titulo-secao">Resultado da busca</h2>

          {musicas.length === 0 ? (
            <p className="mensagem-status">Nenhuma música encontrada.</p>
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

      {modo === 'albuns' && (
        <>
          <h2 className="titulo-secao">Álbuns</h2>
          <GradeAlbuns albuns={albuns} aoSelecionarAlbum={aoSelecionarAlbum} />

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
        </>
      )}

      {/* Botão com direção persistente */}
      <button
        className="botao-topo"
        onClick={navegarPorFileira}
        aria-label={direcao === 'cima' ? "Subir uma fileira" : "Descer uma fileira"}
        title={direcao === 'cima' ? "Subir uma fileira" : "Descer uma fileira"}
      >
        {direcao === 'cima' ? '↑' : '↓'}
      </button>
    </main>
  )
}

export default Main