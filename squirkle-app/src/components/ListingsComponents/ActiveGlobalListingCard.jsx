import { Flex, Heading, Text } from "@radix-ui/themes";
import { GiTwoCoins } from "react-icons/gi";

export default function ActiveGlobalListingCard({ listing, idx, handleOpenListing }) {

    return (

        <Flex
            style={{
                background: idx % 2 === 0 ? '#aeaeae' : '#d8d8d8',
                color: 'black',
                boxShadow: 'none',
                flexDirection: 'column',
                padding: '10px',
                borderRadius: '10px',
                fontFamily: `"Fredoka", sans-serif`
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
                        style={{ width: 64, height: 48, objectFit: 'cover', flexShrink: 0, }}
                    />

                    <Flex direction="column" style={{ gap: 4 }}>
                        <Heading size="4" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: `"Fredoka", sans-serif`, letterSpacing: '1px', }}>
                            {listing.itemName}
                        </Heading>
                        {
                            listing?.username && <Text size='3' style={{ opacity: '0.7' }}>Seller: {listing.username}</Text>
                        }

                    </Flex>
                </Flex>

                <Flex style={{ alignItems: 'center', gap: 4, color: 'rgb(255, 233, 35)', background: 'rgba(0, 0, 0, 0.59)', padding: '5px', borderRadius: '10px' }}>
                    <GiTwoCoins size={30} />
                    <Text style={{ fontSize: '20px', fontWeight: 'bold', }}>{listing.price} </Text>
                </Flex>
            </Flex>
        </Flex>

    )
}