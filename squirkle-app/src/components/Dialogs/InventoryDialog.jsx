import { Box, Dialog, Flex } from '@radix-ui/themes'
import React from 'react'
import ItemSlot from '../ItemSlot'

export default function InventoryDialog() {

    const testData = {
        "item": {
            "name": "Test Weapon",
            "description": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium earum inventore dicta optio temporibus exercitationem, quos laudantium sed, aspernatur vel error mollitia quas aliquam maiores, soluta fugit. Amet, laboriosam ipsa!",
            "knockback": 1.1,
            "imageUrl": "https://http.cat/404",
            "type": "Weapon",
            "stats": {
                "id": "stats",
                "circleDamage": 10,
                "squareDamage": 20,
                "triangleDamage": 30,
                "critChance": 20,
                "critDamage": 1.5,
                "metadata": [ "ABILITY_SMASH", "ABILITY_BURST" ]
            }
        }
    }

    return (
        <Dialog.Content width="90vw" maxWidth="920px" height="80vh" style={{ padding: 0, borderRadius: 0, boxShadow: "none", backgroundColor: "transparent", overflow: "auto" }}>
            <Dialog.Title style={{ marginTop: 15, color: "white" }}>INVENTORY</Dialog.Title>

            <Flex wrap="wrap" justify="start" gap="2">
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
                <ItemSlot itemData={testData.item} />
            </Flex>

        </Dialog.Content>
    )
}
