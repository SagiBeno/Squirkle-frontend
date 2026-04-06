import { Button, Dialog, Flex, Heading, Text, TextField } from '@radix-ui/themes'
import { useEffect, useState } from 'react'

import GameSpinner from '../GameSpinner'

const ITEMS_PER_PAGE = 8

function placeholderFetch(payload) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ ok: true, data: payload });
        }, 700);
    });
}

//TODO - create a normal create listing item chooser menu with drowpdown and item details

export default function AuctionHouseDialog({ user }) {
    const [listings, setListings] = useState([]);
    const [globalListings, setGlobalListings] = useState([]);
    const [myListings, setMyListings] = useState([]);

    const [activeTab, setActiveTab] = useState('global');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
    const [isBuyListingOpen, setIsBuyListingOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);

    const [createListingForm, setCreateListingForm] = useState({
        itemName: '',
        itemImageUrl: '',
        price: ''
    });

    const [createLoading, setCreateLoading] = useState(false);
    const [buyLoading, setBuyLoading] = useState(false);

    const totalPages = Math.max(1, Math.ceil(listings.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pagedListings = listings.slice(startIndex, endIndex);

    const userIdentifier = user?.username || user?.name || user?.email || 'You';

    function filterMyListings(sourceListings) {
        const lowerUserIdentifier = String(userIdentifier).toLowerCase();

        return sourceListings.filter((listing) => {
            const seller = String(listing?.username || listing?.seller || listing?.email || '').toLowerCase();
            return seller === lowerUserIdentifier;
        });
    }

    function syncListings(nextGlobalListings) {
        const nextMyListings = filterMyListings(nextGlobalListings);

        setGlobalListings(nextGlobalListings);
        setMyListings(nextMyListings);
        setListings(activeTab === 'mine' ? nextMyListings : nextGlobalListings);
        setCurrentPage(1);
    }

    useEffect(() => {
        function fetchListings() {
            fetch('https://squirkle-backend.vercel.app/api/get-all-listings')
                .then(response => response.json())
                .then(data => {
                    const fetchedListings = Array.isArray(data.listings) ? data.listings : [];
                    const nextMyListings = filterMyListings(fetchedListings);

                    setGlobalListings(fetchedListings);
                    setMyListings(nextMyListings);
                    setListings(activeTab === 'mine' ? nextMyListings : fetchedListings);

                    setCurrentPage(1);
                    setLoading(false);
                    console.log('Fetched listings:', fetchedListings);
                })
                .catch(error => console.error('Error fetching listings:', error));
        }

        fetchListings();
    }, []);

    function handleSelectTab(nextTab) {
        setActiveTab(nextTab);
        setListings(nextTab === 'mine' ? myListings : globalListings);
        setCurrentPage(1);
    }

    function handleOpenListing(listing) {
        setSelectedListing(listing);
        setIsBuyListingOpen(true);
    }

    function handleCreateListing() {
        setIsCreateListingOpen(true);
    }

    function handleCreateFieldChange(fieldName, fieldValue) {
        setCreateListingForm(prev => ({ ...prev, [fieldName]: fieldValue }));
    }

    async function handleCreateListingSubmit(event) {
        event.preventDefault();

        if (!createListingForm.itemName || !createListingForm.price) {
            return;
        }

        const newListing = {
            itemName: createListingForm.itemName,
            itemImageUrl: createListingForm.itemImageUrl || 'https://placehold.co/128x96?text=Item',
            price: createListingForm.price,
            username: userIdentifier
        };

        setCreateLoading(true);

        try {
            await placeholderFetch({ action: 'create-listing', listing: newListing });
            const nextGlobalListings = [newListing, ...globalListings];
            syncListings(nextGlobalListings);
            setIsCreateListingOpen(false);
            setCreateListingForm({ itemName: '', itemImageUrl: '', price: '' });
        } finally {
            setCreateLoading(false);
        }
    }

    async function handleBuySelectedListing() {
        if (!selectedListing) {
            return;
        }

        setBuyLoading(true);

        try {
            await placeholderFetch({ action: 'buy-listing', listing: selectedListing });
            const nextGlobalListings = globalListings.filter((listing, index) => {
                if (listing === selectedListing) {
                    return false;
                }

                const isSameValues =
                    listing?.itemName === selectedListing?.itemName &&
                    listing?.price === selectedListing?.price &&
                    listing?.username === selectedListing?.username;

                if (!isSameValues) {
                    return true;
                }

                const selectedIndex = globalListings.findIndex((entry) => entry === selectedListing);
                return index !== selectedIndex;
            });

            syncListings(nextGlobalListings);
            setIsBuyListingOpen(false);
            setSelectedListing(null);
        } finally {
            setBuyLoading(false);
        }
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
                <Flex gap="2" justify="center">
                    <Button
                        variant={activeTab === 'global' ? 'solid' : 'soft'}
                        onClick={() => handleSelectTab('global')}
                        style={{ cursor: 'pointer' }}
                    >
                        All Listings
                    </Button>
                    <Button
                        variant={activeTab === 'mine' ? 'solid' : 'soft'}
                        onClick={() => handleSelectTab('mine')}
                        style={{ cursor: 'pointer' }}
                    >
                        My Listings
                    </Button>
                </Flex>

                {loading ? (
                    <GameSpinner />
                ) : pagedListings.length === 0 ? (
                    <Flex align="center" justify="center" style={{ minHeight: 220 }}>
                        <Text color="gray" size="4">
                            {activeTab === 'mine' ? 'You have no active listings yet.' : 'No listings available yet.'}
                        </Text>
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

            <Dialog.Root open={isCreateListingOpen} onOpenChange={setIsCreateListingOpen}>
                <Dialog.Content maxWidth="480px">
                    <Dialog.Title>Create Listing</Dialog.Title>
                    <Dialog.Description size="2" mb="3">
                        Placeholder submit is used until backend endpoints are available.
                    </Dialog.Description>

                    <form onSubmit={handleCreateListingSubmit}>
                        <Flex direction="column" gap="3">
                            <Text as="label" size="2">
                                Item Name
                                <TextField.Root
                                    mt="1"
                                    placeholder="Excalibur"
                                    value={createListingForm.itemName}
                                    onChange={(event) => handleCreateFieldChange('itemName', event.target.value)}
                                    required
                                />
                            </Text>

                            <Text as="label" size="2">
                                Price
                                <TextField.Root
                                    mt="1"
                                    placeholder="1500"
                                    value={createListingForm.price}
                                    onChange={(event) => handleCreateFieldChange('price', event.target.value)}
                                    required
                                />
                            </Text>

                            <Text as="label" size="2">
                                Item Image URL
                                <TextField.Root
                                    mt="1"
                                    placeholder="https://..."
                                    value={createListingForm.itemImageUrl}
                                    onChange={(event) => handleCreateFieldChange('itemImageUrl', event.target.value)}
                                />
                            </Text>
                        </Flex>

                        <Flex gap="3" mt="4" justify="end">
                            <Button type="button" variant="soft" color="gray" onClick={() => setIsCreateListingOpen(false)} disabled={createLoading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createLoading}>
                                {createLoading ? 'Creating...' : 'Create Listing'}
                            </Button>
                        </Flex>
                    </form>
                </Dialog.Content>
            </Dialog.Root>

            <Dialog.Root
                open={isBuyListingOpen}
                onOpenChange={(open) => {
                    setIsBuyListingOpen(open);
                    if (!open) {
                        setSelectedListing(null);
                    }
                }}
            >
                <Dialog.Content maxWidth="520px">
                    <Dialog.Title>Buy Listing</Dialog.Title>
                    <Dialog.Description size="2" mb="3">
                        Placeholder purchase request is used until backend endpoints are available.
                    </Dialog.Description>

                    {selectedListing ? (
                        <Flex direction="column" gap="3">
                            <img
                                src={selectedListing.itemImageUrl}
                                alt={selectedListing.itemName}
                                style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 6 }}
                            />

                            <Flex direction="column" gap="1">
                                <Heading size="4">{selectedListing.itemName}</Heading>
                                <Text color="gray" size="2">Seller: {selectedListing.username}</Text>
                                <Text size="3" style={{ fontWeight: 700 }}>Price: {selectedListing.price}</Text>
                            </Flex>
                        </Flex>
                    ) : (
                        <Text color="gray">No listing selected.</Text>
                    )}

                    <Flex gap="3" mt="4" justify="end">
                        <Button
                            type="button"
                            variant="soft"
                            color="gray"
                            onClick={() => {
                                setIsBuyListingOpen(false);
                                setSelectedListing(null);
                            }}
                            disabled={buyLoading}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleBuySelectedListing} disabled={buyLoading || !selectedListing}>
                            {buyLoading ? 'Buying...' : 'Confirm Purchase'}
                        </Button>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>

        </Dialog.Content>
    )
}
