import { Flex, Heading, Text, IconButton } from "@radix-ui/themes";
import { GiTwoCoins } from "react-icons/gi";
import { FaTrash } from "react-icons/fa";

export default function UserListingCard({ listing, idx, handleOpenListing, handleDeleteListing }) {

    return (

        <Flex
            style={{
                background: idx % 2 === 0 ? '#aeaeae' : '#d8d8d8',
                color: 'black',
                boxShadow: 'none',
                flexDirection: 'column',
                padding: '10px'
            }}
        >
            <Flex
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 5,
                }}
            >
                <Flex
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                        flexWrap: 'wrap',
                    }}
                >
                    <img
                        src={listing.itemImageUrl}
                        alt={listing.itemName}
                        style={{ cursor: 'pointer', width: 64, height: 48, objectFit: 'cover', flexShrink: 0, }}
                        onClick={() => handleOpenListing(listing)}
                    />

                    <Flex direction="column" style={{ gap: 4 }}>
                        <Heading size="3" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {listing.itemName}
                        </Heading>
                        {
                            listing?.buyerName && <Text size='2' style={{ opacity: '0.6' }}>Buyer: {listing.buyerName}</Text>
                        }

                    </Flex>
                </Flex>


                <Flex style={{ alignItems: 'center', gap: 4, flexWrap: 'wrap', justifyContent: 'end' }}>

                    <Flex style={{ alignItems: 'center', gap: 4, color: 'rgb(255, 233, 35)', background: 'rgba(0, 0, 0, 0.59)', padding: '5px', height: '35px' }}>
                        <GiTwoCoins size={30} />
                        <Text style={{ fontSize: '20px', fontWeight: 'bold', }}>{listing.price}</Text>
                    </Flex>

                    {
                        listing.active && <IconButton radius="none" style={{ cursor: 'pointer', height: '35px', width: "35px" }} color='tomato' variant="solid" onClick={() => handleDeleteListing(listing)}><FaTrash /></IconButton>
                    }

                </Flex>
            </Flex>
        </Flex>

    )
}