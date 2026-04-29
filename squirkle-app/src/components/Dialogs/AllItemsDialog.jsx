import { Flex, Box, Text, Dialog, IconButton, TextField } from "@radix-ui/themes"
import { useState, useEffect } from "react";
import ItemsTable from '../AdminComponents/ItemsTable';
import { HiXMark } from "react-icons/hi2";
import DialogSpinner from '../Spinners/DialogSpinner';

/**
 * @typedef { Object } Item
 * @property { string } id - Unique identifier of the item
 * @property { string } name - Name of the item 
 * @property { string } [imageUrl] - Optional image URL of the item
 */

/**
 * Dialog for displaying and selecting items from the database.
 * 
 * Fetches all items from backend, allows searching by ID or name,
 * and lets the user select an item for modification.
 * 
 * @param { Object } props
 * @param { boolean } props.open - Controls whether the dialog is visible
 * @param { Function } props.setOpen - Function to update dialog visibility
 * @param { Function } props.handleSelectedModify - Function called when an item is selected
 * 
 * @returns { JSX.Element } Item selection dialog
 */
export default function AllItemsDialog({ open, setOpen, handleSelectedModify }) {

    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getItems();
    }, []);

    /**
     * Fetches all items from the backend.
     * 
     * Stores the full item list and initializes the filtered list. 
     * 
     * @returns { void }
     */
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

    /**
     * Filteres items by search input.
     * 
     * Matches items by ID or name (case-insensitive).
     * 
     * @param { string } value - Search text
     * @returns { void }
     */
    function searchForItem(value) {
        if (value.trim().length === 0) {
            setFilteredItems(items);
            return;
        }

        setFilteredItems(items.filter((item) => (item.id?.toLowerCase() ?? "").includes(value) || item.name.toLowerCase().includes(value)));
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Content
                minWidth="80vw"
                style={{
                    padding: '20px',
                    borderRadius: '10px',
                    overflow: "auto",
                    fontFamily: `"Fredoka", sans-serif`,
                    color: 'white',
                    boxShadow: '0px 0px 6px 0px rgb(186, 186, 206)',
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

                <Dialog.Description>
                    Search for an item or select one
                </Dialog.Description>

                {
                    loading
                        ?
                        <DialogSpinner />
                        :
                        <>
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
                                filteredItems.length > 0
                                    ?
                                    <ItemsTable items={filteredItems} handleSelectedModify={handleSelectedModify} />
                                    :
                                    <Flex style={{ width: '100%', justifyContent: 'center' }}>
                                        <Text size="5">No results found</Text>
                                    </Flex>
                            }
                        </>
                }

            </Dialog.Content>

        </Dialog.Root>
    )
}