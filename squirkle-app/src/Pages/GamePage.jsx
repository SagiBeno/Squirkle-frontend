import { Box, Dialog, Flex } from '@radix-ui/themes';
import Navbar from '../components/Navbars/Navbar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResetPlayerCoins } from '../GameEvents';
import AreaSelectorDialog from '../components/Dialogs/AreaSelectorDialog';
import InventoryDialog from '../components/Dialogs/InventoryDialog';
import AuctionHouseDialog from '../components/Dialogs/AuctionHouseDialog';
import { GameContext } from '../components/GameComponents/GameContext';
import GameLoader from '../components/GameComponents/GameLoader'

export const GAME_STATE = 0
export const AREA_SELECTOR_STATE = 1
export const INVENTORY_STATE = 2
export const AUCTION_HOUSE_STATE = 3

export default function GamePage({ user, signOut, setShowAppLoader, toastData, setToastData, refreshUser }) {

    const [dialogState, setDialogState] = useState(GAME_STATE);
    const [openDialog, setOpenDialog] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        setShowAppLoader(false);
        if (user == null) {
            navigate("/")
            return
        }

        setCoins(user.coinCount)
        ResetPlayerCoins(user.coinCount)
    }, [user])

    function RenderCurrentDialog() {
        switch (dialogState) {
            case AREA_SELECTOR_STATE:
                return <AreaSelectorDialog user={user} setDialogState={setDialogState} setOpen={setOpenDialog} refreshUser={refreshUser}/>
            case INVENTORY_STATE:
                return <InventoryDialog user={user} setDialogState={setDialogState} setOpen={setOpenDialog} />
            case AUCTION_HOUSE_STATE:
                return <AuctionHouseDialog user={user} toastData={toastData} setToastData={setToastData} setOpen={setOpenDialog} setDialogState={setDialogState} refreshUser={refreshUser}/>
        }

        return null;
    }

    const [isGameLoaded, setIsGameLoaded] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [filePaths, setFilePaths] = useState({})
    const [coins, setCoins] = useState(() => user?.coinCount ?? 0)

    const gameContext = {
        isGameLoaded, setIsGameLoaded,
        isLoading, setIsLoading,
        filePaths, setFilePaths,
        coins: coins,
        setCoins,
    }

    return (
        <Dialog.Root open={openDialog} onOpenChange={setOpenDialog}>
            <GameContext.Provider value={gameContext}>
                <Navbar user={user} signOut={signOut} setDialogState={setDialogState} setOpenDialog={setOpenDialog} />
                <Flex className='mainContainer'>

                    <Box className='navbarSpacer' />

                    <Flex className='contentContainer'>
                        <GameLoader user={user} />
                    </Flex>
                </Flex>
                
            </GameContext.Provider>
            {RenderCurrentDialog()}
        </Dialog.Root>
    )
}
