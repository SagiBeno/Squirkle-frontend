import { Button, Dialog, DropdownMenu, Flex, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { NavbarButton } from "./Buttons";
import { FaMap } from "react-icons/fa";
import { MdBackpack } from "react-icons/md";
import { IoGameController } from "react-icons/io5";
import { GiTwoCoins } from "react-icons/gi";
import { RiAuctionFill, RiMenuFill } from "react-icons/ri";
import { AREA_SELECTOR_STATE, AUCTION_HOUSE_STATE, GAME_STATE, INVENTORY_STATE } from "../Pages/GamePage";

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
            align="center"
            justify="between"
            style={{
                height: isMobile ? '52px' : '60px',
                width: '100%',
                backgroundColor: 'gray',
                top: 0,
                position: 'fixed',
                paddingInline: isMobile ? 8 : 15,
                fontFamily: "'Fredoka', sans-serif",
            }}
        >
            <Flex align="center" style={{ flex: 1, minWidth: 0 }}>
                {isMobile ? (
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                            <Button
                                variant="solid"
                                size="2"
                                radius="none"
                                style={{
                                    cursor: 'pointer',
                                    height: "100%",
                                    aspectRatio: 1,
                                    backgroundColor: "darkgray",
                                    margin: 0,
                                    borderBottom: "5px rgba(0, 0, 0, 0.1) solid"
                                }}
                            >
                                <RiMenuFill size={iconSize} />
                            </Button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Content align="start">
                            {user ? <DropdownMenu.Label>{user.username}</DropdownMenu.Label> : null}

                            <DropdownMenu.Item onClick={() => setDialogState(GAME_STATE)}>
                                <IoGameController size={18} style={{ marginRight: 8 }} /> Game
                            </DropdownMenu.Item>
                            <DropdownMenu.Item onClick={() => setDialogState(AREA_SELECTOR_STATE)}>
                                <FaMap size={18} style={{ marginRight: 8 }} /> Area
                            </DropdownMenu.Item>
                            <DropdownMenu.Item onClick={() => setDialogState(INVENTORY_STATE)}>
                                <MdBackpack size={18} style={{ marginRight: 8 }} /> Inventory
                            </DropdownMenu.Item>
                            <DropdownMenu.Item onClick={() => setDialogState(AUCTION_HOUSE_STATE)}>
                                <RiAuctionFill size={18} style={{ marginRight: 8 }} /> Auction House
                            </DropdownMenu.Item>

                            {user ? (
                                <>
                                    <DropdownMenu.Separator />
                                    <DropdownMenu.Item color="red" onClick={signOut}>
                                        Logout
                                    </DropdownMenu.Item>
                                </>
                            ) : null}
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                ) : (
                    <>
                        {/* game */}
                        <NavbarButton compact={isMobile} icon={<IoGameController size={iconSize} />} onClick={() => setDialogState(GAME_STATE)} />

                        {/* area chooser */}
                        <Dialog.Trigger>
                            <NavbarButton compact={isMobile} icon={<FaMap size={iconSize} />} onClick={() => setDialogState(AREA_SELECTOR_STATE)} />
                        </Dialog.Trigger>

                        {/* inventory */}
                        <Dialog.Trigger>
                            <NavbarButton compact={isMobile} icon={<MdBackpack size={iconSize} />} onClick={() => setDialogState(INVENTORY_STATE)} />
                        </Dialog.Trigger>

                        {/* auction house */}
                        <Dialog.Trigger>
                            <NavbarButton compact={isMobile} icon={<RiAuctionFill size={iconSize} />} onClick={() => setDialogState(AUCTION_HOUSE_STATE)} />
                        </Dialog.Trigger>
                    </>
                )}
            </Flex>

            <Flex
                align="center"
                gap="2"
                style={{
                    flexShrink: 0,
                    backgroundColor: '#4b4b4b',
                    border: '2px solid #8b6b11',
                    borderRadius: 999,
                    padding: isMobile ? '4px 8px' : '6px 12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                    zIndex: 5,
                }}
            >
                <GiTwoCoins size={isMobile ? 14 : 18} color="#f2c94c" />
                <Text size={isMobile ? "2" : "3"} style={{ color: '#f2c94c', fontWeight: 700 }}>
                    {coinCount}
                </Text>
            </Flex>

            <Flex align="center" justify="end" style={{ flex: 1, minWidth: 0 }}>
                {user == null || isMobile ? null : (
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                            <Button size={isMobile ? "2" : "3"}>
                                <Text
                                    size={isMobile ? "4" : "6"}
                                    style={{
                                        color: 'white',
                                        fontWeight: '500',
                                        maxWidth: isMobile ? 96 : 180,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {user.username}
                                </Text>
                            </Button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Content align="end">
                            <DropdownMenu.Item color="red" onClick={signOut}>
                                Logout
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                )}
            </Flex>
        </Flex>
    )
}