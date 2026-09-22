import CardMusica from '../CardMusica/CardMusica.jsx'
import './DetalheAlbum.css' // ou o nome do seu CSS de detalhes

function DetalheAlbum({
  album,
  musicas,
  aoVoltar,
  favoritos,
  aoAlternarFavorito,
}) {
  return (
    <section className="detalhe-album">
      {/* 1. Botão do topo */}
      <button className="botao-voltar" onClick={aoVoltar}>
        ← Voltar aos álbuns
      </button>

      {/* Cabeçalho do Álbum */}
      <div className="cabecalho-album">
        <img src={album.capa} alt={album.nome} />
        <div>
          <h2>{album.nome}</h2>
          <p>{album.ano} · {album.quantidadeFaixas} faixas</p>
        </div>
      </div>

      {/* Lista / Grid com todas as faixas */}
      <div className="grid-musicas">
        {musicas.map((musica) => (
          <CardMusica
            key={musica.trackId}
            musica={musica}
            favoritos={favoritos}
            aoAlternarFavorito={aoAlternarFavorito}
          />
        ))}
      </div>

      {/* 2. BOTÃO INFERIOR: Adicionado no final para o usuário não precisar rolar até o topo */}
      <div style={{ marginTop: '40px', marginBottom: '20px' }}>
        <button className="botao-voltar" onClick={aoVoltar}>
          ← Voltar aos álbuns
        </button>
      </div>
    </section>
  )
}

export default DetalheAlbum