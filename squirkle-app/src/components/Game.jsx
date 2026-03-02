import React, { useCallback, useEffect, useState } from 'react'
import { Unity, useUnityContext } from "react-unity-webgl";
import { Button, Box, Flex, Text } from "@radix-ui/themes"
import { InitializeGameHandler, SetGameTime } from "../GameHandler.js"
import * as GameEvents from "../GameEvents.js"

export default function Game({ filePaths }) {

    const { unityProvider, sendMessage, addEventListener, isLoaded } = useUnityContext(filePaths);
    
    useEffect(() => {
        InitializeGameHandler(sendMessage)

        const eventNames = Object.keys(GameEvents);

        eventNames.forEach(name => {
            addEventListener(name, GameEvents[name]);
        });

        return () => {
            eventNames.forEach(name => {
                removeEventListener(name, GameEvents[name]);
            });
        };

    }, [addEventListener, removeEventListener])

    useEffect(() => {
        if (!isLoaded) return
        
        console.log("Game initialized!")
        SetGameTime()

    }, [isLoaded])

    console.log("starting game...")

    return (
        <Unity unityProvider={unityProvider} style={{width: '100%', height: '100%', backgroundColor: 'black' }} />
    )
}
