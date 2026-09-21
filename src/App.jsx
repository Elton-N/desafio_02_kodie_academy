import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from './components/Header/Header.jsx'
import Busca from './components/Busca/Busca.jsx'
import Main from './components/Main/Main.jsx'
import Footer from './components/Footer/Footer.jsx'

// Chave usada para guardar/ler os favoritos no localStorage do
// navegador. Fica fora do componente por ser um valor fixo, que
// nunca muda.
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

  // Ver a seção de favoritos (ativada pelo botão ao lado da busca).
  const [verFavoritos, setVerFavoritos] = useState(false)

  // Lista de músicas favoritas. A função dentro do useState só roda
  // UMA VEZ (na primeira renderização), lendo o que já estava salvo
  // no localStorage — é assim que os favoritos "sobrevivem" mesmo
  // depois de fechar e abrir o navegador de novo.
  const [favoritos, setFavoritos] = useState(() => {
    try {
      const salvos = localStorage.getItem(CHAVE_FAVORITOS)
      return salvos ? JSON.parse(salvos) : []
    } catch {
      return []
    }
  })

  // Sempre que `favoritos` mudar, salva a lista atualizada no
  // localStorage — assim toda vez que o usuário clica no coração,
  // a mudança já fica gravada automaticamente.
  useEffect(() => {
    localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos))
  }, [favoritos])

  // Adiciona ou remove uma música dos favoritos, dependendo se ela
  // já estava lá ou não.
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

        // Mantém só a versão com mais faixas quando duas entradas
        // diferentes têm o mesmo nome de álbum (edição padrão vs.
        // edição com faixa bônus, por exemplo).
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
  // 2) Ao clicar em um álbum, busca a lista COMPLETA de faixas
  //    daquele álbum específico (endpoint de "lookup" por ID).
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

  // Funções "wrapper": além de mudar o estado principal, cada uma
  // também fecha a visão de favoritos, para não deixar duas telas
  // "ativas" ao mesmo tempo de forma confusa.
  function selecionarAlbum(id) {
    setVerFavoritos(false)
    setAlbumSelecionadoId(id)
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

  // Decide o que mostrar, em ordem de prioridade:
  // busca > detalhes do álbum > favoritos > grade de álbuns.
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
        aoVoltar={() => setAlbumSelecionadoId(null)}
        aoFecharFavoritos={() => setVerFavoritos(false)}
      />

      <Footer />
    </>
  )
}

export default App