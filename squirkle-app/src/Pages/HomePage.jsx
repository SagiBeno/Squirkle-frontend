import { Box, Flex, Text, Button } from '@radix-ui/themes';
import GameWindow from '../components/GameWindow';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <Flex className='mainContainer'>

            <Box className='navbarSpacer' />
            
            <Flex className='contentContainer'>
                
                <Flex
                    style={{
                        margin: "auto",
                        flexDirection: 'column',
                        textAlign: 'center',
                    }}
                >
                    <Text size="9" style={{color: 'white', fontWeight: '500'}}>Squirkle</Text>
                    <Flex
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            marginTop: '10px'
                        }}
                    >
                        <Button
                            size="4"
                            radius='full'
                            style={{
                                marginRight: '5px',
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate("/login")}
                        >
                            Sign in
                        </Button>

                        <Button
                            size="4"
                            radius='full'
                            onClick={() => navigate("/register")}
                            style={{
                                cursor: 'pointer'
                            }}
                        >
                            Sign up
                        </Button>
                    </Flex>
                </Flex>

            </Flex>
        </Flex>
    )
}