import './GradeAlbuns.css'

/**
 * GradeAlbuns
 * Mostra um card por álbum. Ao clicar em um card, chama
 * `aoSelecionarAlbum(album.id)` — essa função vem do App (é o
 * setAlbumSelecionadoId) e é isso que faz a aplicação "entrar" no
 * álbum, trocando o que o Main renderiza.
 */
function GradeAlbuns({ albuns, aoSelecionarAlbum }) {
  return (
    <div className="grade-albuns">
      {albuns.map((album) => (
        <button
          key={album.id}
          className="album-card"
          onClick={() => aoSelecionarAlbum(album.id)}
          // aria-label mais descritivo que o texto visível, já que o
          // botão inteiro é clicável (não só um link de texto).
          aria-label={`Ver músicas do álbum ${album.nome}`}
        >
          <img src={album.capa} alt={`Capa do álbum ${album.nome}`} />
          <div className="album-info">
            <h2 className="album-nome">{album.nome}</h2>
            <p className="album-detalhes">
              {album.ano} · {album.quantidadeFaixas}{' '}
              {album.quantidadeFaixas === 1 ? 'faixa' : 'faixas'}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}

export default GradeAlbuns