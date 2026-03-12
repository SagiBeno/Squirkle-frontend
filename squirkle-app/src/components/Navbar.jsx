import { Dialog, Flex, Text } from "@radix-ui/themes";
import { LogoutButton, NavbarButton } from "./Buttons";
import { FaMap } from "react-icons/fa";
import { MdBackpack } from "react-icons/md";
import { IoGameController } from "react-icons/io5";
import { RiAuctionFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { AREA_SELECTOR_STATE, AUCTION_HOUSE_STATE, GAME_STATE, INVENTORY_STATE } from "../Pages/GamePage";

export default function Navbar ({user, signOut, setDialogState}) {

    const navigate = useNavigate()

    return (
        <Flex
            align="center"
            direction="row"
            style={{
                height: '60px',
                width: '100%',
                backgroundColor: 'gray',
                top: 0,
                position: 'fixed',
                paddingRight: 15,
                fontFamily: "'Fredoka', sans-serif",
            }}
        >
            {/* game */}            
            <NavbarButton icon={<IoGameController size={32}/>} onClick={() => setDialogState(GAME_STATE)}/>
            
            {/* area chooser */}
            <Dialog.Trigger>
                <NavbarButton icon={<FaMap size={32}/>} onClick={() => setDialogState(AREA_SELECTOR_STATE)}/>
            </Dialog.Trigger>
            
            {/* inventory */}
            <Dialog.Trigger>
                <NavbarButton icon={<MdBackpack size={32}/>} onClick={() => setDialogState(INVENTORY_STATE)}/>
            </Dialog.Trigger>

            {/* auction house */}
            <Dialog.Trigger>
                <NavbarButton icon={<RiAuctionFill size={32}/>} onClick={() => setDialogState(AUCTION_HOUSE_STATE)}/>
            </Dialog.Trigger>

            <div style={{flex: 1}}/>
            
            {user == null ? null : <LogoutButton text="Logout" onClick={signOut}/>}

            <Text size="6" style={{color: 'white', fontWeight: '500'}}>{user?.username}</Text>
        </Flex>
    )
}