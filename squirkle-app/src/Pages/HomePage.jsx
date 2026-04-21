import { Box, Flex, Text, Button } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { cardData } from '../HomePageCardData';
import HomePageCard from '../components/Cards/HomePageCard';
import { FaPlay } from "react-icons/fa";

export default function HomePage({user, setShowAppLoader}) {
    const navigate = useNavigate();

    useEffect(() => {
        setShowAppLoader(false);
    }, [])

    return (
        <Flex className='mainContainer'>
            
            <Flex className='contentContainer'>
                
                <Flex
                    style={{
                        margin: "auto",
                        flexDirection: 'column',
                        textAlign: 'center',
                        gap: 20
                    }}
                >
                    <Text size="9" style={{color: 'white', fontWeight: '500'}}>Squirkle</Text>
                    <Text size="5" style={{color: 'white', opacity: '0.6'}}>Slice enemies. Collect loot. Become stronger.</Text>
                    <Flex
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            marginTop: '10px',
                            gap: 10
                        }}
                    >
                        <Button
                            onClick={() => {
                                console.log(user)
                                if (user !== null) navigate('/game');
                                else navigate("/login")
                            }}
                            className='activeButton'
                            style={{
                                padding: '30px',
                                fontSize: "30px",
                                backgroundColor: 'darkgray',
                                borderBottom: '8px rgba(0, 0, 0, 0.2) solid',
                                color: 'black',
                                fontFamily: '"Fredoka", sans-serif',
                            }}
                        >
                           <FaPlay /> Play
                        </Button>
                    </Flex>

                    <Text size="5" style={{color: 'white', opacity: '0.6' }}>Create an account to save your progress and trade items.</Text>
                    
                    <Flex
                        style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginTop: '20px'
                        }}
                    >
                        <Text size="7" style={{color: 'white', fontWeight: '500', textAlign: 'center'}}>Why join Squirkle?</Text>
                        
                        <Flex
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                gap: 20,
                                flexWrap: 'wrap',
                                marginTop: '25px'
                            }}
                        >
                            {
                                cardData.length > 0 && cardData.map((data, idx) => <HomePageCard data={data} key={idx} />)
                            }
                        </Flex>
                    </Flex>
                </Flex>

            </Flex>
        </Flex>
    )
}