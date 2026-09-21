import './Header.css'

/**
 * Header
 * Exibe o título/marca da aplicação. Não recebe props — é um
 * componente puramente visual e estático.
 */
function Header() {
  return (
    <header className="cabecalho">
      <h1>Iron Maiden Explorer</h1>
      <p className="cabecalho-subtitulo">Explore a discografia da banda</p>
    </header>
  )
}

export default Header