import { ScrollArea, Flex, Text } from "@radix-ui/themes";
import UserListingCard from "./UserListingsCard";
import { useState } from "react";
import DeleteListingAlert from "./DeleteListingAlert";

export default function ListingsComponentsForUser({ getUserListings, baseUrl, userId, setToastData, activeListings, inactiveListings, handleOpenListing, handleConfirmDeleteListing }) {

    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
    const [selectedListing, setSelectedListing] = useState({});
    const [loading, setLoading] = useState(false);

    function handleDeleteListing(listing) {
        setSelectedListing(listing);
        setOpenDeleteAlert(true);
    }

    function handleConfirmDeleteListing(listing) {
        if (!userId || !listing.id) return;
        setLoading(true);
        
        fetch(`${baseUrl}/delete-listing/${listing.id}`, {
            method: 'DELETE',
            headers: {"Content-Type": "application/json"},
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
                    <>
                        <Flex direction="column" style={{ borderRadius: '12px', backgroundColor: '#646465', color: 'white' }}>
                            <Flex
                                px="3"
                                py="2"
                                align="center"
                                justify="between"
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: '18px',
                                }}
                            >
                                <Text style={{ width: '75%' }}>Active listing(s)</Text>
                                <Text style={{ width: '25%', textAlign: 'right' }}>Price</Text>
                            </Flex>
                        </Flex>
                        <ScrollArea
                            type='auto'
                            scrollbars="vertical"
                            style={{
                                minHeight: '220px',
                                borderRadius: '12px',
                                paddingRight: '20px',
                                marginBottom: '20px'
                            }}
                        >
                            <Flex style={{ padding: '10px', flexDirection: 'column', gap: 4 }}>
                                {
                                    activeListings.map((listing, index) => <UserListingCard key={listing.id} listing={listing} idx={index} handleOpenListing={handleOpenListing} handleDeleteListing={handleDeleteListing} />)
                                }
                            </Flex>
                        </ScrollArea>
                    </>

            }

            {
                inactiveListings.length !== 0
                &&
                <>
                    <Flex direction="column" style={{ borderRadius: '12px', backgroundColor: '#646465', color: 'white', }}>
                        <Flex
                            px="3"
                            py="2"
                            align="center"
                            justify="between"
                            style={{
                                fontWeight: 'bold',
                                fontSize: '18px',
                            }}
                        >
                            <Text style={{ width: '75%' }}>Inactive listing(s)</Text>
                            <Text style={{ width: '25%', textAlign: 'right' }}>Price</Text>
                        </Flex>
                    </Flex>
                    <ScrollArea
                        type='auto'
                        scrollbars="vertical"
                        style={{
                            minHeight: '220px',
                            borderRadius: '12px',
                            paddingRight: '20px',
                        }}
                    >
                        <Flex style={{ padding: '10px', flexDirection: 'column', gap: 4 }}>
                            {
                                inactiveListings.map((listing, index) => <UserListingCard key={listing.id} listing={listing} idx={index} handleOpenListing={handleOpenListing} handleDeleteListing={handleDeleteListing} />)
                            }
                        </Flex>
                    </ScrollArea>
                </>

            }

            {
                openDeleteAlert && <DeleteListingAlert open={openDeleteAlert} setOpen={setOpenDeleteAlert} listing={selectedListing} handleConfirmDeleteListing={handleConfirmDeleteListing} loading={loading} />
            }

        </>

    )
}