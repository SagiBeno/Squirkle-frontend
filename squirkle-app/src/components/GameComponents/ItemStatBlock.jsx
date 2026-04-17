import { Flex, Text } from '@radix-ui/themes'
import React from 'react'

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
