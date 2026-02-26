import React, { useCallback, useEffect, useState } from 'react'
import { Unity, useUnityContext } from "react-unity-webgl";
import { Button, Box, Flex } from "@radix-ui/themes"
import { InitializeGameHandler } from "../GameHandler.js"
import * as GameEvents from "../GameEvents.js"

export default function Game({ filePaths }) {

    const { unityProvider, sendMessage, addEventListener } = useUnityContext(filePaths);
    
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

    console.log("starting game...")

    return (
        <Flex
            style={{
                height: '90vh',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Unity unityProvider={unityProvider} style={{ width: '100%', height: '100%', backgroundColor: 'black' }} />
        </Flex>

    )
}
