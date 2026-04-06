import { Table, Avatar, Code, Flex, IconButton } from '@radix-ui/themes';
import { FaEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export default function ItemsTable( { items, handleSelectedModify } ) {

    return (
        <Flex
            style={{
                overflow: 'auto',
                width: '75vw',
                padding: '20px'
            }}
        >
            <Table.Root
            className='adminTable'
                style={{
                    width: '920px',
                    margin: 'auto',
                    boxShadow: '0px 0px 2px 1px #777777'
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
                                width: '100%'
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
                            Modify/Delete
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
                                            src={item?.imageUrl}
                                            fallback={item?.name.charAt(0)}
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
        </Flex>
    )
}