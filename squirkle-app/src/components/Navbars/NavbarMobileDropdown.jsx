import { Button, Dialog, DropdownMenu, Text } from '@radix-ui/themes'
import React from 'react'
import { FaMap } from 'react-icons/fa'
import { IoGameController } from 'react-icons/io5'
import { MdBackpack } from 'react-icons/md'
import { RiAuctionFill, RiMenuFill } from 'react-icons/ri'
import { AREA_SELECTOR_STATE, AUCTION_HOUSE_STATE, INVENTORY_STATE } from '../../Pages/GamePage'
import { DropdownNavbarButton } from '../Buttons'

export default function NavbarMobileDropdown({setDialogState, user, signOut, iconSize}) {
    return (
        <DropdownMenu.Root>
            <DropdownNavbarButton icon={<RiMenuFill size={iconSize} />} />

            <DropdownMenu.Content className="squirkleDropdown" style={{width: 200, marginTop: -8, marginLeft: -20, backgroundColor: "transparent"}}>
                {user == null ? null : 
                    <Text style={{backgroundColor: "white", textAlign: "center", paddingBottom: 5, paddingTop: 5}}>{user.username}</Text>
                }
                
                <Dialog.Trigger>
                    <Button className="squirkleButton" style={{padding: 5, backgroundColor: "#f6f6f6"}} onClick={() => setDialogState(AREA_SELECTOR_STATE)}>
                        <FaMap size={18} color='black' style={{ marginRight: 8 }} /> 
                        <Text style={{color: "black"}}>Area</Text>
                    </Button>
                </Dialog.Trigger>

                <Dialog.Trigger>
                    <Button className="squirkleButton" style={{padding: 5, backgroundColor: "#f6f6f6"}} onClick={() => setDialogState(INVENTORY_STATE)}>
                        <MdBackpack size={18} color='black' style={{ marginRight: 8 }} /> 
                        <Text style={{color: "black"}}>Inventory</Text>
                    </Button>
                </Dialog.Trigger>
                
                <Dialog.Trigger>
                    <Button className="squirkleButton" style={{padding: 5, backgroundColor: "#f6f6f6"}} onClick={() => setDialogState(AUCTION_HOUSE_STATE)}>
                        <RiAuctionFill size={18} color='black' style={{ marginRight: 8 }} /> 
                        <Text style={{color: "black"}}>Auction House</Text>
                    </Button>
                </Dialog.Trigger>

                {user ? (
                    <>
                        <Button className="squirkleButton" onClick={signOut} style={{padding: 5, backgroundColor: "#ee3c3c"}}>
                            <Text weight="bold">Logout</Text>
                        </Button>
                    </>
                ) : null}
            </DropdownMenu.Content>
        </DropdownMenu.Root>

    )
}
