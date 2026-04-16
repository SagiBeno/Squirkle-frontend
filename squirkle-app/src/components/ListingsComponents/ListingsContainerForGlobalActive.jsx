import { ScrollArea, Flex, Text } from "@radix-ui/themes";
import ActiveGlobalListingCard from "./ActiveGlobalListingCard";

export default function ListingsContainerForGlobalActive({ activeListings, handleOpenListing }) {

    return (
        <>

            {
                activeListings.length === 0
                    ?
                    <Flex>
                        <Text size="5" style={{ color: 'white', margin: '10px auto 20px auto' }}>No active listing yet.</Text>
                    </Flex>
                    :
                    <>
                        <Flex direction="column" style={{ backgroundColor: '#646465', color: 'white' }}>
                            <Flex
                                px="3"
                                py="2"
                                align="center"
                                justify="between"
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: '18px',
                                }}
                            >
                                <Text style={{ width: '75%' }}>Active listing(s)</Text>
                            </Flex>
                        </Flex>
                        <ScrollArea
                            type='auto'
                            scrollbars="vertical"
                            style={{
                                minHeight: '220px',
                                borderRadius: '12px',
                                paddingRight: '20px',
                                marginBottom: '20px'
                            }}
                        >
                            <Flex style={{ padding: '10px', flexDirection: 'column', gap: 4 }}>
                                {
                                    activeListings.map((listing, index) => <ActiveGlobalListingCard key={listing.id} listing={listing} idx={index} handleOpenListing={handleOpenListing} />)
                                }
                            </Flex>
                        </ScrollArea>
                    </>

            }
        </>

    )
}