import { ScrollArea, Flex, Text } from "@radix-ui/themes";
import InactiveGlobalListingCard from "./ActiveGlobalListingCard";
import { useState, useEffect } from "react";

export default function ListingsContainerForGlobalInactive({ inactiveListings, handleOpenListing }) {

    const [isMobile, setIsMobile] = useState(false);

    function handleResize () {
        if (window.innerHeight < 500) setIsMobile(true);
        else setIsMobile(false);
    }

    window.addEventListener('resize', handleResize);

    useEffect(() => {
        handleResize();
    }, []);

    return (
        <>

            {
                inactiveListings.length === 0
                    ?
                    <Flex>
                        <Text size="5" style={{ color: 'white', margin: '10px auto 20px auto' }}>No previous listing yet.</Text>
                    </Flex>
                    :
                    !isMobile ?
                        <>
                            <Flex
                                direction="row"
                                style={{
                                    backgroundColor: '#646465',
                                    color: 'white',
                                    borderRadius: '10px',
                                    justifyContent: 'start',
                                    padding: '10px',
                                    fontFamily: `"Fredoka", sans-serif`,
                                    borderBottom: '8px solid #494949'
                                }}
                            >
                                <Text size='4' style={{ fontWeight: '550', letterSpacing: '1px' }}>Previous listing(s)</Text>
                            </Flex>
                            <ScrollArea type="auto" style={{ padding: '10px 20px' }}>
                                <Flex style={{ flexDirection: 'column', gap: 4 }}>
                                    {
                                        inactiveListings.map((listing, index) => <InactiveGlobalListingCard key={listing.id} listing={listing} idx={index} handleOpenListing={handleOpenListing} />)
                                    }
                                </Flex>
                            </ScrollArea>
                        </>
                        :
                        <>
                            <Flex
                                direction="row"
                                style={{
                                    backgroundColor: '#646465',
                                    color: 'white',
                                    borderRadius: '10px',
                                    justifyContent: 'start',
                                    padding: '10px',
                                    fontFamily: `"Fredoka", sans-serif`,
                                    marginBottom: '10px',
                                    borderBottom: '8px solid #494949'
                                }}
                            >
                                <Text size='4' style={{ fontWeight: '550', letterSpacing: '1px' }}>Previous listing(s)</Text>
                            </Flex>
                            <Flex style={{ flexDirection: 'column', gap: 4, padding: '0px 10px' }}>
                                {
                                    inactiveListings.map((listing, index) => <InactiveGlobalListingCard key={listing.id} listing={listing} idx={index} handleOpenListing={handleOpenListing} />)
                                }
                            </Flex>
                        </>


            }
        </>

    )
}