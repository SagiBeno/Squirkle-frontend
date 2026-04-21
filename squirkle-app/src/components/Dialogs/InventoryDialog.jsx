import { Box, Dialog, Flex } from '@radix-ui/themes'
import React from 'react'
import ItemSlot from '../GameComponents/ItemSlot'
import ItemDetailsDialog from '../Dialogs/ItemDetailsDialog'
import { useState } from 'react'
import { useEffect } from 'react'
import DialogSpinner from '../Spinners/DialogSpinner'

import '../../Modal.css';

export default function InventoryDialog({ user }) {
    //TODO - realtime updating from backend and on fronend when equipping/unequipping/listing/delisting items

    const [inventory, setInventory] = useState([])
    const [listedIds, setListedIds] = useState([])
    const [equippedItems, setEquippedItems] = useState([])

    const [selectedItem, setSelectedItem] = useState(null)
    const [loading, setLoading] = useState(false)

    async function GetPlayerInventory() {
        async function getData() {
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

            /*
            console.log("items: ", items.items)
            console.log("listedIds: ", listedIds.userItemIds)
            console.log("equippedItems: ", equippedItems.items.map(i => i.userItemId))
            */
        }
        setLoading(true)
        getData();
        setLoading(false)
    }

    useEffect(() => {
        GetPlayerInventory()
    }, [])

    return (
        <Dialog.Content width="90vw" maxWidth="920px" height="80vh" style={{ padding: 0, borderRadius: 0, boxShadow: "none", backgroundColor: "transparent", overflow: "auto" }}>
            <Dialog.Title style={{ marginTop: 15, color: "white" }}>INVENTORY</Dialog.Title>

            <Dialog.Root>
                {loading ? <DialogSpinner /> : null}
                <Flex wrap="wrap" justify="start" gap="2">
                    {
                        inventory?.map((x, i) => {
                            if (listedIds.includes(x.userItemId) || equippedItems.some(e => e.itemId === x.itemId)) {
                                return <ItemSlot key={x.itemId + i} itemData={x} onClick={setSelectedItem} state={'listed'} />
                            }
                            if (equippedItems.includes(x.userItemId) || equippedItems.some(e => e.userItemId === x.userItemId)) {
                                return <ItemSlot key={x.itemId + i} itemData={x} onClick={setSelectedItem} state={'equipped'} />
                            }
                            return <ItemSlot key={x.itemId + i} itemData={x} onClick={setSelectedItem} state={''} />
                        })
                    }
                </Flex>
                <ItemDetailsDialog itemData={selectedItem} parentDialog="Inventory" />
            </Dialog.Root>

        </Dialog.Content>
    )
}
