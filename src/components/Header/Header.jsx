import React from 'react'
import './Header.css'
import eddieTrooper from '../assets/the_tropper.png'

function Header() {
  return (
    <header className="cabecalho">
      <div className="cabecalho-conteudo">
        <img 
          src={eddieTrooper} 
          alt="Eddie - The Trooper" 
          className="cabecalho-logo"
        />
        <h1>IRON MAIDEN EXPLORER</h1>
      </div>
      <p className="cabecalho-subtitulo">Explore a discografia da banda</p>
    </header>
  )
}

export default Header