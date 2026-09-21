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

          {/* 
            PÁGINA DE DETALHES: capa grande + nome + ano do álbum
            em destaque, antes da lista de faixas.
          */}
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

          {/* 
            Faixa de estatísticas do acervo, logo depois do grid.
            Além de preencher o espaço vazio da última fileira,
            reforça a ideia de "painel" com um resumo dos dados.
          */}
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
    </main>
  )
}

export default Main