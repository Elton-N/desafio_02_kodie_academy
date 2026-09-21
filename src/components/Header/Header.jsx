import React from 'react'
import './Header.css'
import eddieTrooperEsquerda from '../../assets/the_tropper.png'
import eddieTrooperDireita from '../../assets/eddie-trooper_02.png'

function Header() {
  return (
    <header className="cabecalho">
      <div className="cabecalho-conteudo">
        <img 
          src={eddieTrooperEsquerda} 
          alt="Eddie - The Trooper Esquerda" 
          className="cabecalho-logo"
        />
        <h1 className="cabecalho-titulo">IRON MAIDEN EXPLORER</h1>
        <img 
          src={eddieTrooperDireita} 
          alt="Eddie - The Trooper Direita" 
          className="cabecalho-logo cabecalho-logo-direita"
        />
      </div>
      <p className="cabecalho-subtitulo">Explore a discografia da banda</p>
    </header>
  )
}

export default Header