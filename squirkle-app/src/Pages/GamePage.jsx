import { Box, Flex } from '@radix-ui/themes';
import GameWindow from '../components/GameWindow';
import Navbar from '../components/Navbar';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GamePage({ user, signOut }) {

    const navigate = useNavigate()

    useEffect(() => {
        if (user == null) {
            navigate("/")
        }
    }, [user])

    return (
        <>
            <Navbar user={user} signOut={signOut} />
            <Flex className='mainContainer'>

                <Box className='navbarSpacer' />

                <Flex className='contentContainer'>
                    <GameWindow user={user}/>
                </Flex>
            </Flex>
        </>
    )
}