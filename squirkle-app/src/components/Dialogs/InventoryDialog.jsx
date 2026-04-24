import { Box, Dialog, Flex, IconButton, Text, ScrollArea } from '@radix-ui/themes'
import React from 'react'
import ItemSlot from '../GameComponents/ItemSlot'
import ItemDetailsDialog from '../Dialogs/ItemDetailsDialog'
import { useState, useEffect } from 'react'
import DialogSpinner from '../Spinners/DialogSpinner'
import { HiXMark } from "react-icons/hi2";
import '../../Modal.css';

/**
 * @typedef { Object } InventoryItem
 * @property { string } userItemId
 * @property { string } itemId
 * @property { string } name
 * @property { string } type
 * @property { string } imageUrl
 */

/**
 * Dialog displaying the player's inventory.
 *
 * Fetches:
 * - All inventory items
 * - Listed item IDs
 * - Equipped items
 *
 * Allows:
 * - Viewing item states (listed, equipped, available)
 * - Opening item details dialog
 *
 * @component
 *
 * @param { Object } props
 * @param { Object } props.user - Current authenticated user
 * @param { Function } props.setOpen - Controls dialog visibility
 * @param { Function } props.setDialogState - Controls parent dialog state
 *
 * @returns {JSX.Element}
 */

export default function InventoryDialog({ user, setOpen, setDialogState }) {

    const [inventory, setInventory] = useState([])
    const [listedIds, setListedIds] = useState([])
    const [equippedItems, setEquippedItems] = useState([])
    const [selectedItem, setSelectedItem] = useState(null)
    const [loading, setLoading] = useState(false);
    const [openItemDetailsDialog, setOpenItemDetailsDialog] = useState(false);

    /**
     * Fetches player inventory data:
     * - Inventory items
     * - Listed item IDs
     * - Equipped items
     */
    async function GetPlayerInventory() {
        setInventory([]);
        async function getData() {
            setLoading(true);
            const getInventory = await fetch(`https://squirkle-backend.vercel.app/api/get-inventory/${user.user.uid}`)
            const getListedIds = await fetch(`https://squirkle-backend.vercel.app/api/get-listed-user-item-ids/${user.user.uid}`)
            const getEquippedItems = await fetch(`https://squirkle-backend.vercel.app/api/get-equipped-items/${user.user.uid}`)

            const [inventoryResponse, listedIdsResponse, equippedItemsResponse] = await Promise.all([getInventory, getListedIds, getEquippedItems])

            const items = await inventoryResponse.json()
            const listedIds = await listedIdsResponse.json()
            const equippedItems = await equippedItemsResponse.json()

            setInventory(items.items)
            setListedIds(listedIds.userItemIds)
            setEquippedItems(equippedItems.items.map(i => i.userItemId))
            setLoading(false);
        }

        getData();
    }

    useEffect(() => {
        GetPlayerInventory()
    }, [])

    return (
        <Dialog.Content width="90vw" maxWidth="920px" height="80vh" style={{ padding: 0, borderRadius: 0, boxShadow: "none", backgroundColor: "transparent", overflow: 'hidden' }}>

            <Dialog.Title style={{ marginTop: 15, color: 'white', textTransform: 'uppercase' }}>
                <Flex
                    style={{
                        justifyContent: "space-between"
                    }}
                >
                    <Text size='6'>Inventory</Text>
                    <IconButton
                        className="button activeButton"
                        onClick={() => {
                            setDialogState(null);
                            setOpen(false);
                        }}
                    >
                        <HiXMark />
                    </IconButton>
                </Flex>
            </Dialog.Title>

            {loading && <DialogSpinner />}

            <Dialog.Root open={openItemDetailsDialog} onOpenChange={setOpenItemDetailsDialog}>
                <ScrollArea type="auto" style={{ padding: "0px 15px", maxHeight: '80%' }}>
                    <Flex wrap="wrap" justify="start" gap="2">
                        {
                            inventory?.map((x, i) => {
                                const isListed = listedIds.includes(x.userItemId);
                                const isEquipped = equippedItems.includes(x.userItemId);

                                if (isListed) {
                                    return (
                                        <ItemSlot
                                            key={x.userItemId ?? x.itemId + i}
                                            itemData={x}
                                            onClick={setSelectedItem}
                                            state="listed"
                                        />
                                    );
                                }
                            
                                if (isEquipped) {
                                    return (
                                        <ItemSlot
                                            key={x.userItemId ?? x.itemId + i}
                                            itemData={x}
                                            onClick={setSelectedItem}
                                            state="equipped"
                                        />
                                    );
                                }
                            
                                return (
                                    <ItemSlot
                                        key={x.userItemId ?? x.itemId + i}
                                        itemData={x}
                                        onClick={setSelectedItem}
                                        state=""
                                    />
                                );
                            })
                        }
                    </Flex>
                </ScrollArea>
                <ItemDetailsDialog itemData={selectedItem} parentDialog="Inventory" setOpen={setOpenItemDetailsDialog} GetPlayerInventory={GetPlayerInventory} />
            </Dialog.Root>
        </Dialog.Content >
    )
}
