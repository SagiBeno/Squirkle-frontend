import { Box, Flex } from '@radix-ui/themes';
import GameWindow from '../components/GameWindow';
import Navbar from '../components/Navbar';

export default function HomePage() {
    return (
        <Flex className='mainContainer'>

            <Box className='navbarSpacer' />
            
            <Flex className='contentContainer'>
                <GameWindow />
            </Flex>
        </Flex>
    )
}