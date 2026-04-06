import { Button, Dialog, Flex, Heading, Text } from '@radix-ui/themes'
import { useEffect, useState } from 'react'

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

    function handleOpenListing(listing) {
        //TODO - open a buying dialog
        console.log('Open listing:', listing);
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
                    <Flex direction="column" style={{ border: '1px solid #d1d5db' }}>
                        <Flex
                            px="3"
                            py="2"
                            align="center"
                            justify="between"
                            style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #d1d5db', fontWeight: 600 }}
                        >
                            <Text size="2" style={{ width: '75%' }}>Item</Text>
                            <Text size="2" style={{ width: '25%', textAlign: 'right' }}>Price</Text>
                        </Flex>

                        {pagedListings.map((listing, index) => (
                            <Flex
                                key={`${listing?.itemName ?? 'listing'}-${startIndex + index}`}
                                px="3"
                                py="2"
                                align="center"
                                justify="between"
                                onClick={() => handleOpenListing(listing)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        handleOpenListing(listing);
                                    }
                                }}
                                style={{
                                    borderBottom: index === pagedListings.length - 1 ? 'none' : '1px solid #e5e7eb',
                                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                                    cursor: 'pointer'
                                }}
                            >
                                <Flex align="center" gap="3" style={{ width: '75%', minWidth: 0 }}>
                                    <img
                                        src={listing.itemImageUrl}
                                        alt={listing.itemName}
                                        style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                                    />

                                    <Flex direction="column" style={{ minWidth: 0 }}>
                                        <Heading size="3" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {listing.itemName}
                                        </Heading>
                                        <Text size="2" color="gray" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            Seller: {listing.username}
                                        </Text>
                                    </Flex>
                                </Flex>

                                <Text style={{ width: '25%', textAlign: 'right', fontWeight: 600 }}>{listing.price}</Text>
                            </Flex>
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
