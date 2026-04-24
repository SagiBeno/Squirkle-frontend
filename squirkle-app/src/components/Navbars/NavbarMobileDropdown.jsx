import { Button, Dialog, DropdownMenu, Text } from '@radix-ui/themes'
import React from 'react'
import { FaMap } from 'react-icons/fa'
import { IoGameController } from 'react-icons/io5'
import { MdBackpack } from 'react-icons/md'
import { RiAuctionFill, RiMenuFill } from 'react-icons/ri'
import { AREA_SELECTOR_STATE, AUCTION_HOUSE_STATE, INVENTORY_STATE } from '../../Pages/GamePage'
import { DropdownNavbarButton } from '../Buttons'
import { useNavigate } from 'react-router-dom'
import { FiLogOut } from "react-icons/fi";
import { MdManageAccounts } from "react-icons/md";

/**
 * Mobile dropdown navigation for the in-game navbar.
 *
 * Provides access to game dialogs such as area selection,
 * inventory, and auction house. Also displays admin navigation
 * options for admin users and a logout button for authenticated users.
 *
 * @component
 *
 * @param { Object } props - Component props
 * @param { Function } props.setDialogState - Sets the active game dialog state
 * @param { Object | null } props.user - Current authenticated user data
 * @param { string } [props.user.username] - Display username
 * @param { boolean } [props.user.isAdmin] - Whether the user has admin permissions
 * @param { Function } props.signOut - Logs out the current user
 * @param { number } props.iconSize - Size of the menu icon
 * @param { Function } props.setOpenDialog - Controls game dialog visibility
 *
 * @returns { JSX.Element }
 */

export default function NavbarMobileDropdown({ setDialogState, user, signOut, iconSize, setOpenDialog }) {

    const navigate = useNavigate();

    return (
        <DropdownMenu.Root>
            <DropdownNavbarButton icon={<RiMenuFill size={iconSize} />} />

            <DropdownMenu.Content className="squirkleDropdown" style={{ width: 200, marginTop: -8, marginLeft: -20, backgroundColor: "transparent" }}>
                {user == null ? null :
                    <Text style={{ backgroundColor: "white", textAlign: "center", paddingBottom: 5, paddingTop: 5 }}>{user.username}</Text>
                }


                <Button
                    className="squirkleButton"
                    style={{ padding: 5, backgroundColor: "#f6f6f6" }}
                    onClick={() => {
                        setDialogState(AREA_SELECTOR_STATE);
                        setOpenDialog(true);
                    }}
                >
                    <FaMap size={18} color='black' style={{ marginRight: 8 }} />
                    <Text style={{ color: "black" }}>Area</Text>
                </Button>

                <Button
                    className="squirkleButton"
                    style={{ padding: 5, backgroundColor: "#f6f6f6" }}
                    onClick={() => {
                        setDialogState(INVENTORY_STATE);
                        setOpenDialog(true);
                    }}
                >
                    <MdBackpack size={18} color='black' style={{ marginRight: 8 }} />
                    <Text style={{ color: "black" }}>Inventory</Text>
                </Button>

                <Button
                    className="squirkleButton"
                    style={{ padding: 5, backgroundColor: "#f6f6f6" }}
                    onClick={() => {
                        setDialogState(AUCTION_HOUSE_STATE);
                        setOpenDialog(true);
                    }}
                >
                    <RiAuctionFill size={18} color='black' style={{ marginRight: 8 }} />
                    <Text style={{ color: "black" }}>Auction House</Text>
                </Button>

                {
                    user?.isAdmin &&
                    <>
                        <Button
                            className="squirkleButton"
                            style={{ padding: 5, backgroundColor: "#f6f6f6", color: 'black' }}
                            onClick={() => {
                                navigate('/admin/item-management');
                            }}
                        >
                            <MdManageAccounts size={18} /> Item management
                        </Button>
                        <Button
                            className="squirkleButton"
                            style={{ padding: 5, backgroundColor: "#f6f6f6", height: '55px', color: 'black', textAlign: 'center' }}
                            onClick={() => {
                                navigate('/admin/metadata-management');
                            }}
                        >
                            <MdManageAccounts size={18} /> Metadata management
                        </Button>

                    </>
                }

                {user ? (
                    <>
                        <Button className="squirkleButton" onClick={signOut} style={{ padding: 5, backgroundColor: "#ee3c3c" }}>
                            <FiLogOut size={18} /> <Text weight="bold">Logout</Text>
                        </Button>
                    </>
                ) : null}
            </DropdownMenu.Content>
        </DropdownMenu.Root>

    )
}
