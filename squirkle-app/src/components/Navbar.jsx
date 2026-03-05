import { Flex, Text } from "@radix-ui/themes";
import { NavbarButton } from "./Buttons";
import { FaMap } from "react-icons/fa";
import { MdBackpack } from "react-icons/md";
import { IoGameController } from "react-icons/io5";
import { RiAuctionFill } from "react-icons/ri";

export default function Navbar ({user}) {
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
            <NavbarButton icon={<IoGameController size={32}/>}/>
            
            {/* area chooser */}
            <NavbarButton icon={<FaMap size={32}/>}/>
            
            {/* inventory */}
            <NavbarButton icon={<MdBackpack size={32}/>}/>
            
            {/* auction house */}
            <NavbarButton icon={<RiAuctionFill size={32}/>}/>

            <div style={{flex: 1}}/>
            
            <Text size="6" style={{color: 'white', fontWeight: '500'}}>{user?.username}</Text>
        </Flex>
    )
}