import { Table, Avatar, Code, Flex, IconButton, ScrollArea } from '@radix-ui/themes';
import { FaEdit } from "react-icons/fa";

/**
 * @typedef { Object } MetadataTableData
 * @property { string } id - Unique identifier of the metadata
 * @property { string } title - Display title of the metadata
 */

/**
 * Table component for displaying metadata entries in the admin panel.
 * 
 * Renders a list of metadata items with their ID and title,
 * and allows selecting an entry for modification.
 * 
 * @component
 * 
 * @param { Object } props - Component props
 * @param { MetadataTableData[] } - props.metadata - List of metadata entries
 * @param { Function } props.handleSelectedModify - Function called when a metadata entry is selected
 * 
 * @returns { JSX.Element } Metadata table UI
 */

export default function MetadataTable( { metadata, handleSelectedModify } ) {

    return (
        <ScrollArea
            type='auto'
            style={{
                width: '75vw',
                padding: '20px',
                margin: '0 auto',
                maxHeight: '50vh'
            }}
        >
            <Table.Root
            className='adminTable'
                style={{
                    maxWidth: '920px',
                    minWidth: '600px',
                    margin: '0 auto',
                    boxShadow: '0px 0px 3px 0px rgb(186, 186, 206)',
                }}
            >
                <Table.Header>
                    <Table.Row style={{ color: 'white', fontSize: '1.4em', letterSpacing: '2px', background: 'rgba(40, 40, 42, 0.5)' }}>
                        <Table.ColumnHeaderCell
                            style={{
                                width: '70px',
                                textAlign: 'center'
                            }}
                        >
                            ID
                        </Table.ColumnHeaderCell>

                        <Table.ColumnHeaderCell
                            style={{
                                textAlign: 'center',
                                width: '70%'
                            }}
                        >
                            Metadata's title
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell
                            style={{
                                textAlign: 'center',
                                width: '70px'
                            }}
                        >
                            Modify
                        </Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        metadata.map( (data, idx) => (
                            <Table.Row key={data?.id ? data.id : idx}>
                                <Table.Cell>
                                    <Flex
                                        style={{
                                            height: '100%',
                                            width: '100%',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Code color="gray" variant="solid" highContrast style={{ fontSize: '15px' }}>{data?.id}</Code>
                                    </Flex>

                                </Table.Cell>
                                <Table.Cell>
                                    <Flex
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            color: 'white',
                                            height: '100%',
                                            width: '100%',
                                            fontSize: '18px'
                                        }}
                                    >
                                        {data?.title}
                                    </Flex>
                                </Table.Cell>
                                <Table.Cell>
                                    <Flex
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '100%'
                                        }}                                    
                                    >

                                        <IconButton className='button activeButton' onClick={() => handleSelectedModify(data)} >
	                                        <FaEdit width="18" height="18" />
                                        </IconButton>
                                    </Flex>
                                </Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Body>
            </Table.Root>
        </ScrollArea>
    )
}