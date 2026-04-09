import { CheckboxCards, Code, Text, Flex, } from '@radix-ui/themes';

export default function CheckboxCardsForNewItem( { allMetadata, addMetadata, removeMetadata } ) {
    return (
        <CheckboxCards.Root size="1" color="gray">
            {
                allMetadata.map((metadata) => (
                    <CheckboxCards.Item
                        value={metadata.id}
                        style={{
                            background: 'gray',
                            width: '90%'
                        }}
                        onClick={(e) => {
                            const checked = e.target.dataset.state !== 'checked';
                            const value = e.target.value;
                            if (checked) addMetadata(value);
                            if (!checked) removeMetadata(value);
                        }}
                        key={metadata.id}
                    >
                        <Flex direction="column" width="100%">
                            <Code color="gray" variant="solid" highContrast style={{ fontSize: '15px', textAlign: 'center', marginBottom: '10px' }}>{metadata.id}</Code>
                            <Text style={{ color: 'black' }}>{metadata.title}</Text>
                        </Flex>
                    </CheckboxCards.Item>
                ))
            }
        </CheckboxCards.Root>
    )
}