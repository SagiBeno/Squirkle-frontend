import { Button, Dialog, Flex, Heading, Text, TextField, Tabs } from '@radix-ui/themes';
import { useEffect, useState } from 'react';

import GameSpinner from '../GameSpinner';
import ItemDetailsDialog from './ItemDetailsDialog';
import CreateListingDialog from './CreateListingDialog';
import CreateInspectionDialog from './CreateInspectionDialog';
import BuyListingDialog from './BuyListingDialog';

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

export default function AuctionHouseDialog({ user, toastData, setToastData }) {
    const [buttonsValue, setButtonsValue] = useState([
        {
            name: 'All listing',
            value: 'global'
        },
        {
            name: 'My listing',
            value: 'mine'
        },
        {
            name: 'Prevoius listing',
            value: 'prevoius'
        },
        {
            name: 'Create listing',
            value: 'createListing'
        }
    ]);
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

    function handleSelectButton(value) {
        setActiveTab(value);

        if (value === 'createListing') setIsCreateListingOpen(true);

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
        const reqBody = {
            userId: userId,
            ...createListingForm
        };

        fetch(`${API_BASE_URL}/create-listing`, {
            method: 'POST',
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(reqBody)
        })
            .then( async (resJSON) => {
                const res = await resJSON.json();
                if (resJSON.status === 201) {
                    setToastData({open: true, title: 'Creating a successful listing', description: 'the listing has benn successfully created', isError: false});
                    setIsCreateListingOpen(false);
                    setCreateListingForm({ itemId: '', userItemId: '', price: '' });
                    setCreateCandidates([]);
                } else setToastData({open: true, title: 'Failed to create listing', description: res.error, isError: true});
            })
            .catch((error) => {
                console.warn('Failed to create listing:', error);
                setToastData({open: true, title: 'Failed to create listing', description: 'An error occured while creating the listing. Please try again.', isError: true});
            })
            .finally(() => setCreateLoading(false));
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

        <>
            <Dialog.Content width="90vw" maxWidth="920px" height="80vh" style={{ padding: 0, borderRadius: 0, boxShadow: "none", backgroundColor: "transparent", overflow: 'auto' }}>
                <Dialog.Title style={{ marginTop: 15, color: 'white', textTransform: 'uppercase' }}>Auction house</Dialog.Title>

                <Flex
                    direction="column"
                    height="calc(100% - 52px)"
                    p="3"
                    gap="3"
                    style={{ backgroundColor: 'transparent' }}
                >
                    <Flex
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 4
                        }}
                    >

                        {
                            buttonsValue.length > 0 &&
                            buttonsValue.map((button, idx) => (
                                <Button
                                    key={idx}
                                    value={button.value}
                                    onClick={(e) => handleSelectButton(e.target.value)}
                                    style={{
                                        cursor: 'pointer',
                                        opacity: activeTab === button.value ? '1' : '0.5'
                                    }}
                                    className='button activeButton'
                                >
                                    {button.name}
                                </Button>
                            ))
                        }
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
            </Dialog.Content>

            {
                isCreateListingOpen &&
                <CreateListingDialog
                    open={isCreateListingOpen}
                    setOpen={setIsCreateListingOpen}
                    onSubmit={handleCreateListingSubmit}
                    createCandidates={createCandidates}
                    createCandidatesLoading={createCandidatesLoading}
                    createListingForm={createListingForm}
                    setCreateListingForm={setCreateListingForm}
                    selectedCreateItem={selectedCreateItem}
                    handleCreateFieldChange={handleCreateFieldChange}
                    createLoading={createLoading}
                    handleCreateListingSubmit={handleCreateListingSubmit}
                />
            }

            {
                isCreateInspectOpen && 
                <CreateInspectionDialog
                    open={isCreateInspectOpen}
                    setOpen={setIsCreateInspectOpen}
                    itemData={selectedCreateItem}
                    createListingForm={createListingForm}
                />
            }

            {
                isBuyListingOpen &&
                <BuyListingDialog 
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
                    selectedListingItemData={selectedListingItemData}
                    selectedListing={selectedListing}
                    setSelectedListingBuyable={setSelectedListingBuyable}
                    selectedListingBuyable={selectedListingBuyable}
                    handleBuySelectedListing={handleBuySelectedListing}
                    buyLoading={buyLoading}
                    selectedListingLoading={selectedListingLoading}
                />
            }

        </>

    )
}
