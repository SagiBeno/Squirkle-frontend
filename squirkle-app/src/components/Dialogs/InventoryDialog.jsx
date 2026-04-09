import { Box, Dialog, Flex } from '@radix-ui/themes'
import React from 'react'
import ItemSlot from '../ItemSlot'
import ItemDetailsDialog from './ItemDetailsDialog'
import { useState } from 'react'
import { useEffect } from 'react'

export default function InventoryDialog({user}) {

    const [ inventory, setInventory ] = useState(null)
    const [ selectedItem, setSelectedItem ] = useState(null)

    async function GetPlayerInventory()
    {
        const json = await (await fetch(`https://squirkle-backend.vercel.app/api/get-inventory/${user.user.uid}`)).json()
        setInventory(json.items)
    }

    useEffect(() => {
        GetPlayerInventory()
    }, [])

    return (
        <Dialog.Content width="90vw" maxWidth="920px" height="80vh" style={{ padding: 0, borderRadius: 0, boxShadow: "none", backgroundColor: "transparent", overflow: "auto" }}>
            <Dialog.Title style={{ marginTop: 15, color: "white" }}>INVENTORY</Dialog.Title>

            <Dialog.Root>
                <Flex wrap="wrap" justify="start" gap="2">
                {
                    inventory?.map((x, i) => <ItemSlot key={x.itemId + i} itemData={x} onClick={setSelectedItem} />)
                }
                </Flex>
                <ItemDetailsDialog itemData={selectedItem}/>
            </Dialog.Root>

        </Dialog.Content>
    )
}
