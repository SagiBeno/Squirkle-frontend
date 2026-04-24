import { Flex, Text } from '@radix-ui/themes'
import React from 'react'

/**
 * Small UI block for displaying a single item stat.
 *
 * Used in item details to show values like damage, crit chance, etc.
 *
 * @component
 *
 * @param { Object } props - Component props
 * @param { React.ReactNode } props.icon - Icon displayed before the stat
 * @param { string } props.color - Background color of the block
 * @param { string } props.textColor - Text color
 * @param { string } props.title - Label of the stat (e.g. "Crit Chance")
 * @param { string } props.value - Value of the stat
 * @param { boolean } [props.rounded=true] - Whether the block has rounded corners
 * @param { boolean } [props.grow=false] - Whether the block should expand (flex-grow)
 *
 * @returns { JSX.Element }
 */

export default function ItemStatBlock({ icon, color, textColor, title, value, rounded = true, grow = false }) {
    return (
        <Flex flexGrow={grow ? "1" : "0"} align="center" gap="1" style={{
            backgroundColor: color, 
            padding: 3, 
            paddingLeft: 5, 
            paddingRight: 5, 
            borderRadius: (rounded ? 10 : 0), 
            color: textColor,
        }}>
            {icon}
            <Text wrap="nowrap" style={{color: textColor}}>{title}{title == "" ? "" : ":"} {value}</Text>
        </Flex>
    )
}
