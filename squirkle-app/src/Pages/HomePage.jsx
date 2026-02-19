import { Box, Flex } from '@radix-ui/themes';
import GameWindow from '../components/GameWindow';
import Navbar from '../components/Navbar';

export default function HomePage() {
    return (
        <Flex className='contentContainer'>
            <Box className='navbarSpacer' />

            <Flex style={{
                flex: 1,
                width: '100%',
                overflow: 'hidden',
                height: 'calc(100vh - 60px)',
            }}>
                <GameWindow />
            </Flex>
            
        </Flex>
    )
}