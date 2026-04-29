import { Box, Flex, Text, Button, Link, ScrollArea } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { cardData } from '../HomePageCardData';
import HomePageCard from '../components/Cards/HomePageCard';
import GameLogo from '../components/GameLogo';
import { FaPlay } from "react-icons/fa";
import { BiSolidDownArrow } from "react-icons/bi";

/**
 * Home page component.
 * 
 * Display the landing page of the application with a hort game description,
 * a play button, and informational cards about the game.
 * 
 * Handles responsive layout changes and redirects users to the game
 * or login page depending on authentication state.
 * 
 * @component
 * 
 * @param { Object } props - Component props
 * @param { Object | null } props.user - Currently authenticated user objet, or null if not logged in
 *  
 * @returns { JSX.Element } Home page UI
 */

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

    return (
        <Flex className='mainContainer'>
            
            <ScrollArea scrollbars="vertical" className='contentContainer' type='auto' style={{ paddingRight: '10px' }}>
                
                <Flex direction="row" gap="5" justify="center" wrap={isBig ? "wrap" : "wrap-reverse"} style={isBig ? {width: "100%", marginTop: 100, minHeight: "calc(100vh - 100px)", position: "relative"} : {width: "100%", minHeight: "100vh", position: "relative"}}>
                    <Flex direction="column" gap="5" style={{ textAlign: 'right', marginTop: 20, padding: 20 }}>
                        <GameLogo width={isBig ? 360 : "100%"} style={{ marginLeft: "auto", maxWidth: 400 }} />
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
                                    if (user !== null) navigate('/game');
                                    else navigate("/login")
                                }}
                                className='activeButton'
                                style={{
                                    padding: '30px',
                                    fontSize: "30px",
                                    backgroundColor: '#a9a9bd',
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
                    
                    <Flex className='homePageGamePreview' style={isBig ? {width: 320, height: 320} : {width: "100%", minHeight: 320}} />

                    {
                        !isBig ? null : <Flex direction="column" align="center" style={{position: "absolute", bottom: 100}}>
                            <Text size="3" style={{color: 'white', opacity: '0.4' }}>Learn more about the game</Text>
                            <BiSolidDownArrow color='white' opacity="0.2" size={32}/>
                        </Flex>
                    }
                </Flex>

                <Flex
                    style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: 20,
                        marginBottom: 40
                    }}
                >
                    <Text size="7" style={{color: 'white', fontWeight: '500', textAlign: 'center'}}>Squirkle</Text>
                    <Text size="4" style={{color: 'white', fontWeight: '500', textAlign: 'center', opacity: '0.6'}}>An Fruit Ninja inspired Incremental RPG</Text>
                    
                    <Flex
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
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

                <Flex gap="2" style={{ alignItems: 'center', justifyContent: 'center' , padding: 15, paddingTop: 10, backdropFilter: 'blur(10px)', boxShadow: '0px 0px 20px 5px rgba(0, 0, 0, 0.25)', borderTopLeftRadius: 10, borderTopRightRadius: 10, flexWrap: 'wrap', maxWidth: '400px', margin: '0 auto'}}>
                    <Text size="3" style={{color: 'white', opacity: '0.6' }}>Made by:</Text>
                    <Link style={{ color: 'white', opacity: '0.6' }} target='_blank' href='https://github.com/hajos8/'>@hajos8</Link>
                    <Link style={{ color: 'white', opacity: '0.6' }} target='_blank' href='https://github.com/kristoffred/'>@Kristoff Red</Link>
                    <Link style={{ color: 'white', opacity: '0.6' }} target='_blank' href='https://github.com/sagibeno'>@SagiBeno</Link>
                </Flex>
            </ScrollArea>
        </Flex>
    )
}
