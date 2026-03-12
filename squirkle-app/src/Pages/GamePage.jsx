import { Box, Dialog, Flex } from '@radix-ui/themes';
import GameWindow from '../components/GameWindow';
import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { areas } from '../AreaData';
import GameAreaPanel from '../components/GameAreaPanel';
import AreaSelectorDialog from '../components/Dialogs/AreaSelectorDialog';
import InventoryDialog from '../components/Dialogs/InventoryDialog';
import AuctionHouseDialog from '../components/Dialogs/AuctionHouseDialog';

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
        }
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

    return (
        <Dialog.Root>
            <Navbar user={user} signOut={signOut} setDialogState={setDialogState}/>
            <Flex className='mainContainer'>

                <Box className='navbarSpacer' />

                <Flex className='contentContainer'>
                    <GameWindow user={user}/>
                </Flex>
            </Flex>

            {RenderCurrentDialog()}
        </Dialog.Root>
    )
}