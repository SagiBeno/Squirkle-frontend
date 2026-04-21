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

    const [isBig, setIsBig] = useState(
        window.matchMedia("(min-width: 780px)").matches
    )

    useEffect(() => {
        window
        .matchMedia("(min-width: 780px)")
        .addEventListener('change', e => setIsBig( e.matches ));
    }, []);

    console.log(isBig)

    return (
        <Flex className='mainContainer'>
            
            <Flex className='contentContainer'>
                
                <Flex direction="row" gap="5" justify="center" wrap="wrap-reverse" style={{width: "100%", marginTop: 100}}>
                    <Flex direction="column" gap="5" style={{ textAlign: 'right', marginTop: 20, padding: 20 }}>
                        <Text size="9" style={{color: 'white', fontWeight: '500'}}>Squirkle</Text>
                        <Text size="5" style={{color: 'white', opacity: '0.6'}}>Slice enemies. Collect loot. Become stronger.</Text>
                        <Flex
                            style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: 'right',
                                alignItems: "center",
                                height: "80px",
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

                        <Text size="3" style={{color: 'white', opacity: '0.6' }}>Create an account to start playing!</Text>
                    </Flex>
                    
                    <Flex className='homePageGamePreview' style={isBig ? {width: 320, height: 320} : {width: "100%", flexGrow: 1, height: 200}}>
                        {/* <img src="" style={{display: "flex", maxWidth: "100%", boxShadow: "0 0 20px rgba(0, 0, 0, 0.25)", borderRadius: 5}}/> */}
                    </Flex>
                </Flex>

                <Flex
                    style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: 60,
                        padding: 20
                    }}
                >
                    <Text size="7" style={{color: 'white', fontWeight: '500', textAlign: 'center'}}>Squirkle - An Incremental RPG</Text>
                    
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
    )
}