import { useEffect, useState, useContext } from 'react'
import Game from './Game'
import JSZip from 'jszip'
import { GameContext } from './GameContext'
import { Flex, Text } from '@radix-ui/themes'
import GameSpinner from '../Spinners/GameSpinner'

/**
 * Game loader component.
 *
 * Checks the latest game build version, loads the Unity build either
 * from IndexedDB cache or downloads the newest version, unzips the game files,
 * and passes the generated file paths to the Unity game component.
 *
 * @component
 *
 * @param { Object } props - Component props
 * @param { Object } props.user - Current authenticated user data
 *
 * @returns { JSX.Element } Game loader or Unity game component
 */

export default function GameLoader({user}) {

    const { isGameLoaded, setIsGameLoaded, isLoading, setIsLoading, filePaths, setFilePaths } = useContext(GameContext)
    
    /**
     * Checks whether a newer game build is available.
     *
     * Downloads the latest build if no local version exists or the external
     * build is newer, otherwise loads the cached build from IndexedDB.
     */
    async function GetVersion() {
        if (isLoading) return;

        setIsLoading(true);

        try 
        {
            let localVersion = JSON.parse(localStorage.getItem("gameBuildDate"));
            let externalVersion = await (await fetch("https://squirkle.netlify.app/version.json")).json();
            let externalDate = GetDateFromString(externalVersion.buildDate);

            if (localVersion == null) await DownloadLatest(externalVersion, x => UnzipGame(x));
            else 
            {
                let localDate = GetDateFromString(localVersion.buildDate);

                if (localDate.getTime() < externalDate.getTime()) await DownloadLatest(externalVersion, x => UnzipGame(x));

                else await LoadGameLocally(x => UnzipGame(x));
            }
        } 
        catch (error)
        {
            console.error("Error during version check:", error);
        }
        finally
        {
            setIsLoading(false);
        }
    }

    /**
     * Downloads the latest game zip file and stores it in IndexedDB.
     *
     * @param { Object } date - External version metadata
     * @param { Function } onFinish - Callback executed after download
     */
    async function DownloadLatest(date, onFinish) 
    {
        console.log("Downloading game externally...")

        let blob = await (await fetch("https://squirkle.netlify.app/game.zip")).blob()
        let gameFiles = null
        
        // Open db
        const dbRequest = indexedDB.open("gameFiles", 1)
        
        dbRequest.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("zips")) {
            db.createObjectStore("zips");
            }
        };

        dbRequest.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction("zips", "readwrite");
            const store = transaction.objectStore("zips");

            // Store the Blob
            const putRequest = store.put(blob, "gameFiles");

            putRequest.onsuccess = () => {
                onFinish(blob)
                console.log("Game downloaded successfully!")
            };
            putRequest.onerror = () => console.error("Error storing file");
        };

        localStorage.setItem("gameBuildDate", JSON.stringify(date))
    }

    /**
     * Loads the cached game zip file from IndexedDB.
     *
     * @param { Function } onFinish - Callback executed after loading
     */
    async function LoadGameLocally(onFinish) 
    {
        console.log("Loading game locally...")

        // Open db
        const dbRequest = indexedDB.open("gameFiles", 1)

        dbRequest.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction("zips", "readonly");
            const store = transaction.objectStore("zips");
            const getRequest = store.get("gameFiles");

            getRequest.onsuccess = () => {
                onFinish(getRequest.result);
            };
        };
    }

    /**
     * Converts a build date string into a JavaScript Date object.
     *
     * Expected format: MM/DD/YYYY HH:mm:ss
     *
     * @param { string } dateString - Build date string
     * @returns { Date } Parsed date object
     */
    function GetDateFromString(dateString)
    {
        let dateTimeSplit = dateString.split(" ")
        let dateSplit = dateTimeSplit[0].split("/")

        let day = dateSplit[1]
        let month = dateSplit[0] - 1
        let year = dateSplit[2]

        let timeSplit = dateTimeSplit[1].split(":")
        let hour = timeSplit[0]
        let minute = timeSplit[1]
        let second = timeSplit[2]

        return new Date(year, month, day, hour, minute, second)
    }

    /**
     * Unzips the Unity WebGL build and creates object URLs for required files.
     *
     * Extracts framework, loader, data, and wasm files,
     * then stores them in game context.
     *
     * @param { Blob } gameFiles - Unity game zip file
     */
    async function UnzipGame(gameFiles)
    {
        const zip = new JSZip();
        const resultUrls = {}
        
        try 
        {
            // Load the zip
            const contents = await zip.loadAsync(gameFiles);
            
            // Iterate through the files inside
            for (const [relativePath, fileEntry] of Object.entries(contents.files)) 
            {
                if (fileEntry.dir || fileEntry.name.includes("__MACOSX")) continue

                // Extract the file as a "blob"
                const fileData = await fileEntry.async("blob");
                const url = URL.createObjectURL(fileData);

                // console.log(`Unzipped: ${fileEntry.name}`, url);
                
                if (fileEntry.name.includes(".framework.js")) resultUrls["frameworkUrl"] = url
                else if (fileEntry.name.includes(".loader.js")) resultUrls["loaderUrl"] = url
                else if (fileEntry.name.includes(".data")) resultUrls["dataUrl"] = url
                else if (fileEntry.name.includes(".wasm")) resultUrls["codeUrl"] = url
            }
        } 
        catch (err) 
        {
            console.error("Error unzipping:", err);
        }

        // console.log(resultUrls)

        setFilePaths(resultUrls)
        setIsGameLoaded(true)
    }

    useEffect(() => {
        GetVersion()
    }, [])

    return (
        <>
            {
                isGameLoaded ? <Game filePaths={filePaths} user={user}/> :
                <Flex
                    style={{
                        flexDirection: 'row',
                        alignContent: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: 'auto',
                        color: 'white'
                    }}
                >
                    <Text size="6">Loading game...</Text>
                    <GameSpinner />
                </Flex>
            }
        </>
    )
}
