import './Grademusicas.css'

function formatarDuracao(milissegundos) {
  const totalSegundos = Math.floor(milissegundos / 1000)
  const minutos = Math.floor(totalSegundos / 60)
  const segundos = totalSegundos % 60
  return `${minutos}:${String(segundos).padStart(2, '0')}`
}

function GradeMusicas({ musicas, favoritos = [], aoAlternarFavorito }) {
  return (
    <div className="grade-musicas">
      {musicas.map((musica) => {
        const ehFavorita = favoritos.some((f) => f.trackId === musica.trackId)

        return (
          <article className="musica-card" key={musica.trackId}>
            <div className="musica-imagem-wrap">
              <img
                src={musica.artworkUrl100}
                alt={`Capa do álbum ${musica.collectionName}`}
              />

              {aoAlternarFavorito && (
                <button
                  type="button"
                  className={`botao-favorito ${ehFavorita ? 'ativo' : ''}`}
                  onClick={() => aoAlternarFavorito(musica)}
                  aria-label={
                    ehFavorita
                      ? `Remover ${musica.trackName} dos favoritos`
                      : `Adicionar ${musica.trackName} aos favoritos`
                  }
                  aria-pressed={ehFavorita}
                >
                  {ehFavorita ? '♥' : '♡'}
                </button>
              )}
            </div>

            <div className="musica-info">
              <h2 className="musica-titulo">{musica.trackName}</h2>
              <p className="musica-album">{musica.collectionName}</p>

              <div className="musica-detalhes">
                <span>{musica.releaseDate?.slice(0, 4)}</span>
                <span>{formatarDuracao(musica.trackTimeMillis)}</span>
              </div>

              {/* REPRODUTOR DE ÁUDIO DA ITUNES */}
              {musica.previewUrl ? (
                <audio 
                  controls 
                  src={musica.previewUrl} 
                  className="musica-player"
                >
                  O seu navegador não suporta a reprodução de áudio.
                </audio>
              ) : (
                <p className="sem-preview">Prévia indisponível</p>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default GradeMusicas