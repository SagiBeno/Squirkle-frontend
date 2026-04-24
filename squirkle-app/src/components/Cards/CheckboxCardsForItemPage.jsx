import { CheckboxCards, Code, Flex, } from '@radix-ui/themes';

/**
 * @typedef { Object } MetadataOption
 * @property { string } id - Unique identifier of the metadata
 * @property { string } backgroundColor - Background color of the metadata card
 */

/**
 * Checkbox card list for selecting metadata on item creation/edit page.
 * 
 * Renders selectable metadata cards and handles adding/removing
 * metadata IDs from the selected list.
 * 
 * @component
 * 
 * @param { Object } props - Component props
 * @param { MetadataOption[] } props.allMetadata - List of available metadata options
 * @param { Function } props.addMetadata - Function to add metadata ID
 * @param { Function } props.removeMetadata - Function to remove metadata ID
 * @param { string[] } props.value - Currently selected metadata IDs
 * 
 * @returns { JSX.Element } Checkbox card list UI
 */
export default function CheckboxCardsForItemPage({ allMetadata, addMetadata, removeMetadata, value }) {
    return (

        <CheckboxCards.Root
            size="1"
            value={value}
            color='gray'
            highContrast
            columns
            style={{
                justifyContent: 'stretch',
                paddingRight: '20px',
                gap: 5
            }}
        >
            {
                allMetadata.map((metadata) => (

                    <CheckboxCards.Item
                        key={metadata.id}
                        value={metadata.id}
                        style={{
                            background: metadata.backgroundColor,
                            width: '100%',
                        }}
                        onClick={(e) => {
                            const id = metadata.id;
                            const isSelected = value.includes(id);

                            if (isSelected) removeMetadata(id);
                            else addMetadata(id);
                        }}
                    >
                        <Flex direction="column" style={{ width: '100%' }}>
                            <Code color="gray" variant="solid" highContrast style={{ fontSize: '15px' }}>{metadata.id}</Code>
                        </Flex>
                    </CheckboxCards.Item>


                ))

            }
        </CheckboxCards.Root>
    )
}