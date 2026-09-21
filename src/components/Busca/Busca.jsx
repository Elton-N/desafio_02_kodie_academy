import './Busca.css'

/**
 * Busca
 * Campo de texto + botão para abrir a lista de favoritos.
 * `quantidadeFavoritos` só é usada para mostrar o número no botão
 * (ex: "❤ Favoritos (3)"), sem precisar a Busca saber COMO os
 * favoritos são guardados — essa lógica fica toda no App.
 */
function Busca({ textoBusca, aoMudarTexto, quantidadeFavoritos, aoAbrirFavoritos }) {
  return (
    <section className="busca" aria-label="Busca por música">
      <input
        type="text"
        className="busca-input"
        placeholder="Buscar por nome da música em todos os álbuns..."
        value={textoBusca}
        onChange={(e) => aoMudarTexto(e.target.value)}
        aria-label="Buscar por nome da música"
      />

      <button
        type="button"
        className="botao-favoritos"
        onClick={aoAbrirFavoritos}
        aria-label={`Ver músicas favoritas (${quantidadeFavoritos})`}
      >
        ❤ Favoritos ({quantidadeFavoritos})
      </button>
    </section>
  )
}

export default Busca