import React from 'react'
import "../../Game.css";
import { Tooltip, TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import { Dialog, Flex, Text } from '@radix-ui/themes'
import { useState } from 'react'
import ItemDetailsDialog from '../Dialogs/ItemDetailsDialog'

/**
 * @typedef { Object } ItemSlotData
 * @property { string } name - Item name
 * @property { string } description - Item description
 * @property { string } imageUrl - Item icon image URL
 */

/**
 * Inventory item slot component.
 *
 * Displays an item icon with a tooltip containing the item name
 * and shortened description. When clicked, passes the item data
 * with its current state to the parent component.
 *
 * @component
 *
 * @param { Object } props - Component props
 * @param { ItemSlotData } props.itemData - Item data to display
 * @param { Function } props.onClick - Called when the item slot is clicked
 * @param { "listed" | "equipped" | "" } props.state - Current item state
 *
 * @returns { JSX.Element }
 */
export default function ItemSlot({ itemData, onClick, state }) {

    /**
     * Shortens text to a maximum length and adds ellipsis if needed.
     *
     * @param { string } str - Text to shorten
     * @param { number } len - Maximum length
     * @returns { string } Shortened text
     */
    function Truncate(str, len) {
        return str.length > len ? str.slice(0, len) + "..." : str;
    }

    return (
        <TooltipProvider delayDuration={0} disableHoverableContent={true}>
            <Tooltip>

                <TooltipTrigger asChild>

                    {/* Slot here */}
                    <Dialog.Trigger onClick={() => onClick({
                        ...itemData, state
                    })}>
                        <Flex 
                            align="center" 
                            justify="center" 
                            className={
                                state === 'listed' ? 'itemSlot itemSlotListed' :
                                state === 'equipped' ? 'itemSlot itemSlotEquipped' : 'itemSlot'
                            }
                            style={{
                                border: '1px solid rgba(255, 255, 255, 0.25)'
                            }}
                        >
                            <img className='itemIcon' src={itemData?.imageUrl} style={{ cursor: 'pointer' }} />
                        </Flex>
                    </Dialog.Trigger>


                </TooltipTrigger>


                {/* Tooltip */}
                <TooltipPortal>
                    <TooltipContent sideOffset={5}>
                        <Flex direction="column" gap="1" className='itemTooltip'>
                            <Text style={{ fontWeight: "bold" }}>{itemData.name}</Text>
                            <Text>{Truncate(itemData.description, 72)}</Text>
                        </Flex>
                    </TooltipContent>
                </TooltipPortal>

            </Tooltip>
        </TooltipProvider>
    )
}
