import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import GameWindow from './components/GameWindow'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GameWindow />
    </>
  )
}

export default App
