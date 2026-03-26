import { Flex, Text } from '@radix-ui/themes'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import GameSpinner from './GameSpinner'

export default function MetadataBlock({ meta }) {

    return (meta == null ? <GameSpinner/> : 
        <Flex direction="column" gap="1" style={{
            backgroundColor: meta.color, 
            padding: 3, 
            paddingLeft: 5, 
            paddingRight: 5, 
            borderRadius: 10, 
            color: meta.textColor,
        }}>
            <Text as='h3' wrap="nowrap" style={{color: meta.textColor}}>{meta.title}</Text>
            <Text style={{color: meta.textColor}}>{meta.description}</Text>
        </Flex>
    )
}
