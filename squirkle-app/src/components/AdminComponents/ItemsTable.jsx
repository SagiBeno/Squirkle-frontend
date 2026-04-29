import { Table, Avatar, Code, Flex, IconButton, ScrollArea } from '@radix-ui/themes';
import { FaEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

/**
 * @typedef { Object } ItemTableData 
 * @property { string } id - Unique identifier of the item
 * @property { string } name - Name of the item 
 * @property { string } [imageUrl] - Optional image URL of the item
 */

/**
 * Table component for displaying items in the admin panel.
 * 
 * Renders a list of items with their ID, name, and edit action.
 * Allows selecting an item for modification.
 * 
 * @component
 * 
 * @param { Object } props - Component props
 * @param { ItemTableData[] } - props.items - List of the items to display
 * @param { Function } props.handleSelectedModify - Function called when an item is selected for modification
 * 
 * @returns { JSX.Element } Items table UI
 */
export default function ItemsTable( { items, handleSelectedModify } ) {

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
                    margin: '10px auto',
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
                            Item's name
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
                        items.map( (item) => (
                            <Table.Row key={item.id}>
                                <Table.Cell>
                                    <Flex
                                        style={{
                                            height: '100%',
                                            width: '100%',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Code color="gray" variant="solid" highContrast style={{ fontSize: '15px' }}>{item.id}</Code>
                                    </Flex>

                                </Table.Cell>
                                <Table.Cell>
                                    <Flex
                                        style={{
                                            height: '100%',
                                            width: '100%',
                                            alignItems: 'center',
                                            color: 'white',
                                            fontSize: '18px'
                                        }}
                                    >
                                        <Avatar 
                                            color='gray'
                                            src={item?.imageUrl}
                                            fallback={item?.name?.charAt(0) || "?"}
                                            style={{
                                                marginRight: '15px'
                                            }}
                                        />
                                        {item.name}
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

                                        <IconButton className='button activeButton' onClick={() => handleSelectedModify(item)} >
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