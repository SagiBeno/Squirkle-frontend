import { Button, Dialog, Flex, Heading, Text, TextField, Tabs } from '@radix-ui/themes';
import { useEffect, useState } from 'react';

import GameSpinner from '../GameSpinner';
import ItemDetailsDialog from './ItemDetailsDialog';
import CreateListingDialog from './CreateListingDialog';
import CreateInspectionDialog from './CreateInspectionDialog';
import BuyListingDialog from './BuyListingDialog';
import ListingsComponentsForUser from '../ListingsComponents/ListingsContainerForUser';
import ListingsContainerForGlobalActive from '../ListingsComponents/ListingsContainerForGlobalActive';
import ListingsContainerForGlobalInactive from '../ListingsComponents/ListingsContainerForGlobalInactive';

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
            name: 'All listings',
            value: 'globalListings'
        },
        {
            name: 'My listings',
            value: 'userListings'
        },
        {
            name: 'Previous listings',
            value: 'previousListings'
        },
        {
            name: 'Create listing',
            value: 'createListing'
        }
    ]);
    const [listings, setListings] = useState([]);
    const [globalActiveListings, setGlobalActiveListings] = useState([]);
    const [userActiveListings, setUserActiveListing] = useState([]);
    const [userInactiveListings, setUserInactiveListing] = useState([]);
    const [previousListings, setPreviousListings] = useState([]);
    const [activeTab, setActiveTab] = useState('');
    const [loading, setLoading] = useState(true);
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
    const userIdentifier = user?.username || user?.name || user?.email || 'You';
    const userId = user?.user?.uid || user?.uid || user?.user?.user?.uid || null;
    const selectedCreateItem = createCandidates.find((item) => item.userItemId === createListingForm.userItemId) || null;

    useEffect(() => {
        handleSelectButton('userListings');
    }, []);

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

        setLoading(true);

        fetch(`${API_BASE_URL}/get-all-active-listings`)
            .then(async (resJSON) => {
                const res = await resJSON.json();
                if (res?.listings) {
                    const listings = res.listings.filter((listing) => listing.userId !== userId);
                    console.log(res)
                    setGlobalActiveListings(listings);
                }
            })
            .catch(console.warn)
            .finally(() => setLoading(false));
    }

    function getPreviousListings() {

        setLoading(true);

        fetch(`${API_BASE_URL}/get-all-inactive-listings`)
            .then(async (resJSON) => {
                const res = await resJSON.json();
                if (res?.listings) {
                    const listings = res.listings.filter((listing) => listing.userId !== userId);
                    setPreviousListings(listings);
                }
            })
            .catch(console.warn)
            .finally(() => setLoading(false));
    }

    function handleSelectButton(value) {
        setActiveTab(value);

        if (value === 'createListing') handleCreateListing(true);
        if (value === 'userListings') getUserListings();
        if (value === 'previousListings') getPreviousListings();
        if (value === 'globalListings') getGlobalActiveListings();

    }

    function handleOpenListing(listing) {

        if (!listing?.itemId) return;

        setSelectedListing(listing);
        setSelectedListingBuyable(activeTab !== 'previousListings');
        setSelectedListingLoading(true);
        setSelectedListingItemData({
            name: listing?.itemName,
            description: 'Loading item details...',
            imageUrl: listing?.itemImageUrl,
            stats: null,
            knockback: 0,
        });
        setIsBuyListingOpen(true);

        fetch(`${API_BASE_URL}/get-item/${listing.itemId}`)
            .then( async (resJSON) => {
                const res = await resJSON.json();
                if (res?.item) setSelectedListingItemData(res.item);
                else {
                    setToastData({ open: true, title: 'Error retrieving the item.', description: res.error, isError: true });
                }
            })
            .catch((error) => {
                console.warn(error);
                setToastData({ open: true, title: 'Error retrieving the item.', description: 'An error occurred while retrieving the item. Please try again.', isError: true });
            })
            .finally( () => setSelectedListingLoading(false) );
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
                    handleSelectButton('userListings');
                } else setToastData({ open: true, title: 'Failed to create listing', description: res.error, isError: true });
            })
            .catch((error) => {
                console.warn('Failed to create listing:', error);
                setToastData({ open: true, title: 'Failed to create listing', description: 'An error occured while creating the listing. Please try again.', isError: true });
            })
            .finally(() => setCreateLoading(false));
    }

    function handleBuySelectedListing() {
        if (!selectedListing || !userId) return;

        setBuyLoading(true);

        fetch(`${API_BASE_URL}/buy-listing/${selectedListing.id}`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify( { userId: userId } )
        })
            .then(async (resJSON) => {
                const res = await resJSON.json();

                if (resJSON.status === 200) {
                    setToastData({ open: true, title: 'The puchase was successful', description: res.message, isError: false });
                    handleSelectButton('globalListings');
                }

                else setToastData({ open: true, title: 'The puchase was failed', description: res.error, isError: true });
            })
            .catch(error => {
                console.warn(error);
                setToastData({ open: true, title: 'The puchase was failed', description: 'Error buying listing', isError: true });
            })
            .finally(() => setBuyLoading(false));
    }

    return (

        <>
            <Dialog.Content width="90vw" maxWidth="920px" height="80vh" style={{ padding: 10, borderRadius: 0, boxShadow: "none", backgroundColor: "transparent", overflow: 'auto' }}>
                <Dialog.Title style={{ marginTop: 15, color: 'white', textTransform: 'uppercase' }}>Auction house</Dialog.Title>

                <Flex
                    direction="column"
                    height="calc(100% - 52px)"
                    style={{ backgroundColor: 'transparent' }}
                >
                    <Flex
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 4,
                            marginBottom: '10px'
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
                                        opacity: activeTab === button.value ? '1' : '0.7'
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
                            (activeTab === 'userListings') ? <ListingsComponentsForUser getUserListings={getUserListings} activeListings={userActiveListings} inactiveListings={userInactiveListings} handleOpenListing={handleOpenListing} userId={userId} setToastData={setToastData} baseUrl={API_BASE_URL} />
                                :
                                (activeTab === 'globalListings') ? <ListingsContainerForGlobalActive activeListings={globalActiveListings} handleOpenListing={handleOpenListing} />
                                    :
                                    (activeTab === 'previousListings') && <ListingsContainerForGlobalInactive inactiveListings={previousListings} handleOpenListing={handleOpenListing} />
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
