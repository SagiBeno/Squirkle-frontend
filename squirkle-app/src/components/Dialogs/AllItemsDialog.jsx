import { Flex, Box, Text, Dialog, IconButton } from "@radix-ui/themes"
import { useState } from "react";
import { useEffect } from "react";
import ItemsTable from '../ItemsTable';
import { MdExitToApp } from "react-icons/md";

export default function AllItemsDialog( { open, setOpen, handleSelectedModify } ) {

    const [items, setItems] = useState([]);

    useEffect( () => {
        getItems();
    }, []);

    function getItems() {
        fetch('https://squirkle-backend.vercel.app/api/get-all-items')
            .then( async (resJSON) => {
                const res = await resJSON.json();
                if (res?.items) setItems(res.items);
            })
            .catch(console.warn);
    }

    return (
        <Dialog.Root open={open} setOpen={setOpen}>
            <Dialog.Content minWidth="90vw" style={{ padding: '10px', borderRadius: 0, boxShadow: "none", overflow: "auto" }}>
                <Dialog.Title>
                    <Flex
                        style={{
                            justifyContent: "space-between"
                        }}
                    >
                        <Text>All items</Text>
                        <IconButton onClick={() => setOpen(false)}>
                            <MdExitToApp />
                        </IconButton>
                    </Flex>
                    
                </Dialog.Title>
                <Dialog.Description>
                    Please select an item
                </Dialog.Description>
                    {
                        items.length > 0 && <ItemsTable items={items} handleSelectedModify={handleSelectedModify} />
                    }
            </Dialog.Content>
        </Dialog.Root>
    )
}