import { Button, Dialog, DropdownMenu, Flex, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { DropdownNavbarButton, NavbarButton } from "../Buttons";
import { FaMap } from "react-icons/fa";
import { MdBackpack } from "react-icons/md";
import { IoGameController } from "react-icons/io5";
import { GiTwoCoins } from "react-icons/gi";
import { RiAuctionFill, RiMenuFill } from "react-icons/ri";
import { AREA_SELECTOR_STATE, AUCTION_HOUSE_STATE, GAME_STATE, INVENTORY_STATE } from "../../Pages/GamePage";
import NavbarMobileDropdown from "./NavbarMobileDropdown";
import CoinCounter from "../GameComponents/CoinCounter";
import { useNavigate } from "react-router-dom";

export default function NavbarForAdmin({ user, signOut }) {

    const navigate = useNavigate();

    return (
        <Flex
            style={{
                height: 50,
                width: '100%',
                backgroundColor: 'gray',
                top: 0,
                position: 'fixed',
                fontFamily: "'Fredoka', sans-serif",
                zIndex: 999,
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >

            <Flex 
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'start',
                    marginLeft: '15px'
                }}
            >
                <Text size="4" style={{ color: "white", textTransform: 'uppercase', fontWeight: '500', letterSpacing: '2px' }}>Admin</Text>
            </Flex>

            <Flex
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'end',
                    gap: 15
                }}
            >
                <Text size="4" style={{ color: "white" }}>{user.username}</Text>

                <DropdownMenu.Root>
                    <DropdownNavbarButton icon={<RiMenuFill size={20} />} />

                    <DropdownMenu.Content className="squirkleDropdown" style={{ width: 150, marginTop: -12, marginRight: -20, backgroundColor: "transparent" }}>

                        <Button className="squirkleButton" onClick={() => navigate('/admin/item-management')} style={{ padding: 10, height: '50px', backgroundColor: '#eba62a' }}>
                            <Text weight="bold">Item management</Text>
                        </Button>
                        <Button className="squirkleButton" onClick={() => navigate('/admin/metadata-management')} style={{ padding: 10, height: '50px', backgroundColor: '#eba62a' }}>
                            <Text weight="bold">Metadata management</Text>
                        </Button>
                        <Button className="squirkleButton" onClick={signOut} style={{ padding: 5, backgroundColor: "#ee3c3c", }}>
                            <Text weight="bold">Logout</Text>
                        </Button>

                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </Flex>

        </Flex>
    )

}