import React from 'react'
import "../Game.css"
import { Tooltip, TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import { Dialog, Flex, Text } from '@radix-ui/themes'
import { useState } from 'react'
import ItemDetailsDialog from './Dialogs/ItemDetailsDialog'

export default function ItemSlot({ itemData, showDetailsOnClick }) {

    function Truncate(str, len)
    {
        return str.length > len ? str.slice(0, len) + "..." : str;
    }

    return (
        <Dialog.Root>
            <TooltipProvider delayDuration={0} disableHoverableContent={true}>
                <Tooltip>

                    <TooltipTrigger asChild>

                        {/* Slot here */}
                        <Dialog.Trigger>
                            <Flex align="center" justify="center" className='itemSlot'>
                                <img className='itemIcon' src={itemData?.imageUrl} />
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

            <ItemDetailsDialog itemData={itemData}/>
        </Dialog.Root>
    )
}
