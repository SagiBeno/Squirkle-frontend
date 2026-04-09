import { CheckboxCards, Code, Text, Flex, } from '@radix-ui/themes';

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
                        value={metadata.id}
                        style={{
                            background: metadata.backgroundColor,
                            width: '100%',
                        }}
                        onClick={(e) => {
                            const checked = e.target.dataset.state !== 'checked';
                            const value = e.target.value;
                            if (checked) addMetadata(value);
                            if (!checked) removeMetadata(value);
                        }}
                        key={metadata.id}
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