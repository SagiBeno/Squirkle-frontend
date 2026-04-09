import { Flex, Text, Heading } from '@radix-ui/themes'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import GameSpinner from './GameSpinner'

export default function MetadataBlock({ meta }) {

    const description = meta.description.split("\n");

    return (meta == null ? <GameSpinner/> : 
        <Flex direction="column" 
        style={{
            backgroundColor: meta.backgroundColor, 
            padding: "15px", 
            borderRadius: 10, 
            color: meta.textColor,
        }}>
            <Heading as="h3" wrap="nowrap" style={{color: meta.textColor }}>{meta.title}</Heading>
            {
                description.map( (desc, idx) => (
                    <Text style={{color: meta.textColor}} key={idx}>
                        {
                            desc
                        }
                    </Text>
                ))
            }
        </Flex>
    )
}
