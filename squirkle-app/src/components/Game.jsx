import React, { useCallback, useEffect, useState } from 'react'
import { Unity, useUnityContext } from "react-unity-webgl";
import { Button, Box, Flex } from "@radix-ui/themes"

export default function Game({ filePaths }) {

    const { unityProvider, sendMessage, addEventListener, removeEventListenerProvider } = useUnityContext(filePaths);
    
    const [time, setTime] = useState(0)
    const handleGameTime = useCallback((time) => {
        setTime(time)
    })

    useEffect(() => {
        addEventListener("GameTime", handleGameTime);
        return () => {
            removeEventListener("GameTime", handleGameTime);
        };

    }, [addEventListener, removeEventListener, handleGameTime])

    function sendTestMessage() {
        sendMessage("Test", "ShowText", "<size=64>test text texttt")
    }

    console.log("starting game...")

    return (
        <Flex
            style={{
                height: '90vh',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center'
            }}
        >
            <Unity unityProvider={unityProvider} style={{ width: '100%', height: '100%', backgroundColor: 'black' }} />
        </Flex>

    )
}
