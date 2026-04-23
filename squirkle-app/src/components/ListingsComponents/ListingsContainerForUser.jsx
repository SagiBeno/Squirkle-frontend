import { ScrollArea, Flex, Text } from "@radix-ui/themes";
import UserListingCard from "./UserListingsCard";
import { useState, useEffect } from "react";
import DeleteListingAlert from "./DeleteListingAlert";

export default function ListingsComponentsForUser({ isLow, getUserListings, baseUrl, userId, setToastData, activeListings, inactiveListings, handleOpenListing, handleConfirmDeleteListing }) {

    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
    const [selectedListing, setSelectedListing] = useState({});
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    function handleResize() {
        if (window.innerHeight < 700 && window.innerHeight > 500) setIsMobile(true);
        else setIsMobile(false);
    }

    window.addEventListener('resize', handleResize);

    useEffect(() => {
        handleResize();
    }, []);

    function handleDeleteListing(listing) {
        setSelectedListing(listing);
        setOpenDeleteAlert(true);
    }

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

    return (
        <>
            {
                activeListings.length === 0
                    ?
                    <Flex>
                        <Text size="5" style={{ color: 'white', margin: '10px auto 20px auto' }}>You have no active listing yet.</Text>
                    </Flex>
                    :
                    (!isLow && !isMobile) ?
                        <>
                            <Flex
                                direction="row"
                                style={{
                                    backgroundColor: '#646465',
                                    color: 'yellow',
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
                            <ScrollArea type="auto" style={{ padding: '0px 15px' }}>
                                <Flex style={{ flexDirection: 'column', gap: 4 }}>
                                    {
                                        activeListings.map((listing, index) => <UserListingCard key={listing.id} listing={listing} idx={index} handleOpenListing={handleOpenListing} handleDeleteListing={handleDeleteListing} />)
                                    }
                                </Flex>
                            </ScrollArea>
                        </>
                        :
                        !isMobile &&
                        <>
                            <Flex
                                direction="row"
                                style={{
                                    backgroundColor: '#646465',
                                    color: 'white',
                                    borderRadius: '10px',
                                    justifyContent: 'start',
                                    padding: '10px',
                                    fontFamily: `"Fredoka", sans-serif`,
                                    borderBottom: '8px solid #494949'
                                }}
                            >
                                <Text size='4' style={{ fontWeight: '550', letterSpacing: '1px' }}>Active listing(s)</Text>
                            </Flex>
                            <Flex style={{ flexDirection: 'column', gap: 4, padding: '5px' }}>
                                {
                                    activeListings.map((listing, index) => <UserListingCard key={listing.id} listing={listing} idx={index} handleOpenListing={handleOpenListing} handleDeleteListing={handleDeleteListing} />)
                                }
                            </Flex>
                        </>

            }

            {
                inactiveListings.length !== 0 && !isLow && !isMobile
                    ?
                    <>
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
                        <ScrollArea type="auto" style={{ padding: '0px 15px' }}>
                            <Flex style={{ flexDirection: 'column', gap: 4 }}>
                                {
                                    inactiveListings.map((listing, index) => <UserListingCard key={listing.id} listing={listing} idx={index} handleOpenListing={handleOpenListing} handleDeleteListing={handleDeleteListing} />)
                                }
                            </Flex>
                        </ScrollArea>
                    </>
                    :
                    !isMobile &&
                    <>
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
                                marginTop: '15px'
                            }}
                        >
                            <Text size='4' style={{ fontWeight: '550', letterSpacing: '1px' }}>Previous listing(s)</Text>
                        </Flex>

                        <Flex style={{ flexDirection: 'column', gap: 4, padding: '5px' }}>
                            {
                                inactiveListings.map((listing, index) => <UserListingCard key={listing.id} listing={listing} idx={index} handleOpenListing={handleOpenListing} handleDeleteListing={handleDeleteListing} />)
                            }
                        </Flex>
                    </>
            }

            {
                isMobile &&
                <ScrollArea type="auto" style={{ padding: '15px' }}>
                    {
                        activeListings.length !== 0 &&

                        <>
                            <Flex
                                direction="row"
                                style={{
                                    backgroundColor: '#646465',
                                    color: 'white',
                                    borderRadius: '10px',
                                    justifyContent: 'start',
                                    padding: '10px',
                                    fontFamily: `"Fredoka", sans-serif`,
                                    borderBottom: '8px solid #494949'
                                }}
                            >
                                <Text size='4' style={{ fontWeight: '550', letterSpacing: '1px' }}>Active listing(s)</Text>
                            </Flex>
                            <Flex style={{ flexDirection: 'column', gap: 4, padding: '5px' }}>
                                {
                                    activeListings.map((listing, index) => <UserListingCard key={listing.id} listing={listing} idx={index} handleOpenListing={handleOpenListing} handleDeleteListing={handleDeleteListing} />)
                                }
                            </Flex>
                        </>
                    }
                    {
                        inactiveListings.length !== 0 &&
                        <>
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
                                    marginTop: '10px'
                                }}
                            >
                                <Text size='4' style={{ fontWeight: '550', letterSpacing: '1px' }}>Previous listing(s)</Text>
                            </Flex>

                            <Flex style={{ flexDirection: 'column', gap: 4, padding: '5px' }}>
                                {
                                    inactiveListings.map((listing, index) => <UserListingCard key={listing.id} listing={listing} idx={index} handleOpenListing={handleOpenListing} handleDeleteListing={handleDeleteListing} />)
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