import { Button, Dialog, Flex, Heading, Text, TextField, IconButton, ScrollArea } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { HiXMark } from "react-icons/hi2";
import DialogSpinner from '../Spinners/DialogSpinner';
import ItemDetailsDialog from './ItemDetailsDialog';
import CreateListingDialog from './CreateListingDialog';
import ListingsComponentsForUser from '../ListingsComponents/ListingsContainerForUser';
import ListingsContainerForGlobalActive from '../ListingsComponents/ListingsContainerForGlobalActive';
import ListingsContainerForGlobalInactive from '../ListingsComponents/ListingsContainerForGlobalInactive';
import { ResetPlayerCoins } from '../../GameEvents';
import '../../Modal.css';

/**
 * @typedef { Object } Listing
 * @property { string } id
 * @property { string } itemId
 * @property { string } itemName
 * @property { string } itemImageUrl
 * @property { number } price
 * @property { string } userId
 * @property { boolean } active
 */

/**
 * @typedef { Object } CreateListingForm
 * @property { string } itemId
 * @property { string } userItemId
 * @property { string } price
 */

const API_BASE_URL = 'https://squirkle-backend.vercel.app/api'

/**
 * Fetch wrapper that parses JSON and throws on error response.
 *
 * @param { string } url
 * @param { RequestInit } [options]
 * @returns { Promise<any> }
 * @throws { Error } When response is not OK
 */
async function fetchJsonOrThrow(url, options) {
    console.log(`Fetching: ${url}`, options || {});
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.error || 'Request failed');
    }

    return data;
}

/**
 * Auction house dialog component.
 *
 * Handles:
 * - Displaying global and user listings
 * - Creating new listings
 * - Buying listings
 * - Viewing item details
 *
 * Acts as the central controller for auction-related UI and logic.
 *
 * @component
 *
 * @param { Object } props
 * @param { Object } props.user - Current authenticated user
 * @param { Object } props.toastData - Current toast notification data
 * @param { Function } props.setToastData - Updates toast notification data
 * @param { Function } props.setOpen - Controls dialog visibility
 * @param { Function } props.refreshUser - Refreshes user data
 * @param { Function } props.onCloseAutoFocus - Handles focus restoration after close
 *
 * @returns {JSX.Element}
 */

export default function AuctionHouseDialog({ user, toastData, setToastData, setOpen, refreshUser, onCloseAutoFocus }) {
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
    const [isLow, setIsLow] = useState(false);
    const userIdentifier = user?.username || user?.name || user?.email || 'You';
    const userId = user?.user?.uid || null;
    const selectedCreateItem = createCandidates.find((item) => item.userItemId === createListingForm.userItemId) || null;

    /**
     * Updates the mobile layout state based on window width.
     * 
     * Sets 'isLow' to true if the screen height is below 500px.
     * 
     * @returns { void }
     */
    function handleResize () {
        if (window.innerHeight < 600) {
            setIsLow(true);
        }
        else setIsLow(false);
    }
    
    useEffect(() => {
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        handleResize();
        handleSelectButton('userListings');
    }, []);

    /**
    * Fetches listings created by the current user.
    *
    * Separates active and inactive listings.
    */
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

    /**
     * Fetches all active listings except the user's own.
     */
    function getGlobalActiveListings() {

        setLoading(true);

        fetch(`${API_BASE_URL}/get-all-active-listings`)
            .then(async (resJSON) => {
                const res = await resJSON.json();
                if (res?.listings) {
                    const listings = res.listings.filter((listing) => listing.userId !== userId);
                    setGlobalActiveListings(listings);
                }
            })
            .catch(console.warn)
            .finally(() => setLoading(false));
    }

    /**
     * Fetches all inactive listings except the user's own.
     */
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

    /**
     * Handles tab selection and triggers corresponding data fetch.
     *
     * @param { string } value - Selected tab value
     */
    function handleSelectButton(value) {
        setActiveTab(value);

        if (value === 'createListing') handleCreateListing(true);
        if (value === 'userListings') getUserListings();
        if (value === 'previousListings') getPreviousListings();
        if (value === 'globalListings') getGlobalActiveListings();
    }

    /**
    * Opens a listing and loads its item details.
    *
    * @param { Listing } listing
    */
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
            .then(async (resJSON) => {
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
            .finally(() => setSelectedListingLoading(false));
    }

    /**
     * Handles changes in the create listing form fields.
     *
     * Special case: when `userItemId` changes, it also updates the related `itemId`
     * based on the selected candidate item.
     *
     * @param { string } fieldName - Name of the form field
     * @param { string } fieldValue - New value of the field
     */
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

    /**
     * Prepares data for creating a new listing.
     *
     * Fetches inventory and filters available items.
     */
    async function handleCreateListing() {
        if (!userId) {
            return;
        }

        setIsCreateListingOpen(true);
        setCreateCandidatesLoading(true);

        try {
            const [inventoryData, listedIdsData, equippedData] = await Promise.all([
                fetchJsonOrThrow(`${API_BASE_URL}/get-inventory/${encodeURIComponent(userId)}`),
                fetchJsonOrThrow(`${API_BASE_URL}/get-listed-user-item-ids/${encodeURIComponent(userId)}`),
                fetchJsonOrThrow(`${API_BASE_URL}/get-equipped-items/${encodeURIComponent(userId)}`)
            ]);

            const listedOrEquppedIds = new Set((listedIdsData?.userItemIds || []).map((id) => String(id).trim()));
            const equippedItems = Array.isArray(equippedData?.items) ? equippedData.items : [];
            equippedItems.forEach((item) => {
                if (item?.userItemId) listedOrEquppedIds.add(item.userItemId);
            });
            const inventoryItems = Array.isArray(inventoryData?.items) ? inventoryData.items : [];
            const availableItems = inventoryItems.filter((item) => !listedOrEquppedIds.has(String(item?.userItemId || '').trim()));
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

    /**
    * Submits a new listing to the backend.
    */
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

    /**
    * Purchases the selected listing.
    */
    function handleBuySelectedListing() {
        if (!selectedListing || !userId) return;

        setBuyLoading(true);

        fetch(`${API_BASE_URL}/buy-listing/${selectedListing.id}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userId })
        })
            .then(async (resJSON) => {
                const res = await resJSON.json();

                if (resJSON.status === 200) {
                    setToastData({ open: true, title: 'The puchase was successful', description: res.message, isError: false });
                    handleSelectButton('globalListings');

                    const refreshedUser = await refreshUser(user);
                    ResetPlayerCoins(refreshedUser?.coinCount);
                    setIsBuyListingOpen(false);
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
            <Dialog.Content width="90vw" maxWidth="920px" height="80vh" onCloseAutoFocus={onCloseAutoFocus} style={{ padding: 10, borderRadius: 0, boxShadow: "none", backgroundColor: "transparent", overflow: 'hidden' }}>

                <Dialog.Title style={{ marginTop: 15, color: 'white', textTransform: 'uppercase' }}>
                    <Flex
                        style={{
                            justifyContent: "space-between"
                        }}
                    >
                        <Text size='6' style={{ margin: '0 auto' }}>Auction house</Text>
                        <IconButton
                            className="button activeButton"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <HiXMark />
                        </IconButton>
                    </Flex>
                </Dialog.Title>
                {
                    isLow ?
                        <ScrollArea type='auto' style={{ padding: '15px', height: "calc(100% - 52px)" }}>
                            <Flex
                                direction="column"
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
                                            <DialogSpinner />
                                        </Flex>
                                        :
                                        (activeTab === 'userListings') ? <ListingsComponentsForUser isLow={isLow} getUserListings={getUserListings} activeListings={userActiveListings} inactiveListings={userInactiveListings} handleOpenListing={handleOpenListing} userId={userId} setToastData={setToastData} baseUrl={API_BASE_URL} />
                                            :
                                            (activeTab === 'globalListings') ? <ListingsContainerForGlobalActive isLow={isLow} activeListings={globalActiveListings} handleOpenListing={handleOpenListing} />
                                                :
                                                (activeTab === 'previousListings') && <ListingsContainerForGlobalInactive isLow={isLow} inactiveListings={previousListings} handleOpenListing={handleOpenListing} />
                                }
                            </Flex>
                        </ScrollArea>
                        :
                        <>
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
                                            <DialogSpinner />
                                        </Flex>
                                        :
                                        (activeTab === 'userListings') ? <ListingsComponentsForUser isLow={isLow} getUserListings={getUserListings} activeListings={userActiveListings} inactiveListings={userInactiveListings} handleOpenListing={handleOpenListing} userId={userId} setToastData={setToastData} baseUrl={API_BASE_URL} />
                                            :
                                            (activeTab === 'globalListings') ? <ListingsContainerForGlobalActive isLow={isLow} activeListings={globalActiveListings} handleOpenListing={handleOpenListing} />
                                                :
                                                (activeTab === 'previousListings') && <ListingsContainerForGlobalInactive isLow={isLow} inactiveListings={previousListings} handleOpenListing={handleOpenListing} />
                                }
                            </Flex>
                        </>
                }

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
                    handleSelectButton={handleSelectButton}
                />
            }

            {
                isCreateInspectOpen &&
                <Dialog.Root open={isCreateInspectOpen} onOpenChange={setIsCreateInspectOpen}>
                    <ItemDetailsDialog
                        itemData={selectedCreateItem}
                        parentDialog="CreateInspection"
                        createListingForm={createListingForm}
                        setOpen={setIsCreateInspectOpen}
                        GetPlayerInventory={null}
                    />
                </Dialog.Root>
            }

            {
                isBuyListingOpen &&
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
                        setOpen={setIsBuyListingOpen}
                        itemData={selectedListingItemData}
                        parentDialog={activeTab === 'userListings' ? 'CreateInspection' : 'BuyListing'}
                        selectedListing={selectedListing}
                        selectedListingBuyable={selectedListingBuyable}
                        handleBuySelectedListing={handleBuySelectedListing}
                        buyLoading={buyLoading}
                        selectedListingLoading={selectedListingLoading}
                        GetPlayerInventory={null}
                    />
                </Dialog.Root>
            }

        </>

    )
}
