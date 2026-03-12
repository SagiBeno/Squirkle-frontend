import { Dialog, Flex } from '@radix-ui/themes'
import React from 'react'

export default function AuctionHouseDialog() {
    return (
        <Dialog.Content maxWidth="90vw" height="80vh" style={{ padding: 0, borderRadius: 0, boxShadow: "none", backgroundColor: "transparent", overflow: "auto" }}>
            <Dialog.Title style={{ textAlign: "center", marginTop: 15, color: "white" }}>AUCTION HOUSE</Dialog.Title>

            <Flex height="100%" style={{backgroundColor: "white"}}>
                
            </Flex>

        </Dialog.Content>
    )
}
