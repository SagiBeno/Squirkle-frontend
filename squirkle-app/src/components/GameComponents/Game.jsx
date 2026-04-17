import React, { useCallback, useEffect, useState } from 'react'
import { Unity, useUnityContext } from "react-unity-webgl";
import { Button, Box, Flex, Text } from "@radix-ui/themes"
import { InitializeGame, InitializeGameHandler, SetGameTime } from "../../GameHandler.js"
import * as GameEvents from "../../GameEvents.js"
import { useContext } from 'react';
import { GameContext } from './GameContext.jsx';

export default function Game({ filePaths, user }) {

    const { unityProvider, sendMessage, addEventListener, isLoaded } = useUnityContext(filePaths);
    const gameContext = useContext(GameContext)

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

    useEffect(() => {
        if (!isLoaded) return
        
        console.log("Game initialized!")
        InitializeGameHandler(sendMessage)
        InitializeGame(user)

        GameEvents.SetGameContext(gameContext)

    }, [isLoaded])

    return (
        <Unity unityProvider={unityProvider} style={{width: '100%', height: '100%', backgroundColor: 'black' }} />
    )
}
