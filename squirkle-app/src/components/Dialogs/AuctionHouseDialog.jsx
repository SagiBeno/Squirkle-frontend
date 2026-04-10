import { Button, Dialog, Flex, Heading, Text, TextField, Tabs } from '@radix-ui/themes';
import { useEffect, useState } from 'react';

import GameSpinner from '../GameSpinner';
import ItemDetailsDialog from './ItemDetailsDialog';
import CreateListingDialog from './CreateListingDialog';
import CreateInspectionDialog from './CreateInspectionDialog';
import BuyListingDialog from './BuyListingDialog';
import ListingsComponentsForUser from '../ListingsComponents/ListingsContainerForUser';
import ListingsContainerForGlobalActive from '../ListingsComponents/ListingsContainerForGlobalActive';

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
            value: 'globalListings'
        },
        {
            name: 'My listing',
            value: 'userListings'
        },
        {
            name: 'Previous listing',
            value: 'previousListings'
        },
        {
            name: 'Create listing',
            value: 'createListing'
        }
    ]);
    const [listings, setListings] = useState([]);
    const [globalListings, setGlobalListings] = useState([]);
    const [globalActiveListings, setGlobalActiveListings] = useState([]);
    const [userActiveListings, setUserActiveListing] = useState([]);
    const [userInactiveListings, setUserInactiveListing] = useState([]);
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

    useEffect(() => {
        fetchListings();
    }, [userId]);

    useEffect(() => {
        handleSelectButton('userListings');
    }, []);

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

    function getUserListings() {
        if (!userId) return;

        setLoading(true);

        fetch(`${API_BASE_URL}/get-user-listings/${userId}`)
            .then(async (resJSON) => {
                const res = await resJSON.json();
                if (res?.listings) {
                    const activeListings = res.listings.filter((listing) => listing.active);
                    const inactiveListings = res.listings.filter((listing) => !listing.active);
                    setUserActiveListing(activeListings);
                    setUserInactiveListing(inactiveListings);
                }
            })
            .catch(console.warn)
            .finally(() => setLoading(false));
    }

    function getGlobalActiveListings() {
        if (!userId) return;

        setLoading(true);

        fetch(`${API_BASE_URL}/get-all-active-listings`)
            .then(async (resJSON) => {
                const res = await resJSON.json();
                if (res?.listings) setGlobalActiveListings(res.listings);
            })
            .catch(console.warn)
            .finally(() => setLoading(false));
    }

    function handleSelectButton(value) {
        setActiveTab(value);

        if (value === 'createListing') handleCreateListing(true);
        if (value === 'userListings') getUserListings();
        if (value === 'previousListings') setListings(previousListings);
        if (value === 'globalListings') getGlobalActiveListings();

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

    function handleCreateListingSubmit() {

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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reqBody)
        })
            .then(async (resJSON) => {
                const res = await resJSON.json();
                if (resJSON.status === 201) {
                    setToastData({ open: true, title: 'Creating a successful listing', description: 'The listing has benn successfully created', isError: false });
                    setIsCreateListingOpen(false);
                    setCreateListingForm({ itemId: '', userItemId: '', price: '' });
                    setCreateCandidates([]);
                } else setToastData({ open: true, title: 'Failed to create listing', description: res.error, isError: true });
            })
            .catch((error) => {
                console.warn('Failed to create listing:', error);
                setToastData({ open: true, title: 'Failed to create listing', description: 'An error occured while creating the listing. Please try again.', isError: true });
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
                            gap: 4,
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
                                    color='gray'
                                    className='button activeButton'
                                >
                                    {button.name}
                                </Button>
                            ))
                        }
                    </Flex>

                    {
                        loading ?
                            <Flex
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '10px'
                                }}
                            >
                                <GameSpinner />
                            </Flex>
                            :
                            (activeTab === 'userListings') ? <ListingsComponentsForUser activeListings={userActiveListings} inactiveListings={userInactiveListings} handleOpenListing={handleOpenListing} />
                                :
                                (activeTab === 'globalListings') ? <ListingsContainerForGlobalActive activeListings={globalActiveListings} handleOpenListing={handleOpenListing} />
                                    :
                                    (activeTab === 'previousListings') && <Text>globalListings</Text>
                    }
                </Flex>
            </Dialog.Content>

            {
                isCreateListingOpen &&
                <CreateListingDialog
                    open={isCreateListingOpen}
                    setOpen={setIsCreateListingOpen}
                    createCandidates={createCandidates}
                    createCandidatesLoading={createCandidatesLoading}
                    createListingForm={createListingForm}
                    setCreateListingForm={setCreateListingForm}
                    selectedCreateItem={selectedCreateItem}
                    handleCreateFieldChange={handleCreateFieldChange}
                    createLoading={createLoading}
                    handleCreateListingSubmit={handleCreateListingSubmit}
                    setIsCreateInspectOpen={setIsCreateInspectOpen}
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
