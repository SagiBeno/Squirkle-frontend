import { Flex, Text, Heading } from '@radix-ui/themes'
import GameSpinner from '../Spinners/GameSpinner'

/**
 * @typedef { Object } Metadata
 * @property { string } title - Metadata title
 * @property { string } description - Multiline description text
 * @property { string } backgroundColor - Background color in HEX format
 * @property { string } textColor - Text color in HEX format
 */

/**
 * Displays a styled metadata preview block.
 * 
 * Renders the metadata title and decription with custom background
 * and text colors. Supports multiline descriptions by splitting
 * text on newline characters.
 * 
 * Shows a loading spinner if metadata is not available.
 * 
 * @param { Object } props - Component props
 * @param { Metadata | null } props.meta - Metadata object to display
 *  
 * @returns { JSX.Element } Metadata preview block 
 */

export default function MetadataBlock({ meta }) {

    const description = meta?.description?.split("\n") || [];

    return (meta == null ? <GameSpinner/> : 
        <Flex
            direction="column" 
            style={{
                backgroundColor: meta.backgroundColor, 
                padding: "15px", 
                borderRadius: 10, 
                color: meta.textColor,
            }}
        >
            <Heading as="h3" wrap="nowrap" style={{color: meta.textColor }}>{meta.title}</Heading>
            {
                description.length > 0 && description.map( (desc, idx) => (
                    <Text style={{color: meta.textColor}} key={idx}>
                        {desc}
                    </Text>
                ))
            }
        </Flex>
    )
}
