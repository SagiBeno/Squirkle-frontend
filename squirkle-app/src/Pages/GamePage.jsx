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

/**
 * Default game creen state.
 * 
 * @constant { number }
 */
export const GAME_STATE = 0

/**
 * Dialog state for the are selector
 * 
 * @constant { number }
 */
export const AREA_SELECTOR_STATE = 1

/**
 * Dialog state for the inventory.
 * 
 * @constant { number }
 */
export const INVENTORY_STATE = 2

/**
 * Dialog state for the auction house.
 * 
 * @constant { number }
 */
export const AUCTION_HOUSE_STATE = 3

/**
 * Game page component.
 * 
 * Displays the main game page, initializes player coin data, 
 * provides game-related state through 'GameContext', and handles
 * opening game dialogs such as area selector, inventory, and auction house.
 * 
 * Redirect unauthenticated users to the home page.
 * 
 * @component
 * 
 * @param { Object } props - Component props
 * @param { Object | null } props.user - Currently authenticated user data
 * @param { Function } props.signOut - Function used to sign out the current user
 * @param { Function } props.setShowApploader - Controls the global app loader visibility
 * @param { Object } props.toastData - Current toast notification data
 * @param { Function } props.setToastData - Updates toast notification data
 * @param { Function } props.refreshUser - Reloads the current user's application data
 * 
 * @returns { JSX.Element } Game page UI 
 */
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

    /**
     * Renders the currently selected game dialog.
     * 
     * Uses 'dialogState' to decide whether to render the area selector,
     * inventory, auction house, or no dialog.
     * 
     * @returns { JSX.Element | null } Current dialog component, or null if no dialog is selected
     */
    function RenderCurrentDialog() {
        switch (dialogState) {
            case AREA_SELECTOR_STATE:
                return <AreaSelectorDialog user={user} setDialogState={setDialogState} setOpen={setOpenDialog} refreshUser={refreshUser} toastData={toastData} setToastData={setToastData} />
            case INVENTORY_STATE:
                return <InventoryDialog user={user} setDialogState={setDialogState} setOpen={setOpenDialog} />
            case AUCTION_HOUSE_STATE:
                return <AuctionHouseDialog user={user} toastData={toastData} setToastData={setToastData} setOpen={setOpenDialog} setDialogState={setDialogState} refreshUser={refreshUser} />
        }

        return null;
    }

    const [isGameLoaded, setIsGameLoaded] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [filePaths, setFilePaths] = useState({})
    const [coins, setCoins] = useState(() => user?.coinCount ?? 0)

    function showNewItemToast(itemName) {
        console.log(itemName)
        const trimmedName = (itemName ?? '').toString().trim()
        const displayName = trimmedName.length > 0 ? trimmedName : 'Unknown Item'

        setToastData({
            open: true,
            title: `You got a new item:`,
            description: `${displayName}`,
            isError: false
        })
    }

    const gameContext = {
        isGameLoaded, setIsGameLoaded,
        isLoading, setIsLoading,
        filePaths, setFilePaths,
        coins: coins,
        setCoins,
        showNewItemToast,
    }

    return (
        <>
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

        </>
    )
}
