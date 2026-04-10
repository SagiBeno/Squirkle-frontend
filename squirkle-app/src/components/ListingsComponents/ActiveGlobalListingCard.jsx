import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import { GiTwoCoins } from "react-icons/gi";

export default function ActiveGlobalListingCard({ listing, idx, handleOpenListing }) {

    return (

        <Card
            style={{
                background: idx % 2 === 0 ? '#787878' : '#272626',
                color: 'black',
                borderRadius: '12px',
                cursor: 'pointer'
            }}

            onClick={() => handleOpenListing(listing)}
        >

            <Flex
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 5
                }}
            >
                <Flex
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                        flexWrap: 'wrap'
                    }}
                >
                    <img
                        src={listing.itemImageUrl}
                        alt={listing.itemName}
                        style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 4, flexShrink: 0, boxShadow: '0px 0px 3px 0px black' }}
                    />

                    <Flex direction="column" style={{ gap: 4}}>
                        <Heading size="3" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {listing.itemName}
                        </Heading>
                        {
                            listing?.username && <Text size='2' style={{ opacity: '0.6' }}>Seller: {listing.username}</Text>
                        }

                    </Flex>
                </Flex>

                <Flex style={{ alignItems: 'center', gap: 4, color: 'rgb(255, 233, 35)', background: 'rgba(0, 0, 0, 0.59)', borderRadius: '12px', padding: '5px' }}>
                    <Text style={{ fontSize: '20px', fontWeight: 'bold', }}>{listing.price} </Text>
                    <GiTwoCoins size={30} />
                </Flex>



            </Flex>

        </Card>

    )
}