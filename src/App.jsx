import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from './components/Header/Header.jsx'
import Busca from './components/Busca/Busca.jsx'
import Main from './components/Main/Main.jsx'
import Footer from './components/Footer/Footer.jsx'

// Chave usada para guardar/ler os favoritos no localStorage do navegador.
const CHAVE_FAVORITOS = 'iron-maiden-explorer:favoritos'

function App() {
  const [albuns, setAlbuns] = useState([])
  const [carregandoAlbuns, setCarregandoAlbuns] = useState(true)

  const [musicasAlbum, setMusicasAlbum] = useState([])
  const [carregandoMusicasAlbum, setCarregandoMusicasAlbum] = useState(false)
  const [albumSelecionadoId, setAlbumSelecionadoId] = useState(null)

  const [textoBusca, setTextoBusca] = useState('')
  const [resultadosBusca, setResultadosBusca] = useState([])
  const [carregandoBusca, setCarregandoBusca] = useState(false)

  // Armazena a posição da rolagem vertical antes de entrar em um álbum
  const [posicaoScrollSalva, setPosicaoScrollSalva] = useState(0)

  // Ver a seção de favoritos (ativada pelo botão ao lado da busca).
  const [verFavoritos, setVerFavoritos] = useState(false)

  // Lista de músicas favoritas carregada do localStorage.
  const [favoritos, setFavoritos] = useState(() => {
    try {
      const salvos = localStorage.getItem(CHAVE_FAVORITOS)
      return salvos ? JSON.parse(salvos) : []
    } catch {
      return []
    }
  })

  // Salva alterações nos favoritos no localStorage.
  useEffect(() => {
    localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos))
  }, [favoritos])

  // Adiciona ou remove uma música dos favoritos.
  function alternarFavorito(musica) {
    setFavoritos((atual) => {
      const jaEhFavorita = atual.some((f) => f.trackId === musica.trackId)
      if (jaEhFavorita) {
        return atual.filter((f) => f.trackId !== musica.trackId)
      }
      return [...atual, musica]
    })
  }

  // ==========================================================
  // 1) Carrega a lista de ÁLBUNS, uma única vez, ao montar o App.
  // ==========================================================
  useEffect(() => {
    axios
      .get('https://itunes.apple.com/search', {
        params: { term: 'iron maiden', entity: 'album', limit: 200 },
      })
      .then((resposta) => {
        const albunsFiltrados = resposta.data.results
          .filter((album) => album.artistName === 'Iron Maiden')
          .map((album) => ({
            id: album.collectionId,
            nome: album.collectionName,
            capa: album.artworkUrl100,
            ano: album.releaseDate.slice(0, 4),
            quantidadeFaixas: album.trackCount,
          }))

        const albunsPorNome = {}
        albunsFiltrados.forEach((album) => {
          const existente = albunsPorNome[album.nome]
          if (!existente || album.quantidadeFaixas > existente.quantidadeFaixas) {
            albunsPorNome[album.nome] = album
          }
        })

        const albunsOficiais = Object.values(albunsPorNome).sort(
          (a, b) => a.ano - b.ano,
        )

        setAlbuns(albunsOficiais)
        setCarregandoAlbuns(false)
      })
  }, [])

  // ==========================================================
  // 2) Ao clicar em um álbum, busca as faixas daquele álbum.
  // ==========================================================
  useEffect(() => {
    if (albumSelecionadoId === null) return

    setCarregandoMusicasAlbum(true)
    axios
      .get('https://itunes.apple.com/lookup', {
        params: { id: albumSelecionadoId, entity: 'song' },
      })
      .then((resposta) => {
        const faixas = resposta.data.results.filter(
          (item) => item.wrapperType === 'track',
        )
        setMusicasAlbum(faixas)
        setCarregandoMusicasAlbum(false)
      })
  }, [albumSelecionadoId])

  // ==========================================================
  // 3) Busca por texto, com debounce de 400ms.
  // ==========================================================
  useEffect(() => {
    if (textoBusca.trim() === '') {
      setResultadosBusca([])
      return
    }

    setCarregandoBusca(true)
    const temporizador = setTimeout(() => {
      axios
        .get('https://itunes.apple.com/search', {
          params: {
            term: `iron maiden ${textoBusca}`,
            entity: 'song',
            limit: 100,
          },
        })
        .then((resposta) => {
          const somenteIronMaiden = resposta.data.results.filter(
            (musica) => musica.artistName === 'Iron Maiden',
          )
          setResultadosBusca(somenteIronMaiden)
          setCarregandoBusca(false)
        })
    }, 400)

    return () => clearTimeout(temporizador)
  }, [textoBusca])

  // Salva a posição exata da tela ANTES de mudar de página e rolar para o topo
  function selecionarAlbum(id) {
    const posicaoAtual = window.scrollY || document.documentElement.scrollTop
    setPosicaoScrollSalva(posicaoAtual)
    setVerFavoritos(false)
    setAlbumSelecionadoId(id)

    // Rola para o topo com um pequeno atraso para não atrapalhar o salvamento da posição
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 10)
  }

  // Restaura a exibição da lista de álbuns e volta para o local ou card específico
  function voltarParaAlbuns() {
    const idUltimoAlbum = albumSelecionadoId
    
    // Limpa tanto o termo de busca quanto o álbum selecionado
    setTextoBusca('')
    setAlbumSelecionadoId(null)

    setTimeout(() => {
      // 1. Tenta focar diretamente no card do álbum retornado via ID
      const elementoAlbum = document.getElementById(`album-${idUltimoAlbum}`)
      
      if (elementoAlbum) {
        elementoAlbum.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else {
        // 2. Se veio da busca ou não encontrar o elemento por ID, usa a posição salva ou vai para o topo
        window.scrollTo({
          top: posicaoScrollSalva || 0,
          behavior: 'smooth',
        })
      }
    }, 80)
  }

  function mudarTextoBusca(texto) {
    setVerFavoritos(false)
    setTextoBusca(texto)
  }

  function abrirFavoritos() {
    setTextoBusca('')
    setAlbumSelecionadoId(null)
    setVerFavoritos(true)
  }

  // Decide o que mostrar em ordem de prioridade.
  const buscaAtiva = textoBusca.trim() !== ''

  let modo = 'albuns'
  let carregando = carregandoAlbuns
  let musicasExibidas = []
  let albumAtual = null

  if (buscaAtiva) {
    modo = 'busca'
    carregando = carregandoBusca
    musicasExibidas = resultadosBusca
  } else if (albumSelecionadoId !== null) {
    modo = 'album'
    carregando = carregandoMusicasAlbum
    musicasExibidas = musicasAlbum
    albumAtual = albuns.find((album) => album.id === albumSelecionadoId)
  } else if (verFavoritos) {
    modo = 'favoritos'
    carregando = false
    musicasExibidas = favoritos
  }

  return (
    <>
      <Header />

      <Busca
        textoBusca={textoBusca}
        aoMudarTexto={mudarTextoBusca}
        quantidadeFavoritos={favoritos.length}
        aoAbrirFavoritos={abrirFavoritos}
      />

      <Main
        modo={modo}
        carregando={carregando}
        albuns={albuns}
        musicas={musicasExibidas}
        albumAtual={albumAtual}
        favoritos={favoritos}
        aoAlternarFavorito={alternarFavorito}
        aoSelecionarAlbum={selecionarAlbum}
        aoVoltar={voltarParaAlbuns}
        aoFecharFavoritos={() => setVerFavoritos(false)}
      />

      <Footer />
    </>
  )
}

export default App