import { ScrollArea, Flex, Text } from "@radix-ui/themes";
import UserListingCard from "./UserListingsCard";
import { useState, useEffect } from "react";
import DeleteListingAlert from "./DeleteListingAlert";

/**
 * Displays user's marketplace listings (active and inactive).
 *
 * Handles:
 * - listing display (responsive)
 * - delete flow with confirmation dialog
 * - refreshing user listings
 *
 * Layout adapts based on screen height (isLow, isMobile).
 *
 * @component
 *
 * @param { Object } props
 * @param { boolean } props.isLow - Indicates low screen height
 * @param { boolean } props.isMobile - Indicates mobile layout
 * @param { Function } props.getUserListings - Refresh listings callback
 * @param { string } props.baseUrl - API base URL
 * @param { string } props.userId - Current user ID
 * @param { Function } props.setToastData - Toast setter
 * @param { Array<Object> } props.activeListings - Active listings
 * @param { Array<Object> } props.inactiveListings - Inactive listings
 * @param { Function } props.handleOpenListing - Open listing callback
 *
 * @returns { JSX.Element }
 */

export default function ListingsComponentsForUser({ isLow, getUserListings, baseUrl, userId, setToastData, activeListings, inactiveListings, handleOpenListing }) {

    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
    const [selectedListing, setSelectedListing] = useState({});
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    /**
     * Updates mobile layout state based on window height.
     *
     * The breakpoint values are intentionally based on tested dialog behavior.
     */
    function handleResize() {
        if (window.innerHeight < 700 && window.innerHeight > 500) setIsMobile(true);
        else setIsMobile(false);
    }

    useEffect(() => {
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /**
     * Opens the delete confirmation dialog for a selected listing.
     *
     * @param { Object } listing - Listing selected for deletion
     */
    function handleDeleteListing(listing) {
        setSelectedListing(listing);
        setOpenDeleteAlert(true);
    }

    /**
     * Confirms and sends a delete request for the selected listing.
     *
     * Refreshes user listings after successful deletion.
     *
     * @param { Object } listing - Listing to delete
     */
    function handleConfirmDeleteListing(listing) {
        if (!userId || !listing.id) return;
        setLoading(true);

        fetch(`${baseUrl}/delete-listing/${listing.id}`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userId })
        })
            .then(async (resJSON) => {
                const res = await resJSON.json();

                if (resJSON.status === 200) {
                    setToastData({ open: true, title: 'Deletion successful', description: res.message, isError: false });
                    setOpenDeleteAlert(false);
                    getUserListings();
                }

                else setToastData({ open: true, title: 'Failed to delete', description: res.error, isError: true });
            })
            .catch((error) => {
                console.warn(error);
                setToastData({ open: true, title: 'Failed to delete', description: 'Failed to delete listing', isError: true });
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const HeaderForActiveListings = (
        <Flex
            direction="row"
            style={{
                backgroundColor: '#646465',
                color: 'white',
                borderRadius: '10px',
                justifyContent: 'start',
                padding: '10px',
                fontFamily: `"Fredoka", sans-serif`,
                borderBottom: '8px solid #494949',
                marginBottom: '5px'
            }}
        >
            <Text size='4' style={{ fontWeight: '550', letterSpacing: '1px' }}>Active listing(s)</Text>
        </Flex>
    );

    const HeaderForInactiveListings = (
        <Flex
            direction="row"
            style={{
                backgroundColor: '#646465',
                color: 'white',
                borderRadius: '10px',
                justifyContent: 'start',
                padding: '10px',
                fontFamily: `"Fredoka", sans-serif`,
                borderBottom: '8px solid #494949',
                marginTop: '10px',
                marginBottom: '5px'
            }}
        >
            <Text size='4' style={{ fontWeight: '550', letterSpacing: '1px' }}>Previous listing(s)</Text>
        </Flex>
    );

    return (
        <>
            {
                (!activeListings || activeListings.length === 0)
                    ?
                    <Flex>
                        <Text size="5" style={{ color: 'white', margin: '10px auto 20px auto', textAlign: 'center' }}>You have no active listing yet.</Text>
                    </Flex>
                    :
                    (!isLow && !isMobile) ?
                        <>
                            {HeaderForActiveListings}
                            <ScrollArea type="auto" style={{ padding: '0px 15px 5px 15px' }}>
                                <Flex style={{ flexDirection: 'column', gap: 4 }}>
                                    {
                                        activeListings.map((listing, index) => <UserListingCard key={listing.id || index} listing={listing} idx={index} handleOpenListing={handleOpenListing} handleDeleteListing={handleDeleteListing} />)
                                    }
                                </Flex>
                            </ScrollArea>
                        </>
                        :
                        !isMobile &&
                        <>
                            {HeaderForActiveListings}
                            <Flex style={{ flexDirection: 'column', gap: 4, padding: '0 5px' }}>
                                {
                                    activeListings.map((listing, index) => <UserListingCard key={listing.id || index} listing={listing} idx={index} handleOpenListing={handleOpenListing} handleDeleteListing={handleDeleteListing} />)
                                }
                            </Flex>
                        </>

            }

            {
                !inactiveListings && inactiveListings.length !== 0 && !isLow && !isMobile
                    ?
                    <>
                        {HeaderForInactiveListings}
                        <ScrollArea type="auto" style={{ padding: '0px 15px 5px 15px' }}>
                            <Flex style={{ flexDirection: 'column', gap: 4 }}>
                                {
                                    inactiveListings.map((listing, index) => <UserListingCard key={listing.id || index} listing={listing} idx={index} handleOpenListing={handleOpenListing} handleDeleteListing={handleDeleteListing} />)
                                }
                            </Flex>
                        </ScrollArea>
                    </>
                    :
                    (!isMobile && inactiveListings.length !== 0) &&
                    <>
                        {HeaderForInactiveListings}

                        <Flex style={{ flexDirection: 'column', gap: 4, padding: '0 5px' }}>
                            {
                                inactiveListings.map((listing, index) => <UserListingCard key={listing.id || index} listing={listing} idx={index} handleOpenListing={handleOpenListing} handleDeleteListing={handleDeleteListing} />)
                            }
                        </Flex>
                    </>
            }

            {
                isMobile &&
                <ScrollArea type="auto" style={{ padding: '0px 15px 5px 15px' }}>
                    {
                        activeListings.length !== 0 &&

                        <>
                            {HeaderForActiveListings}
                            <Flex style={{ flexDirection: 'column', gap: 4, padding: '0 5px' }}>
                                {
                                    activeListings.map((listing, index) => <UserListingCard key={listing.id || index} listing={listing} idx={index} handleOpenListing={handleOpenListing} handleDeleteListing={handleDeleteListing} />)
                                }
                            </Flex>
                        </>
                    }
                    {
                        inactiveListings.length !== 0 &&
                        <>
                            {HeaderForInactiveListings}

                            <Flex style={{ flexDirection: 'column', gap: 4, padding: '0 5px' }}>
                                {
                                    inactiveListings.map((listing, index) => <UserListingCard key={listing.id || index} listing={listing} idx={index} handleOpenListing={handleOpenListing} handleDeleteListing={handleDeleteListing} />)
                                }
                            </Flex>
                        </>
                    }
                </ScrollArea>
            }

            {
                openDeleteAlert && <DeleteListingAlert open={openDeleteAlert} setOpen={setOpenDeleteAlert} listing={selectedListing} handleConfirmDeleteListing={handleConfirmDeleteListing} loading={loading} />
            }
        </>

    )
}