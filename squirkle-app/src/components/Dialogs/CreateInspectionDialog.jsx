import ItemDetailsDialog from "./ItemDetailsDialog";
import { Dialog, Flex, Text, Heading } from "@radix-ui/themes";

export default function CreateInspectionDialog( { open, setOpen, selectedCreateItem, createListingForm } ) {
    return (
        <Dialog.Root open={open} setOpen={setOpen}>
            <ItemDetailsDialog
                itemData={selectedCreateItem}
                rightPanelExtra={
                    selectedCreateItem ? (
                        <Flex direction="column" gap="2" mt="2" style={{ width: '100%', marginTop: '30px' }}>
                            <Text size="2" color="gray">Selected for listing</Text>
                            <Text size="2" color="gray">Type: {selectedCreateItem.type}</Text>
                            <Heading size="4">Set Price: {createListingForm.price || '-'}</Heading>
                        </Flex>
                    ) : null
                }
            />
        </Dialog.Root>
    )
}