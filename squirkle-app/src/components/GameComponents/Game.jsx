import { useContext, useEffect } from 'react'
import { Unity, useUnityContext } from "react-unity-webgl";
import { InitializeGame, InitializeGameHandler } from "../../GameHandler.js"
import * as GameEvents from "../../GameEvents.js"
import { GameContext } from './GameContext.jsx';

/**
 * Unity game renderer component.
 *
 * Initializes the Unity WebGL context, connects Unity events to
 * JavaScript handlers, provides the game context to game events,
 * and initializes the game once Unity has finished loading.
 *
 * @component
 *
 * @param { Object } props - Component props
 * @param { Object } props.filePaths - Unity WebGL build file paths used by react-unity-webgl
 * @param { Object } props.user - Current authenticated user data used to initialize the game
 *
 * @returns { JSX.Element } Unity game canvas
 */

export default function Game({ filePaths, user }) {

    const { unityProvider, sendMessage, addEventListener, removeEventListener, isLoaded } = useUnityContext(filePaths);
    const gameContext = useContext(GameContext)

    /**
     * Provides the current React game context to Unity event handlers.
     */
    useEffect(() => {
        GameEvents.SetGameContext(gameContext)
    }, [gameContext])

    /**
     * Registers all GameEvents as Unity event listeners.
     * Cleans them up on unmount.
     */
    useEffect(() => {
        const eventNames = Object.keys(GameEvents);

        eventNames.forEach(name => {
            addEventListener(name, GameEvents[name]);
        });

        return () => {
            eventNames.forEach(name => {
                removeEventListener(name, GameEvents[name]);
            });
        };

    }, [addEventListener, removeEventListener, isLoaded, sendMessage])

    /**
     * Initializes the Unity game once it is fully loaded.
     */
    useEffect(() => {
        if (!isLoaded) return
        
        console.log("Game initialized!")
        InitializeGameHandler(sendMessage)
        InitializeGame(user)

    }, [isLoaded, sendMessage, user])

    return (
        <Unity
            id="squirkle-unity-canvas"
            unityProvider={unityProvider}
            tabIndex={0}
            style={{ width: '100%', height: '100%', backgroundColor: 'black', touchAction: 'none', outline: 'none' }}
        />
    )
}
