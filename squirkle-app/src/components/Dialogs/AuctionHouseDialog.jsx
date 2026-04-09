import { Button, Dialog, Flex, Heading, Text, TextField } from '@radix-ui/themes'
import { useEffect, useState } from 'react'

import GameSpinner from '../GameSpinner'

const ITEMS_PER_PAGE = 8

const API_BASE_URL = 'https://squirkle-backend.vercel.app/api'

async function fetchJsonOrThrow(url, options) {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.error || 'Request failed');
    }

    return data;
}

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
        itemId: '',
        userItemId: '',
        price: ''
    });
    const [createCandidates, setCreateCandidates] = useState([]);
    const [createCandidatesLoading, setCreateCandidatesLoading] = useState(false);

    const [createLoading, setCreateLoading] = useState(false);
    const [buyLoading, setBuyLoading] = useState(false);

    const totalPages = Math.max(1, Math.ceil(listings.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pagedListings = listings.slice(startIndex, endIndex);

    const userIdentifier = user?.username || user?.name || user?.email || 'You';
    const userId = user?.user?.uid || user?.uid || user?.user?.user?.uid || null;

    const selectedCreateItem = createCandidates.find((item) => item.userItemId === createListingForm.userItemId) || null;

    async function fetchListings() {
        try {
            const data = await fetchJsonOrThrow(`${API_BASE_URL}/get-all-listings`);
            const fetchedListings = Array.isArray(data.listings) ? data.listings : [];
            const nextMyListings = filterMyListings(fetchedListings);

            setGlobalListings(fetchedListings);
            setMyListings(nextMyListings);
            setListings(activeTab === 'mine' ? nextMyListings : fetchedListings);
            setCurrentPage(1);
        } catch (error) {
            console.error('Error fetching listings:', error);
            setGlobalListings([]);
            setMyListings([]);
            setListings([]);
        } finally {
            setLoading(false);
        }
    }

    function filterMyListings(sourceListings) {
        if (userId) {
            return sourceListings.filter((listing) => String(listing?.userId || '').trim() === String(userId).trim());
        }

        const lowerUserIdentifier = String(userIdentifier).toLowerCase();
        return sourceListings.filter((listing) => String(listing?.username || '').toLowerCase() === lowerUserIdentifier);
    }

    function syncListings(nextGlobalListings) {
        const nextMyListings = filterMyListings(nextGlobalListings);

        setGlobalListings(nextGlobalListings);
        setMyListings(nextMyListings);
        setListings(activeTab === 'mine' ? nextMyListings : nextGlobalListings);
        setCurrentPage(1);
    }

    useEffect(() => {
        fetchListings();
    }, [userId]);

    function handleSelectTab(nextTab) {
        setActiveTab(nextTab);
        setListings(nextTab === 'mine' ? myListings : globalListings);
        setCurrentPage(1);
    }

    function handleOpenListing(listing) {
        setSelectedListing(listing);
        setIsBuyListingOpen(true);
    }

    async function handleCreateListing() {
        if (!userId) {
            return;
        }

        setIsCreateListingOpen(true);
        setCreateCandidatesLoading(true);

        try {
            const [inventoryData, listedIdsData] = await Promise.all([
                fetchJsonOrThrow(`${API_BASE_URL}/get-inventory/${encodeURIComponent(userId)}`),
                fetchJsonOrThrow(`${API_BASE_URL}/get-listed-user-item-ids/${encodeURIComponent(userId)}`),
            ]);

            const listedIds = new Set((listedIdsData?.userItemIds || []).map((id) => String(id).trim()));
            const inventoryItems = Array.isArray(inventoryData?.items) ? inventoryData.items : [];

            const availableItems = inventoryItems.filter((item) => !listedIds.has(String(item?.userItemId || '').trim()));
            setCreateCandidates(availableItems);

            if (availableItems.length > 0) {
                setCreateListingForm((prev) => ({
                    ...prev,
                    itemId: availableItems[0].itemId,
                    userItemId: availableItems[0].userItemId,
                    price: prev.price,
                }));
            } else {
                setCreateListingForm((prev) => ({ ...prev, itemId: '', userItemId: '' }));
            }
        } catch (error) {
            console.error('Failed to fetch create listing candidates:', error);
            setCreateCandidates([]);
            setCreateListingForm((prev) => ({ ...prev, itemId: '', userItemId: '' }));
        } finally {
            setCreateCandidatesLoading(false);
        }
    }

    function handleCreateFieldChange(fieldName, fieldValue) {
        if (fieldName === 'userItemId') {
            const selectedItem = createCandidates.find((candidate) => candidate.userItemId === fieldValue);
            setCreateListingForm((prev) => ({
                ...prev,
                userItemId: fieldValue,
                itemId: selectedItem?.itemId || '',
            }));
            return;
        }

        setCreateListingForm(prev => ({ ...prev, [fieldName]: fieldValue }));
    }

    async function handleCreateListingSubmit(event) {
        event.preventDefault();

        if (!userId || !createListingForm.itemId || !createListingForm.userItemId || !createListingForm.price) {
            return;
        }

        setCreateLoading(true);

        try {
            await fetchJsonOrThrow(`${API_BASE_URL}/create-listing`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    itemId: createListingForm.itemId,
                    userItemId: createListingForm.userItemId,
                    price: Number(createListingForm.price),
                }),
            });

            setLoading(true);
            await fetchListings();
            setIsCreateListingOpen(false);
            setCreateListingForm({ itemId: '', userItemId: '', price: '' });
            setCreateCandidates([]);
        } catch (error) {
            console.error('Failed to create listing:', error);
        } finally {
            setCreateLoading(false);
        }
    }

    async function handleBuySelectedListing() {
        if (!selectedListing) {
            return;
        }

        if (!userId) {
            return;
        }

        setBuyLoading(true);

        try {
            await fetchJsonOrThrow(`${API_BASE_URL}/buy-listing/${encodeURIComponent(selectedListing.id)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            setLoading(true);
            await fetchListings();
            setIsBuyListingOpen(false);
            setSelectedListing(null);
        } catch (error) {
            console.error('Failed to buy listing:', error);
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
                        Select one of your inventory items and set a price.
                    </Dialog.Description>

                    <form onSubmit={handleCreateListingSubmit}>
                        <Flex direction="column" gap="3">
                            <Text as="label" size="2">
                                Inventory Item
                                <select
                                    style={{ marginTop: 4, width: '100%', height: 36, borderRadius: 6, border: '1px solid #d1d5db', padding: '0 8px' }}
                                    value={createListingForm.userItemId}
                                    onChange={(event) => handleCreateFieldChange('userItemId', event.target.value)}
                                    disabled={createCandidatesLoading || createCandidates.length === 0}
                                    required
                                >
                                    {createCandidates.length === 0 ? (
                                        <option value="">No available inventory items</option>
                                    ) : (
                                        createCandidates.map((item) => (
                                            <option key={item.userItemId} value={item.userItemId}>
                                                {item.name} ({item.type})
                                            </option>
                                        ))
                                    )}
                                </select>
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

                            {selectedCreateItem && (
                                <Flex direction="column" gap="2" style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 6, padding: 10 }}>
                                    <img
                                        src={selectedCreateItem.imageUrl}
                                        alt={selectedCreateItem.name}
                                        style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 6 }}
                                    />
                                    <Heading size="3">{selectedCreateItem.name}</Heading>
                                    <Text size="2" color="gray">Type: {selectedCreateItem.type}</Text>
                                    {selectedCreateItem.description && (
                                        <Text size="2" color="gray">{selectedCreateItem.description}</Text>
                                    )}
                                </Flex>
                            )}
                        </Flex>

                        <Flex gap="3" mt="4" justify="end">
                            <Button type="button" variant="soft" color="gray" onClick={() => setIsCreateListingOpen(false)} disabled={createLoading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createLoading || createCandidatesLoading || createCandidates.length === 0}>
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
                        Confirm purchase to buy this listing from the market.
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
