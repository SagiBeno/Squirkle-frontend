import { Dialog, Flex, Text, Heading, Button, Spinner } from "@radix-ui/themes";
import ItemDetailsDialog from "./ItemDetailsDialog";
import { FaShoppingCart } from "react-icons/fa";

export default function BuyListingDialog({ open, onOpenChange, selectedListingItemData, selectedListing, selectedListingBuyable, handleBuySelectedListing, buyLoading, selectedListingLoading }) {
    return (
        <Dialog.Root
            open={open}
            onOpenChange={onOpenChange}
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
                                    {
                                        buyLoading
                                            ?
                                            <Flex style={{ alignItems: 'center', gap: 2 }}><Spinner /> <Text>Buying...</Text></Flex>
                                            :
                                            <Flex style={{ alignItems: 'center', gap: 2 }}><FaShoppingCart /> <Text>Buy Item</Text></Flex>
                                    }
                                </Button>
                            ) : (
                                <Text size="2" color="gray">This listing is inactive and can only be inspected.</Text>
                            )}
                        </Flex>
                    ) : null
                }
            />
        </Dialog.Root>
    )
}