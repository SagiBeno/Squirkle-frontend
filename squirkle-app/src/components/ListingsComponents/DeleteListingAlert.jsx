import { AlertDialog, Button, Flex, Code, Spinner, Text } from "@radix-ui/themes";
import { FaTrash } from "react-icons/fa";
import { TbCancel } from "react-icons/tb";

export default function DeleteListingAlert({ open, setOpen, listing, handleConfirmDeleteListing, loading }) {

    return (
        <AlertDialog.Root open={open} setOpen={setOpen}>
            <AlertDialog.Content
                maxWidth="450px"
                style={{
                    padding: '20px',
                    borderRadius: '10px',
                    overflow: "auto",
                    background: '#21212c',
                    fontFamily: `"Fredoka", sans-serif`,
                    color: 'white',
                    boxShadow: '0px 0px 5px 2px gray'
                }}
            >
                <AlertDialog.Title>Delete listing</AlertDialog.Title>
                <AlertDialog.Description size="3">
                    Are you sure you want to delete the following listing?
                </AlertDialog.Description>

                <Flex
                    style={{
                        justifyContent: 'center',
                        padding: '10px'
                    }}
                >
                    <Text size="5" style={{ fontWeight: 'bold' }}>{listing.itemName}</Text>
                </Flex>

                <Flex
                    style={{
                        justifyContent: 'space-between',
                        width: '100%'
                    }}
                >
                    <AlertDialog.Cancel>
                        {
                            loading ?
                            <Button variant="soft" color="amber" style={{ cursor: "not-allowed", color: 'white', opacity: '0.5' }} disabled>
                                <Spinner /> Cancel
                            </Button>
                            :
                            <Button variant="soft" color="amber" style={{ cursor: "pointer", color: 'white' }} onClick={() => setOpen(false)}>
                                <TbCancel /> Cancel
                            </Button>
                        }
                    
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        {
                            loading ?
                                <Button variant="solid" color="red" style={{ cursor: "not-allowed", color: 'white', opacity: '0.5' }} disabled >
                                    <Spinner /> Delete
                                </Button>
                                :
                                <Button variant="solid" color="red" style={{ cursor: "pointer"}} onClick={() => handleConfirmDeleteListing(listing)}>
                                    <FaTrash /> Delete
                                </Button>
                        }

                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}