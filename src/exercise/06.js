// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
} from '../pokemon'

import {ErrorBoundary} from 'react-error-boundary'

// class ErrorBoundary extends React.Component {
//   state = {error: null}
//   static getDerivedStateFromError(error) {
//     return {error}
//   }
//   render() {
//     const {error} = this.state
//     if (error) {
//       return <this.props.FallbackComponent error={error} />
//     }

//     return this.props.children
//   }
// }

function PokemonInfo({pokemonName}) {
  const [{status, pokemon, error}, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })

  const isIdle = status === 'idle'
  const isPending = status === 'pending'
  const isResolve = status === 'resolved'
  const isRejected = status === 'rejected'

  React.useEffect(() => {
    if (!pokemonName) return

    setState(old => {
      return {...old, status: 'pending'}
    })

    fetchPokemon(pokemonName, 300)
      .then(value => {
        setState(old => {
          return {...old, pokemon: value, status: 'resolved'}
        })
      })
      .catch(error => {
        setState(old => {
          return {...old, error: error, status: 'rejected'}
        })
      })
  }, [pokemonName])

  if (!pokemonName) return 'Submit a pokemon'

  if (isRejected) throw error

  if (isIdle || isPending) return <PokemonInfoFallback name={pokemonName} />

  return <PokemonDataView pokemon={pokemon} />
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error?.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }
  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          resetKeys={[pokemonName]}
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
