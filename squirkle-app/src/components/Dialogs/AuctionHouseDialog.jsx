import { Button, Card, Dialog, Flex, Heading, Text } from '@radix-ui/themes'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import GameSpinner from '../GameSpinner'

const ITEMS_PER_PAGE = 8

export default function AuctionHouseDialog({ user }) {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(listings.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pagedListings = listings.slice(startIndex, endIndex);

    useEffect(() => {
        function fetchListings() {
            fetch('https://squirkle-backend.vercel.app/api/get-all-listings')
                .then(response => response.json())
                .then(data => {
                    setListings(data.listings);
                    setCurrentPage(1);
                    setLoading(false);
                    console.log('Fetched listings:', data.listings);
                })
                .catch(error => console.error('Error fetching listings:', error));
        }

        fetchListings();
    }, []);

    function handleOpenListing() {
        //TODO - open a buying dialog
    }

    function handleCreateListing() {
        //TODO - open create listing dialog
    }

    function handleMyListings() {
        //TODO - open my listings dialog
    }

    function goToPreviousPage() {
        setCurrentPage(prev => Math.max(1, prev - 1));
    }

    function goToNextPage() {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    }

    return (
        <Dialog.Content maxWidth="90vw" height="80vh" style={{ padding: 0, borderRadius: 0, boxShadow: "none", backgroundColor: "transparent" }}>
            <Flex align="center" justify="between" px="4" py="3" style={{ backgroundColor: '#1f2937' }}>
                <Dialog.Title style={{ margin: 0, color: "white" }}>AUCTION HOUSE</Dialog.Title>
                <Flex gap="2">
                    <Button
                        onClick={handleMyListings}
                        style={{ cursor: 'pointer', color: 'white' }}
                    >
                        My Listings
                    </Button>
                    <Button
                        onClick={handleCreateListing}
                        style={{ cursor: 'pointer', color: 'white' }}
                    >
                        Create Listing
                    </Button>
                </Flex>
            </Flex>

            <Flex
                direction="column"
                height="calc(100% - 114px)"
                p="3"
                gap="3"
                style={{ backgroundColor: "white", overflow: 'auto' }}
            >
                {loading ? (
                    <GameSpinner />
                ) : pagedListings.length === 0 ? (
                    <Flex align="center" justify="center" style={{ minHeight: 220 }}>
                        <Text color="gray" size="4">No listings available yet.</Text>
                    </Flex>
                ) : (
                    <Flex wrap="wrap" gap="3" style={{ alignContent: 'flex-start' }}>
                        {pagedListings.map((listing, index) => (
                            <Card key={`${listing?.itemName ?? 'listing'}-${startIndex + index}`} size="2" style={{ width: 260 }}>
                                <Flex direction="column" gap="2">
                                    <Heading size="4">{listing.itemName}</Heading>
                                    <Text color="gray">Price: {listing.price}</Text>

                                    <img
                                        src={listing.itemImageUrl}
                                        alt={listing.itemName}
                                        style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 6 }}
                                    />

                                    <Text>Seller: {listing.username}</Text>
                                </Flex>
                            </Card>
                        ))}
                    </Flex>
                )}
            </Flex>

            <Flex align="center" justify="between" px="4" py="3" style={{ backgroundColor: '#f8f8f8', borderTop: '1px solid #e5e7eb' }}>
                <Button onClick={goToPreviousPage} disabled={loading || currentPage === 1}>Previous</Button>
                <Text>
                    Page {currentPage} / {totalPages}
                </Text>
                <Button onClick={goToNextPage} disabled={loading || currentPage >= totalPages}>Next</Button>
            </Flex>

        </Dialog.Content>
    )
}
