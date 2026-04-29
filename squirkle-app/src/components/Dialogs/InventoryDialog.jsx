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
 * @param { Function } props.onCloseAutoFocus - Handles focus restoration after close
 *
 * @returns {JSX.Element}
 */

export default function InventoryDialog({ user, setOpen, onCloseAutoFocus }) {

    const [inventory, setInventory] = useState([])
    const [listedIds, setListedIds] = useState([])
    const [equippedItems, setEquippedItems] = useState([])
    const [selectedItem, setSelectedItem] = useState(null)
    const [loading, setLoading] = useState(false);
    const [openItemDetailsDialog, setOpenItemDetailsDialog] = useState(false);
    const userID = user?.user?.uid;
    const [isMobile, setIsMobile] = useState(false);

    const listedIdSet = new Set(listedIds);
    const equippedIdSet = new Set(equippedItems);

    const equippedSlots = inventory.reduce(
        (acc, item) => {
            if (!equippedIdSet.has(item.userItemId)) {
                return acc;
            }

            const typeKey = (item.type || '').toLowerCase();

            if (typeKey === 'weapon') {
                acc.weapon = item;
            }

            if (typeKey === 'armor') {
                acc.armor = item;
            }

            return acc;
        },
        {
            weapon: null,
            armor: null
        }
    );

    const filteredInventory = inventory.filter((item) => !equippedIdSet.has(item.userItemId));
    const emptyMessage = inventory.length === 0 ? "Your inventory is empty." : "All items are equipped.";

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
            const getInventory = await fetch(`https://squirkle-backend.vercel.app/api/get-inventory/${userID}`)
            const getListedIds = await fetch(`https://squirkle-backend.vercel.app/api/get-listed-user-item-ids/${userID}`)
            const getEquippedItems = await fetch(`https://squirkle-backend.vercel.app/api/get-equipped-items/${userID}`)

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
        if (userID) GetPlayerInventory();
    }, [userID])

    /**
     * Updates the mobile layout state based on window width.
     * 
     * Sets 'isMobile' to true if the screen width is below 770px.
     * 
     * @returns { void }
     */
    function handleResize() {
        if (window.innerWidth < 770) setIsMobile(true);
        else setIsMobile(false);
    }

    useEffect(() => {
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Dialog.Content width="90vw" maxWidth="920px" height="80vh" onCloseAutoFocus={onCloseAutoFocus} style={{ padding: 0, borderRadius: 0, boxShadow: "none", backgroundColor: "transparent", overflow: 'hidden' }}>

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
                            setOpen(false);
                        }}
                    >
                        <HiXMark />
                    </IconButton>
                </Flex>
            </Dialog.Title>

            {loading && <DialogSpinner />}

            <Dialog.Root open={openItemDetailsDialog} onOpenChange={setOpenItemDetailsDialog}>
                <Flex className="inventoryDialogBody">
                    {
                        filteredInventory.length === 0 && !loading ?
                            <Box style={{ width: '100%', textAlign: 'center', marginTop: 20 }}>
                                <Text size="5" style={{ color: 'white', margin: '10px auto 20px auto', textAlign: 'center' }}>{emptyMessage}</Text>
                            </Box>
                            :
                            <ScrollArea type="auto" className="inventoryDialogList" style={{  }}>
                                <Flex wrap="wrap" justify="start" gap="2" style={{ margin: '10px' }}>
                                    {
                                        filteredInventory?.map((x, i) => {
                                            const isListed = listedIdSet.has(x.userItemId);

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
                    }

                    <Flex direction="column" className="inventoryDialogEquipPanel">
                        <Text size="4" className="inventoryDialogEquipTitle">Equipped</Text>
                        <Flex direction="column" gap="3" className="inventoryDialogEquipSlots">
                            <Flex direction="column" gap="1" className="inventoryDialogEquipSlot">
                                <Text size="2" className="inventoryDialogEquipLabel">Weapon</Text>
                                {
                                    equippedSlots.weapon ? (
                                        <ItemSlot
                                            itemData={equippedSlots.weapon}
                                            onClick={setSelectedItem}
                                            state="equipped"
                                        />
                                    ) : (
                                        <div className="inventoryDialogEquipPlaceholder">Empty</div>
                                    )
                                }
                            </Flex>

                            <Flex direction="column" gap="1" className="inventoryDialogEquipSlot">
                                <Text size="2" className="inventoryDialogEquipLabel">Armor</Text>
                                {
                                    equippedSlots.armor ? (
                                        <ItemSlot
                                            itemData={equippedSlots.armor}
                                            onClick={setSelectedItem}
                                            state="equipped"
                                        />
                                    ) : (
                                        <div className="inventoryDialogEquipPlaceholder">Empty</div>
                                    )
                                }
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>

                <ItemDetailsDialog itemData={selectedItem} parentDialog="Inventory" setOpen={setOpenItemDetailsDialog} GetPlayerInventory={GetPlayerInventory} />
            </Dialog.Root>
        </Dialog.Content >
    )
}
