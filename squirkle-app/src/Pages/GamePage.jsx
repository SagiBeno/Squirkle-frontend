import { Box, Dialog, Flex } from '@radix-ui/themes';
import GameWindow from '../components/GameWindow';
import Navbar from '../components/Navbar';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { areas } from '../AreaData';
import GameAreaPanel from '../components/GameAreaPanel';

export default function GamePage({ user, signOut }) {

    const navigate = useNavigate()

    useEffect(() => {
        if (user == null) {
            navigate("/")
        }
    }, [user])

    return (
        <Dialog.Root>
            <Navbar user={user} signOut={signOut} />
            <Flex className='mainContainer'>

                <Box className='navbarSpacer' />

                <Flex className='contentContainer'>
                    <GameWindow user={user}/>
                </Flex>
            </Flex>

            <Dialog.Content maxWidth="450px" style={{padding: 0, borderRadius: 0, boxShadow: "none", backgroundColor: "transparent", overflow: "auto"}}>
                <Dialog.Title style={{textAlign: "center", marginTop: 15, color: "white"}}>SELECT A NEW AREA</Dialog.Title>
                
                <Flex direction="column" style={{maxHeight: 300, overflowY: "scroll", scrollSnapType: "y mandatory"}}>
                {
                    areas.map(x => <GameAreaPanel key={x.id} areaData={x}/>)
                }
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}