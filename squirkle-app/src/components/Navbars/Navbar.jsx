import { Button, Dialog, DropdownMenu, Flex, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { DropdownNavbarButton, NavbarButton } from "../Buttons";
import { FaMap } from "react-icons/fa";
import { MdBackpack } from "react-icons/md";
import { IoGameController } from "react-icons/io5";
import { GiTwoCoins } from "react-icons/gi";
import { FiLogOut } from "react-icons/fi";
import { RiAuctionFill, RiMenuFill } from "react-icons/ri";
import { AREA_SELECTOR_STATE, AUCTION_HOUSE_STATE, GAME_STATE, INVENTORY_STATE } from "../../Pages/GamePage";
import NavbarMobileDropdown from "./NavbarMobileDropdown";
import CoinCounter from "../GameComponents/CoinCounter";
import { useNavigate } from "react-router-dom";
import { MdManageAccounts } from "react-icons/md";

export default function Navbar({ user, signOut, setDialogState, setOpenDialog }) {
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)")
        const onChange = (event) => setIsMobile(event.matches)

        setIsMobile(mediaQuery.matches)
        mediaQuery.addEventListener("change", onChange)

        return () => mediaQuery.removeEventListener("change", onChange)
    }, [])

    const iconSize = isMobile ? 24 : 32

    return (
        <Flex
            style={{
                height: 50,
                width: '100%',
                backgroundColor: 'gray',
                top: 0,
                position: 'fixed',
                fontFamily: "'Fredoka', sans-serif",
            }}
        >
            <Flex align="center">
                {isMobile ? <NavbarMobileDropdown setDialogState={setDialogState} user={user} signOut={signOut} iconSize={iconSize} setOpenDialog={setOpenDialog} /> : (
                    <>
                        {/* area chooser */}
                        <NavbarButton
                            icon={<FaMap size={iconSize} />}
                            onClick={() => {
                                setDialogState(AREA_SELECTOR_STATE);
                                setOpenDialog(true);
                            }}
                        />


                        {/* inventory */}
                        <NavbarButton
                            icon={<MdBackpack size={iconSize} />}
                            onClick={() => {
                                setDialogState(INVENTORY_STATE);
                                setOpenDialog(true);
                            }}
                        />

                        {/* auction house */}
                        <NavbarButton
                            icon={<RiAuctionFill size={iconSize} />}
                            onClick={() => {
                                setDialogState(AUCTION_HOUSE_STATE);
                                setOpenDialog(true);
                            }}
                        />
                    </>
                )}
            </Flex>

            <Flex align="center" justify="end" gap="3" flexGrow="1">
                <CoinCounter isMobile={isMobile} />

                {user == null || isMobile ? null : (
                    <>
                        <Text size="4" style={{ color: "white" }}>{user.username}</Text>

                        <DropdownMenu.Root>
                            <DropdownNavbarButton icon={<RiMenuFill size={iconSize} />} />

                            <DropdownMenu.Content className="squirkleDropdown" style={{ width: 160, marginTop: -12, marginRight: -20, backgroundColor: "transparent" }}>
                                {
                                    user?.isAdmin &&
                                    <>
                                        <Button className="squirkleButton" onClick={() => navigate('/admin/item-management')} style={{ padding: 10, height: '50px', backgroundColor: '#eba62a' }}>
                                            <MdManageAccounts size={18} /> <Text weight="bold">Item management</Text>
                                        </Button>
                                        <Button className="squirkleButton" onClick={() => navigate('/admin/metadata-management')} style={{ padding: 10, height: '50px', backgroundColor: '#eba62a' }}>
                                            <MdManageAccounts size={18} /> <Text weight="bold">Metadata management</Text>
                                        </Button>
                                    </>
                                }

                                <Button className="squirkleButton" onClick={signOut} style={{ padding: 5, backgroundColor: "#ee3c3c", }}>
                                    <FiLogOut size={18} /> <Text weight="bold">Logout</Text>
                                </Button>

                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </>
                )}
            </Flex>
        </Flex>
    )
}