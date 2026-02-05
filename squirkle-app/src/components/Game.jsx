import React, { useCallback, useEffect, useState } from 'react'
import { Unity, useUnityContext } from "react-unity-webgl";
import { Button } from "@radix-ui/themes"

export default function Game({ filePaths }) {

    const { unityProvider, sendMessage, addEventListener, removeEventListenerProvider } = useUnityContext(filePaths);
    
    const [time, setTime] = useState(0)
    const handleGameTime = useCallback((time) => {
        setTime(time)
    })

    useEffect(() => {
        addEventListener("GameTime", handleGameTime);
        return () => 
        {
            removeEventListener("GameTime", handleGameTime);
        };

    }, [addEventListener, removeEventListener, handleGameTime])

    function sendTestMessage()
    {
        sendMessage("Test", "ShowText", "<size=64>test text texttt")
    }

    console.log("starting game...")

    return (
        <div>

            <Unity unityProvider={unityProvider} style={{ width: 1280, height: 720 }} />
            <h1>time: {Math.round(time * 100) / 100}</h1>
            <Button onClick={sendTestMessage}>booton</Button>

        </div>
    )
}
