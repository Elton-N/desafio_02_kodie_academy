import { useState, useEffect } from 'react'
import './Main.css'
import GradeAlbuns from '../Gradealbuns/Gradealbuns.jsx'
import GradeMusicas from '../Grademusicas/Grademusicas.jsx'

/**
 * A API devolve a capa em baixa resolução (100x100). Trocando esse
 * trecho na própria URL da imagem, conseguimos pedir uma versão
 * bem maior (600x600) — sem precisar de uma segunda requisição.
 */
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
  const [noFinal, setNoFinal] = useState(false)

  // Monitora se o usuário chegou perto do fim da página
  useEffect(() => {
    const monitorarRolagem = () => {
      const limiteInferior = document.documentElement.scrollHeight - window.innerHeight - 150
      if (window.scrollY >= limiteInferior) {
        setNoFinal(true) // Chegou no fim -> botão muda para SUBIR (↑)
      } else {
        setNoFinal(false) // Ainda há conteúdo -> botão continua DESCENDO (↓)
      }
    }

    window.addEventListener('scroll', monitorarRolagem)
    return () => window.removeEventListener('scroll', monitorarRolagem)
  }, [])

  // Função que rola por "fileira/etapa"
  const navegarPorFileira = () => {
    // Altura aproximada de uma fileira (card + gap)
    const AlturaFileira = 380

    if (noFinal) {
      // Se estiver no fim, rola 1 fileira para cima
      window.scrollBy({
        top: -AlturaFileira,
        behavior: 'smooth',
      })
    } else {
      // Caso contrário, avança 1 fileira para baixo
      window.scrollBy({
        top: AlturaFileira,
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
          <h2 className="titulo-secao">Resultado da busca</h2>
          {musicas.length === 0 ? (
            <p className="mensagem-status">Nenhuma música encontrada.</p>
          ) : (
            <GradeMusicas
              musicas={musicas}
              favoritos={favoritos}
              aoAlternarFavorito={aoAlternarFavorito}
            />
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
            <GradeMusicas
              musicas={musicas}
              favoritos={favoritos}
              aoAlternarFavorito={aoAlternarFavorito}
            />
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

      {/* Botão de navegação por fileiras */}
      <button
        className="botao-topo"
        onClick={navegarPorFileira}
        aria-label={noFinal ? "Subir uma fileira" : "Descer uma fileira"}
        title={noFinal ? "Subir uma fileira" : "Descer uma fileira"}
      >
        {noFinal ? '↑' : '↓'}
      </button>
    </main>
  )
}

export default Main