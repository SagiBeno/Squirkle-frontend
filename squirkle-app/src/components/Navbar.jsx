import { Button, Dialog, DropdownMenu, Flex, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { DropdownNavbarButton, NavbarButton } from "./Buttons";
import { FaMap } from "react-icons/fa";
import { MdBackpack } from "react-icons/md";
import { IoGameController } from "react-icons/io5";
import { GiTwoCoins } from "react-icons/gi";
import { RiAuctionFill, RiMenuFill } from "react-icons/ri";
import { AREA_SELECTOR_STATE, AUCTION_HOUSE_STATE, GAME_STATE, INVENTORY_STATE } from "../Pages/GamePage";
import NavbarMobileDropdown from "./NavbarMobileDropdown";

export default function Navbar({ user, signOut, setDialogState }) {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)")
        const onChange = (event) => setIsMobile(event.matches)

        setIsMobile(mediaQuery.matches)
        mediaQuery.addEventListener("change", onChange)

        return () => mediaQuery.removeEventListener("change", onChange)
    }, [])

    const iconSize = isMobile ? 24 : 32
    const coinCount = user?.coinCount ?? user?.coins ?? 0

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
                {isMobile ? <NavbarMobileDropdown setDialogState={setDialogState} user={user} signOut={signOut} iconSize={iconSize}/> : (
                    <>
                        {/* area chooser */}
                        <Dialog.Trigger>
                            <NavbarButton icon={<FaMap size={iconSize} />} onClick={() => setDialogState(AREA_SELECTOR_STATE)} />
                        </Dialog.Trigger>

                        {/* inventory */}
                        <Dialog.Trigger>
                            <NavbarButton icon={<MdBackpack size={iconSize} />} onClick={() => setDialogState(INVENTORY_STATE)} />
                        </Dialog.Trigger>

                        {/* auction house */}
                        <Dialog.Trigger>
                            <NavbarButton icon={<RiAuctionFill size={iconSize} />} onClick={() => setDialogState(AUCTION_HOUSE_STATE)} />
                        </Dialog.Trigger>
                    </>
                )}
            </Flex>

            <Flex align="center" justify="end" gap="3" flexGrow="1">
                <Flex align="center" gap="2" style={{ marginRight: isMobile ? 10 : 0 }}>
                    <GiTwoCoins size={24} color="#f2c94c" />
                    <Text size="3" style={{ color: '#f2c94c', fontWeight: 700 }}>
                        {coinCount}
                    </Text>
                </Flex>

                {user == null || isMobile ? null : (
                    <>
                        <Text size="4" style={{color: "white"}}>{user.username}</Text>

                        <DropdownMenu.Root>
                            <DropdownNavbarButton icon={<RiMenuFill size={iconSize} />} />

                            <DropdownMenu.Content className="squirkleDropdown" style={{width: 150, marginTop: -12, marginRight: -20, backgroundColor: "transparent"}}>
                                <Button className="squirkleButton" onClick={signOut} style={{padding: 5, backgroundColor: "#ee3c3c"}}>
                                    <Text weight="bold">Logout</Text>
                                </Button>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </>
                )}
            </Flex>
        </Flex>
    )
}