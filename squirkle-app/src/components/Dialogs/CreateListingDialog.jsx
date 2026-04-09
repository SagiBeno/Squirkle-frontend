import { Dialog, Flex, Text, TextField, Button, Select, Spinner, Popover, Box } from "@radix-ui/themes";
import { TbCancel } from "react-icons/tb";
import { IoCheckmark } from "react-icons/io5";

export default function CreateListingDialog({ open, setOpen, onSubmit, createCandidates, createCandidatesLoading, createListingForm, setCreateListingForm, selectedCreateItem, createLoading, handleCreateFieldChange, handleCreateListingSubmit }) {

    return (
        <Dialog.Root
            open={open}
            setOpen={setOpen}
        >
            <Dialog.Content
                minWidth="80vw"
                style={{
                    padding: '20px',
                    borderRadius: '10px',
                    overflow: "auto",
                    background: '#21212c',
                    fontFamily: `"Fredoka", sans-serif`,
                    color: 'white',
                    boxShadow: '0px 0px 5px 1px gray',
                }}
            >
                <Dialog.Title>Create Listing</Dialog.Title>
                <Dialog.Description size="2" mb="3">
                    Select one of your inventory items and set a price.
                </Dialog.Description>

                <Flex direction="column" gap="3">
                    <Text as="label" size="4" htmlFor="selectItem" style={{ cursor: 'pointer' }}>Inventory Item</Text>

                    {
                        createCandidates.length === 0 ?
                            <Text style={{ textAlign: 'center', color: 'orange' }} size="4">No available inventory items</Text>
                            :
                            <Select.Root
                                style={{ marginTop: 4, width: '100%', height: 36, borderRadius: 6, border: '1px solid #d1d5db', padding: '0 8px' }}
                                name='selectItem'
                                id='selectItem'
                                value={createListingForm.userItemId}
                                onChange={(e) => handleCreateFieldChange('userItemId', e.target.value)}
                                disabled={createCandidatesLoading || createCandidates.length === 0}
                            >
                                <Select.Trigger />
                                <Select.Content>
                                    {
                                        createCandidates.map((item) => <Select.Item value={item.userItemId} key={item.userItemId}>{`${item.name} (${item.type})`}</Select.Item>)
                                    }
                                </Select.Content>
                            </Select.Root>
                    }

                    <Text as="label" size="4" htmlFor="priceInput">Price</Text>
                    <TextField.Root
                        id='priceInput'
                        name='priceInput'
                        className="textField"
                        placeholder="1500"
                        value={createListingForm.price}
                        onChange={(e) => {
                            console.log(e.target.value)
                            const value = Number(e.target.value);

                            if (isNaN(value)) return;
                            setCreateListingForm(prev => ({
                                ...prev,
                                price: value
                            }));
                            return;
                        }}
                        onKeyDown={(e) => {
                            
                            let value = createListingForm.price.toString();

                            if (!isNaN(e.key)) {
                                value += e.key;
                                setCreateListingForm(prev => ({
                                    ...prev,
                                    price: Number(value)
                                }));
                                return;
                            }

                            if (e.key === 'Backspace') {
                                value = value.substring(0, value.length - 1);
                                setCreateListingForm(prev => ({
                                    ...prev,
                                    price: Number(value)
                                }));
                                return
                            } 
                           
                            return;
                        }}
                    />

                    <Button
                        className={`button ${!selectedCreateItem ? 'inactiveButton' : 'activeButton'}`}
                        type="button"
                        variant="soft"
                        onClick={() => setIsCreateInspectOpen(true)}
                        disabled={!selectedCreateItem}
                    >
                        Inspect Selected Item
                    </Button>
                </Flex>

                <Flex gap="3" mt="4" justify='between'>
                    <Button
                        className={`button ${createLoading ? 'inactiveButton' : 'activeButton'}`}
                        onClick={() => setOpen(false)}
                        disabled={createLoading}
                    >
                        <TbCancel /> Cancel
                    </Button>
                    <Button
                        className={`button ${createLoading || createCandidatesLoading || createCandidates.length === 0 ? 'inactiveButton' : 'activeButton'}`}
                        disabled={createLoading || createCandidatesLoading || createCandidates.length === 0 || createListingForm.price < 1}
                        onClick={() => handleCreateListingSubmit()}
                    >
                        {
                            createLoading
                                ?
                                <Flex style={{ alignItems: 'center', gap: 2 }}><Spinner /> <Text>Creating...</Text></Flex>
                                :
                                <Flex style={{ alignItems: 'center', gap: 2 }}><IoCheckmark /> <Text>Create Listing</Text></Flex>
                        }
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}