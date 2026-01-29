import React, { useCallback, useEffect, useState } from 'react'
import { Unity, useUnityContext } from "react-unity-webgl";
import { Button } from "@radix-ui/themes"

export default function Game() {

    const { unityProvider, sendMessage, addEventListener, removeEventListenerProvider } = useUnityContext({
        loaderUrl: "https://squirkle.netlify.app//Build/Squirkle.loader.js",
        dataUrl: "https://squirkle.netlify.app/Build/Squirkle.data",
        frameworkUrl: "https://squirkle.netlify.app//Build/Squirkle.framework.js",
        codeUrl: "https://squirkle.netlify.app//Build/Squirkle.wasm",
    });
    
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

    return (
        <div>

            <Unity unityProvider={unityProvider} style={{ width: 1280, height: 720 }} />
            <h1>time: {Math.round(time * 100) / 100}</h1>
            <Button onClick={sendTestMessage}>booton</Button>

        </div>
    )
}
