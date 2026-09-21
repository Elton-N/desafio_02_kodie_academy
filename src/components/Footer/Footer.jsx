import './Footer.css'

function Footer() {
  return (
    <footer className="rodape">
      <p className="rodape-marca">Iron Maiden Explorer</p>

      <p className="rodape-credito">
        Desenvolvido por <strong>Elton do Nascimento</strong>
        <span className="rodape-separador">•</span>
        Projeto Educacional (Kodie Academy, 2026)
      </p>

      <p className="rodape-info">Dados fornecidos pela iTunes Search API.</p>
      <p className="rodape-aviso">
        Este site não possui vínculo oficial com a banda Iron Maiden.
      </p>
    </footer>
  )
}

export default Footer