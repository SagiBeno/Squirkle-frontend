import React from 'react'
import { GameContext } from './GameContext'
import GameLoader from './GameLoader'
import { useState } from 'react'

export default function GameWindow({user}) {
    const [ isGameLoaded, setIsGameLoaded ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(false)
    const [ filePaths, setFilePaths ] = useState({})

    const gameContext = {
        isGameLoaded, setIsGameLoaded, 
        isLoading, setIsLoading,
        filePaths, setFilePaths
    }

    return (
        <GameContext.Provider value={gameContext}>
            <GameLoader user={user}/>
        </GameContext.Provider>
    )
}
