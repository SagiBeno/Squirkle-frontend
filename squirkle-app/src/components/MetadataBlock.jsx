import { Flex, Text, Heading } from '@radix-ui/themes'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import GameSpinner from './GameSpinner'

export default function MetadataBlock({ meta }) {

    const metadata = meta.metadata
    const description = metadata.description.split("\n");

    return (meta == null ? <GameSpinner/> : 
        <Flex direction="column" 
        style={{
            backgroundColor: metadata.backgroundColor, 
            padding: "15px", 
            borderRadius: 10, 
            color: metadata.textColor,
        }}>
            <Heading as="h3" wrap="nowrap" style={{color: metadata.textColor }}>{metadata.title}</Heading>
            {
                description.map( (desc, idx) => (
                    <Text style={{color: metadata.textColor}} key={idx}>
                        {
                            desc
                        }
                    </Text>
                ))
            }
        </Flex>
    )
}
