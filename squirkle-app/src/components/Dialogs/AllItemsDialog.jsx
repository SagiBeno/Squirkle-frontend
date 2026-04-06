import { Flex, Box, Text, Dialog, IconButton, TextField } from "@radix-ui/themes"
import { useState } from "react";
import { useEffect } from "react";
import ItemsTable from '../ItemsTable';
import { HiXMark } from "react-icons/hi2";
import DialogSpinner from "../DialogSpinner";

export default function AllItemsDialog({ open, setOpen, handleSelectedModify }) {

    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getItems();
    }, []);

    function getItems() {
        setLoading(true);
        fetch('https://squirkle-backend.vercel.app/api/get-all-items')
            .then(async (resJSON) => {
                const res = await resJSON.json();
                if (res?.items) {
                    setItems(res.items);
                    setFilteredItems(res.items);
                }
            })
            .catch(console.warn)
            .finally(() => setLoading(false));
    }

    function searchForItem(value) {
        if (value.trim().length === 0) {
            setFilteredItems(items);
            return;
        }

        setFilteredItems(items.filter((item) => item.id.toLowerCase().includes(value) || item.name.toLowerCase().includes(value)));
        return;
    }

    return (
        <Dialog.Root open={open} setOpen={setOpen}>
            <Dialog.Content
                minWidth="80vw"
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

                <Dialog.Title>
                    <Flex
                        style={{
                            justifyContent: "space-between"
                        }}
                    >
                        <Text size='6' style={{ margin: '0 auto' }}>All items</Text>
                        <IconButton
                            className="button activeButton"
                            onClick={() => setOpen(false)}

                        >
                            <HiXMark />
                        </IconButton>
                    </Flex>

                </Dialog.Title>

                {
                    loading
                        ?
                        <DialogSpinner />
                        :
                        <>
                            <Dialog.Description>
                                Search for an item or select one
                            </Dialog.Description>
                            <TextField.Root
                                className="textField"
                                radius="none"
                                placeholder="Search for item"
                                size="3"
                                mt="2"
                                mb="3"
                                value={filterValue}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFilterValue(value);
                                    searchForItem(value.toLowerCase());
                                }}
                                style={{ marginBottom: '12px' }}
                            />

                            {
                                filteredItems.length > 0 && <ItemsTable items={filteredItems} handleSelectedModify={handleSelectedModify} />
                            }
                        </>
                }


            </Dialog.Content>

        </Dialog.Root>
    )
}