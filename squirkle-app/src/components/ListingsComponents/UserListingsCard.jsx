import { Flex, Heading, Text, IconButton } from "@radix-ui/themes";
import { GiTwoCoins } from "react-icons/gi";
import { FaTrash } from "react-icons/fa";

/**
 * Card component for displaying one of the current user's marketplace listings.
 *
 * Shows item image, name, buyer name if available, price,
 * and a delete button for active listings.
 *
 * @component
 *
 * @param { Object } props - Component props
 * @param { Object } props.listing - Listing data
 * @param { string } props.listing.itemName - Name of the listed item
 * @param { string } props.listing.itemImageUrl - Image URL of the listed item
 * @param { number } props.listing.price - Listing price
 * @param { boolean } props.listing.active - Whether the listing is still active
 * @param { string } [props.listing.buyerName] - Buyer name for inactive/sold listings
 * @param { number } props.idx - Index used for alternating background styling
 * @param { Function } props.handleOpenListing - Opens listing details
 * @param { Function } props.handleDeleteListing - Opens delete confirmation for the listing
 *
 * @returns { JSX.Element }
 */
export default function UserListingCard({ listing, idx, handleOpenListing, handleDeleteListing }) {

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
                        src={listing?.itemImageUrl}
                        alt={listing?.itemName || "item image"}
                        title={listing?.itemName || "item image"}
                        style={{ cursor: 'pointer', width: 64, height: 48, objectFit: 'cover', flexShrink: 0, }}
                        onClick={() => handleOpenListing(listing)}
                    />

                    <Flex direction="column" style={{ gap: 4 }}>
                        <Heading size="4" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: `"Fredoka", sans-serif`, letterSpacing: '1px' }}>
                            {listing?.itemName}
                        </Heading>
                        {
                            listing?.buyerName && <Text size='4' style={{ opacity: '0.7' }}>Buyer: {listing.buyerName}</Text>
                        }

                    </Flex>
                </Flex>


                <Flex style={{ alignItems: 'center', gap: 4, flexWrap: 'wrap', justifyContent: 'end' }}>

                    <Flex style={{ alignItems: 'center', gap: 4, color: 'rgb(255, 233, 35)', background: 'rgba(0, 0, 0, 0.59)', padding: '5px', height: '35px', borderRadius: '10px' }}>
                        <GiTwoCoins size={30} />
                        <Text style={{ fontSize: '20px', fontWeight: 'bold', }}>{listing?.price}</Text>
                    </Flex>

                    {
                        listing?.active && <IconButton radius="none" style={{ cursor: 'pointer', height: '35px', width: "35px", borderRadius: '10px' }} color='tomato' variant="solid" onClick={() => handleDeleteListing(listing)}><FaTrash /></IconButton>
                    }

                </Flex>
            </Flex>
        </Flex>

    )
}