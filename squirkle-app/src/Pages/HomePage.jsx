import { Box, Flex } from '@radix-ui/themes';
import GameWindow from '../components/GameWindow';
import Navbar from '../components/Navbar';

export default function HomePage() {
    return (
        <Flex
            style={{
                width: '100%',
                height: '100%',
                flexDirection: 'column',
            }}
        >
            <Navbar />
            <Flex
                className='contentContainer'
            >
                <GameWindow />
            </Flex>
        </Flex>
        


    )
}