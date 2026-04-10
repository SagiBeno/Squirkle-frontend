import { ScrollArea, Flex, Text } from "@radix-ui/themes";
import UserListingCard from "./UserListingsCard";

export default function ListingsComponentsForUser({ activeListings, inactiveListings, handleOpenListing }) {

    return (
        <>

            {
                activeListings.length === 0
                    ?
                    <Flex>
                        <Text size="5" style={{ color: 'white', margin: '10px auto 20px auto' }}>You have no active listing yet.</Text>
                    </Flex>
                    :
                    <>
                        <Flex direction="column" style={{ borderRadius: '12px', backgroundColor: '#646465', color: 'white' }}>
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
                                <Text style={{ width: '25%', textAlign: 'right' }}>Price</Text>
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
                                    activeListings.map((listing, index) => <UserListingCard key={listing.id} listing={listing} idx={index} handleOpenListing={handleOpenListing} />)
                                }
                            </Flex>
                        </ScrollArea>
                    </>

            }

            {
                inactiveListings.length !== 0
                &&
                <>
                    <Flex direction="column" style={{ borderRadius: '12px', backgroundColor: '#646465', color: 'white', }}>
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
                            <Text style={{ width: '75%' }}>Inactive listing(s)</Text>
                            <Text style={{ width: '25%', textAlign: 'right' }}>Price</Text>
                        </Flex>
                    </Flex>
                    <ScrollArea
                        type='auto'
                        scrollbars="vertical"
                        style={{
                            minHeight: '220px',
                            borderRadius: '12px',
                            paddingRight: '20px',
                        }}
                    >
                        <Flex style={{ padding: '10px', flexDirection: 'column', gap: 4 }}>
                            {
                                inactiveListings.map((listing, index) => <UserListingCard key={listing.id} listing={listing} idx={index} handleOpenListing={handleOpenListing} />)
                            }
                        </Flex>
                    </ScrollArea>
                </>

            }

        </>

    )
}