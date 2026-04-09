import { Button, Dialog, Flex, Heading, Text, TextField } from '@radix-ui/themes'
import { useEffect, useState } from 'react'

import GameSpinner from '../GameSpinner'
import ItemDetailsDialog from './ItemDetailsDialog'

const ITEMS_PER_PAGE = 8

const API_BASE_URL = 'https://squirkle-backend.vercel.app/api'

async function fetchJsonOrThrow(url, options) {
    console.log(`Fetching: ${url}`, options || {});
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
    const [previousListings, setPreviousListings] = useState([]);

    const [activeTab, setActiveTab] = useState('global');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
    const [isCreateInspectOpen, setIsCreateInspectOpen] = useState(false);
    const [isBuyListingOpen, setIsBuyListingOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);
    const [selectedListingBuyable, setSelectedListingBuyable] = useState(true);
    const [selectedListingItemData, setSelectedListingItemData] = useState(null);
    const [selectedListingLoading, setSelectedListingLoading] = useState(false);

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
            const [activeData, inactiveData] = await Promise.all([
                fetchJsonOrThrow(`${API_BASE_URL}/get-all-active-listings`),
                fetchJsonOrThrow(`${API_BASE_URL}/get-all-inactive-listings`),
            ]);

            const fetchedListings = Array.isArray(activeData.listings) ? activeData.listings : [];
            const fetchedPreviousListings = Array.isArray(inactiveData.listings) ? inactiveData.listings : [];
            const nextMyListings = filterMyListings(fetchedListings);

            setGlobalListings(fetchedListings);
            setMyListings(nextMyListings);
            setPreviousListings(fetchedPreviousListings);

            if (activeTab === 'mine') {
                setListings(nextMyListings);
            } else if (activeTab === 'previous') {
                setListings(fetchedPreviousListings);
            } else {
                setListings(fetchedListings);
            }

            setCurrentPage(1);
        } catch (error) {
            console.error('Error fetching listings:', error);
            setGlobalListings([]);
            setMyListings([]);
            setPreviousListings([]);
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
        if (nextTab === 'mine') {
            setListings(myListings);
        } else if (nextTab === 'previous') {
            setListings(previousListings);
        } else {
            setListings(globalListings);
        }

        setCurrentPage(1);
    }

    async function handleOpenListing(listing) {
        setSelectedListing(listing);
        setSelectedListingBuyable(activeTab !== 'previous');
        setSelectedListingLoading(true);
        setSelectedListingItemData({
            name: listing?.itemName,
            description: 'Loading item details...',
            imageUrl: listing?.itemImageUrl,
            stats: null,
            knockback: 0,
        });
        setIsBuyListingOpen(true);

        try {
            const itemData = await fetchJsonOrThrow(`${API_BASE_URL}/get-item/${encodeURIComponent(listing.itemId)}`);
            if (itemData?.item) {
                setSelectedListingItemData(itemData.item);
            }
        } catch (error) {
            console.error('Failed to fetch listing item details:', error);
            setSelectedListingItemData({
                name: listing?.itemName,
                description: 'No detailed data available for this item.',
                imageUrl: listing?.itemImageUrl,
                stats: null,
                knockback: 0,
            });
        } finally {
            setSelectedListingLoading(false);
        }
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
        <Dialog.Content width="90vw" maxWidth="920px" height="80vh" style={{ padding: 0, borderRadius: 0, boxShadow: "none", backgroundColor: "transparent", overflow: 'auto' }}>
            <Dialog.Title style={{ marginTop: 15, color: 'white' }}>AUCTION HOUSE</Dialog.Title>

            <Flex
                direction="column"
                height="calc(100% - 52px)"
                p="3"
                gap="3"
                style={{ backgroundColor: 'transparent' }}
            >
                <Flex gap="2" justify="center" align="center">
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
                    <Button
                        variant={activeTab === 'previous' ? 'solid' : 'soft'}
                        onClick={() => handleSelectTab('previous')}
                        style={{ cursor: 'pointer' }}
                    >
                        Previous Listings
                    </Button>
                    <Button onClick={handleCreateListing} style={{ cursor: 'pointer' }}>
                        Create Listing
                    </Button>
                </Flex>

                <Flex direction="column" style={{ flexGrow: 1 }}>
                    {loading ? (
                        <GameSpinner />
                    ) : pagedListings.length === 0 ? (
                        <Flex align="center" justify="center" style={{ minHeight: 220, flexGrow: 1 }}>
                            <Text style={{ color: 'white' }} size="4">
                                {activeTab === 'mine'
                                    ? 'You have no active listings yet.'
                                    : activeTab === 'previous'
                                        ? 'No previous listings available yet.'
                                        : 'No listings available yet.'}
                            </Text>
                        </Flex>
                    ) : (
                        <Flex direction="column" style={{ border: '1px solid #d1d5db', backgroundColor: 'white' }}>
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
                                        cursor: 'pointer',
                                        opacity: activeTab === 'previous' ? 0.8 : 1
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
                <Flex align="center" justify="between" py="1" mt="auto">
                    <Button onClick={goToPreviousPage} disabled={loading || currentPage === 1}>Previous</Button>
                    <Text>
                        Page {currentPage} / {totalPages}
                    </Text>
                    <Button onClick={goToNextPage} disabled={loading || currentPage >= totalPages}>Next</Button>
                </Flex>
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
                                
                            </Text>
                            <TextField.Root
                                mt="1"
                                placeholder="1500"
                                value={createListingForm.price}
                                onChange={(e) => {
                                    const value = Number(e.target.value);

                                    if (isNaN(value)) return;
                                    if (value < 1) return;
                                    setCreateListingForm(prev => ({
                                        ...prev,
                                        price: value
                                    }));
                                    return;
                                }}
                            />

                            <Button
                                type="button"
                                variant="soft"
                                onClick={() => setIsCreateInspectOpen(true)}
                                disabled={!selectedCreateItem}
                            >
                                Inspect Selected Item
                            </Button>
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
                        setSelectedListingBuyable(true);
                        setSelectedListingItemData(null);
                        setSelectedListingLoading(false);
                    }
                }}
            >
                <ItemDetailsDialog
                    itemData={selectedListingItemData}
                    rightPanelExtra={
                        selectedListing ? (
                            <Flex direction="column" gap="2" mt="2" style={{ width: '100%' }}>
                                <Text size="2" color="gray">Seller: {selectedListing.username}</Text>
                                <Heading size="4">Price: {selectedListing.price}</Heading>
                                {selectedListingBuyable ? (
                                    <Button
                                        onClick={handleBuySelectedListing}
                                        disabled={buyLoading || selectedListingLoading || !selectedListing}
                                        style={{ width: '100%' }}
                                    >
                                        {buyLoading ? 'Buying...' : 'Buy Item'}
                                    </Button>
                                ) : (
                                    <Text size="2" color="gray">This listing is inactive and can only be inspected.</Text>
                                )}
                            </Flex>
                        ) : null
                    }
                />
            </Dialog.Root>

            <Dialog.Root open={isCreateInspectOpen} onOpenChange={setIsCreateInspectOpen}>
                <ItemDetailsDialog
                    itemData={selectedCreateItem}
                    rightPanelExtra={
                        selectedCreateItem ? (
                            <Flex direction="column" gap="2" mt="2" style={{ width: '100%' }}>
                                <Text size="2" color="gray">Selected for listing</Text>
                                <Text size="2" color="gray">Type: {selectedCreateItem.type}</Text>
                                <Heading size="4">Set Price: {createListingForm.price || '-'}</Heading>
                            </Flex>
                        ) : null
                    }
                />
            </Dialog.Root>

        </Dialog.Content>
    )
}
