import { Box, Dialog, Flex } from '@radix-ui/themes';
import Navbar from '../components/Navbars/Navbar';
import { useCallback, useEffect, useRef, useState } from 'react';
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

const DIALOG_CLOSE_CLEANUP_DELAY_MS = 220;
const UNITY_CANVAS_ID = 'squirkle-unity-canvas';

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
    const [isGameLoaded, setIsGameLoaded] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [filePaths, setFilePaths] = useState({})
    const [coins, setCoins] = useState(() => user?.coinCount ?? 0)
    const dialogCleanupTimeoutRef = useRef(null);

    const navigate = useNavigate()

    const clearDialogCleanupTimeout = useCallback(() => {
        if (dialogCleanupTimeoutRef.current == null) return;

        window.clearTimeout(dialogCleanupTimeoutRef.current);
        dialogCleanupTimeoutRef.current = null;
    }, []);

    const restoreGameTouchInput = useCallback(() => {
        // Radix modal layers disable outside pointer events while open; recover if a mobile close leaves the global style behind.
        const hasOpenModalLayer = document.querySelector(
            '.rt-BaseDialogOverlay[data-state="open"], [role="dialog"][data-state="open"], [data-radix-menu-content][data-state="open"]'
        );

        if (!hasOpenModalLayer && document.body.style.pointerEvents === 'none') {
            document.body.style.pointerEvents = '';
        }

        const unityCanvas = document.getElementById(UNITY_CANVAS_ID);

        if (window.PointerEvent) {
            ['pointercancel', 'pointerup'].forEach((eventName) => {
                unityCanvas?.dispatchEvent(new PointerEvent(eventName, {
                    bubbles: true,
                    cancelable: true,
                    pointerType: 'touch',
                    isPrimary: true,
                }));
            });
        }

        try {
            unityCanvas?.focus({ preventScroll: true });
        } catch {
            unityCanvas?.focus();
        }

        window.dispatchEvent(new Event('blur'));
        window.dispatchEvent(new Event('focus'));
        window.dispatchEvent(new Event('resize'));
    }, []);

    const handleOpenDialogChange = useCallback((open) => {
        clearDialogCleanupTimeout();
        setOpenDialog(open);

        if (!open) {
            dialogCleanupTimeoutRef.current = window.setTimeout(() => {
                setDialogState(GAME_STATE);
                restoreGameTouchInput();
                dialogCleanupTimeoutRef.current = null;
            }, DIALOG_CLOSE_CLEANUP_DELAY_MS);
        }
    }, [clearDialogCleanupTimeout, restoreGameTouchInput]);

    const handleDialogCloseAutoFocus = useCallback((event) => {
        event.preventDefault();
        restoreGameTouchInput();
    }, [restoreGameTouchInput]);

    useEffect(() => {
        setShowAppLoader(false);
        if (user == null) {
            navigate("/")
            return
        }

        setCoins(user.coinCount)
        ResetPlayerCoins(user.coinCount)
    }, [user, navigate, setShowAppLoader])

    useEffect(() => {
        return () => clearDialogCleanupTimeout();
    }, [clearDialogCleanupTimeout]);

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
                return <AreaSelectorDialog user={user} setOpen={handleOpenDialogChange} refreshUser={refreshUser} toastData={toastData} setToastData={setToastData} onCloseAutoFocus={handleDialogCloseAutoFocus} />
            case INVENTORY_STATE:
                return <InventoryDialog user={user} setOpen={handleOpenDialogChange} onCloseAutoFocus={handleDialogCloseAutoFocus} />
            case AUCTION_HOUSE_STATE:
                return <AuctionHouseDialog user={user} toastData={toastData} setToastData={setToastData} setOpen={handleOpenDialogChange} refreshUser={refreshUser} onCloseAutoFocus={handleDialogCloseAutoFocus} />
        }

        return null;
    }

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
            <Dialog.Root open={openDialog} onOpenChange={handleOpenDialogChange}>
                <GameContext.Provider value={gameContext}>
                    <Navbar user={user} signOut={signOut} setDialogState={setDialogState} setOpenDialog={handleOpenDialogChange} restoreGameTouchInput={restoreGameTouchInput} />
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
