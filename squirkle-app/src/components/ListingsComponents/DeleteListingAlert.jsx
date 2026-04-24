import { AlertDialog, Button, Flex, Code, Spinner, Text } from "@radix-ui/themes";
import { FaTrash } from "react-icons/fa";
import { TbCancel } from "react-icons/tb";

/**
 * Confirmation dialog for deleting a marketplace listing.
 *
 * Displays the listing name and asks the user to confirm deletion.
 * Handles loading state during the delete operation.
 *
 * @component
 *
 * @param { Object } props - Component props
 * @param { boolean } props.open - Whether the dialog is open
 * @param { Function } props.setOpen - Function to control dialog visibility
 * @param { Object } props.listing - Listing data
 * @param { string } props.listing.itemName - Name of the listed item
 * @param { Function } props.handleConfirmDeleteListing - Called when delete is confirmed
 * @param { boolean } props.loading - Indicates whether delete operation is in progress
 *
 * @returns { JSX.Element }
 */
export default function DeleteListingAlert({ open, setOpen, listing, handleConfirmDeleteListing, loading }) {

    return (
        <AlertDialog.Root open={open} setOpen={setOpen} onOpenChange={setOpen}>
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
                    <Text size="5" style={{ fontWeight: 'bold' }}>{listing?.itemName}</Text>
                </Flex>

                <Flex
                    style={{
                        justifyContent: 'space-between',
                        width: '100%'
                    }}
                >
                    <AlertDialog.Cancel>
                        <Button
                            variant="soft"
                            color="amber"
                            disabled={loading}
                            style={{ cursor: loading ? "not-allowed" : "pointer", color: 'white', opacity: loading ? '0.5' : '1' }}
                        >
                            {loading ? <Spinner /> : <TbCancel />} Cancel
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button
                            variant="solid"
                            color="red"
                            disabled={loading}
                            style={{ cursor: loading ? "not-allowed" : "pointer", color: 'white', opacity: loading ? '0.5' : '1' }}
                            onClick={() => handleConfirmDeleteListing(listing)}
                        >
                            {loading ? <Spinner /> : <FaTrash />} Delete
                        </Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}