import { Box, Dialog, Flex } from '@radix-ui/themes';
import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AreaSelectorDialog from '../components/Dialogs/AreaSelectorDialog';
import InventoryDialog from '../components/Dialogs/InventoryDialog';
import AuctionHouseDialog from '../components/Dialogs/AuctionHouseDialog';
import { GameContext } from '../components/GameContext';
import GameLoader from "../components/GameLoader"

export const GAME_STATE = 0
export const AREA_SELECTOR_STATE = 1
export const INVENTORY_STATE = 2
export const AUCTION_HOUSE_STATE = 3

export default function GamePage({ user, signOut }) {

    const [dialogState, setDialogState] = useState(GAME_STATE)

    const navigate = useNavigate()

    useEffect(() => {
        if (user == null) {
            navigate("/")
            return
        }

        setCoins(user.coinCount)
    }, [user])

    function RenderCurrentDialog()
    {
        switch(dialogState) {
            case AREA_SELECTOR_STATE:
                return <AreaSelectorDialog/>
            case INVENTORY_STATE:
                return <InventoryDialog/>
            case AUCTION_HOUSE_STATE:
                return <AuctionHouseDialog/>
        }

        return null
    }

    const [ isGameLoaded, setIsGameLoaded ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(false)
    const [ filePaths, setFilePaths ] = useState({})
    const [ coins, setCoins ] = useState(0)
    
    const gameContext = {
        isGameLoaded, setIsGameLoaded, 
        isLoading, setIsLoading,
        filePaths, setFilePaths,
        coins: coins,
        setCoins: x => setCoins(coins + x),
    }

    return (
        <Dialog.Root>
            <GameContext.Provider value={gameContext}>
                <Navbar user={user} signOut={signOut} setDialogState={setDialogState}/>
                <Flex className='mainContainer'>

                    <Box className='navbarSpacer' />

                    <Flex className='contentContainer'>   
                        <GameLoader user={user}/>
                    </Flex>
                </Flex>

                {RenderCurrentDialog()}
            </GameContext.Provider>
        </Dialog.Root>
    )
}