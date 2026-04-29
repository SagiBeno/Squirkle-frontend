import { Button, DropdownMenu, Text } from '@radix-ui/themes'
import { useRef, useState } from 'react'
import { FaMap } from 'react-icons/fa'
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
 * @param { Function } props.restoreGameTouchInput - Restores Unity input after mobile menu closes
 *
 * @returns { JSX.Element }
 */

export default function NavbarMobileDropdown({ setDialogState, user, signOut, iconSize, setOpenDialog, restoreGameTouchInput }) {

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const launchingActionRef = useRef(false);

    function restoreAfterMenuClose() {
        window.setTimeout(() => restoreGameTouchInput?.(), 0);
        window.setTimeout(() => restoreGameTouchInput?.(), 180);
    }

    function handleOpenChange(nextOpen) {
        setOpen(nextOpen);

        if (!nextOpen && !launchingActionRef.current) {
            restoreAfterMenuClose();
        }
    }

    function handleMenuAction(action) {
        launchingActionRef.current = true;
        setOpen(false);
        action();
        window.setTimeout(() => {
            launchingActionRef.current = false;
        }, 250);
    }

    return (
        <DropdownMenu.Root modal={false} open={open} onOpenChange={handleOpenChange}>
            <DropdownNavbarButton icon={<RiMenuFill size={iconSize} />} />

            <DropdownMenu.Content className="squirkleDropdown" style={{ width: 200, marginTop: -12, marginLeft: -20, backgroundColor: "transparent", fontFamily: "'Fredoka', sans-serif", }}>
                {user == null ? null :
                    <Text style={{ backgroundColor: "#7373b5", textAlign: "center", paddingBottom: 5, paddingTop: 5, color: 'white', fontWeight: 'bold', letterSpacing: '1px' }}>{user.username}</Text>
                }


                <Button
                    className="squirkleButton"
                    style={{ padding: 5, backgroundColor: "#565676" }}
                    onClick={() => handleMenuAction(() => {
                        setDialogState(AREA_SELECTOR_STATE);
                        setOpenDialog(true);
                    })}
                >
                    <FaMap size={18} color='white' style={{ marginRight: 8 }} />
                    <Text style={{ color: "white", }}>Area</Text>
                </Button>

                <Button
                    className="squirkleButton"
                    style={{ padding: 5, backgroundColor: "#565676" }}
                    onClick={() => handleMenuAction(() => {
                        setDialogState(INVENTORY_STATE);
                        setOpenDialog(true);
                    })}
                >
                    <MdBackpack size={18} color='white' style={{ marginRight: 8 }} />
                    <Text style={{ color: "white" }}>Inventory</Text>
                </Button>

                <Button
                    className="squirkleButton"
                    style={{ padding: 5, backgroundColor: "#565676" }}
                    onClick={() => handleMenuAction(() => {
                        setDialogState(AUCTION_HOUSE_STATE);
                        setOpenDialog(true);
                    })}
                >
                    <RiAuctionFill size={18} color='white' style={{ marginRight: 8 }} />
                    <Text style={{ color: "white" }}>Auction House</Text>
                </Button>

                {
                    user?.isAdmin &&
                    <>
                        <Button
                            className="squirkleButton"
                            style={{ padding: 5, backgroundColor: "#565676", color: 'white' }}
                            onClick={() => handleMenuAction(() => {
                                navigate('/admin/item-management');
                            })}
                        >
                            <MdManageAccounts size={18} /> Item management
                        </Button>
                        <Button
                            className="squirkleButton"
                            style={{ padding: 5, backgroundColor: "#565676", height: '55px', color: 'white', textAlign: 'center' }}
                            onClick={() => handleMenuAction(() => {
                                navigate('/admin/metadata-management');
                            })}
                        >
                            <MdManageAccounts size={18} /> Metadata management
                        </Button>

                    </>
                }

                {user ? (
                    <>
                        <Button className="squirkleButton" onClick={() => handleMenuAction(signOut)} style={{ padding: 5, backgroundColor: "#ee3c3c" }}>
                            <FiLogOut size={18} /> <Text weight="bold">Logout</Text>
                        </Button>
                    </>
                ) : null}
            </DropdownMenu.Content>
        </DropdownMenu.Root>

    )
}
