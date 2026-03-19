import { Box, Flex, Card, Text, TextField, TextArea, Table, IconButton, Button, Select, SegmentedControl } from '@radix-ui/themes';
import { useCallback, useState } from 'react';
import Dropzone, { useDropzone } from "react-dropzone";
import { PlusIcon, MinusIcon } from '@radix-ui/react-icons';
import AdminTextField from './AdminTextField';
import { MdDelete } from "react-icons/md";

export default function NewItemPage( { i } ) {

    return (
        <Flex className='mainContainer'>

            <Box className='navbarSpacer' />

            <Flex className='contentContainer'>
                <Flex
                    style={{
                        margin: '20px',
                        width: '95%',
                        textAlign: 'center',
                        flexDirection: 'column',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        padding: '10px',
                        borderRadius: '20px',
                    }}
                >

                    <Text
                        size="7"
                        style={{
                            fontWeight: 'bold'
                        }}
                    >
                        Create new item
                    </Text>

                    <Flex
                        style={{
                            justifyContent: 'space-around',
                            textAlign: 'center',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Box
                            style={{
                                textAlign: 'left',
                                minWidth: '200px',
                                maxWidth: '600px',
                                width: '45%',
                            }}
                        >
                            <Flex
                                style={{
                                    justifyContent: "row",
                                    alignItems: "center"
                                }}
                            >
                                <Text
                                    style={{
                                        marginRight: "5px"
                                    }}
                                >
                                    Type of item
                                </Text>

                                <Select.Root
                                    onValueChange={(value) => updateItemField('typeOfItem', value)}
                                    value={itemData.typeOfItem}
                                >
                                    <Select.Trigger />
                                    <Select.Content>
                                        <Select.Group>
                                            <Select.Label>Type of item</Select.Label>
                                            <Select.Item value="Weapon">Weapon</Select.Item>
                                            <Select.Item value="Armor">Armor</Select.Item>
                                        </Select.Group>
                                    </Select.Content>
                                </Select.Root>
                            </Flex>

                            <AdminTextField
                                title="Item's name"
                                placeholder="Item's name"
                                name="itemName"
                                id="itemName"
                                value={itemData.name}
                                onChange={(e) => {
                                    let value = e.target.value;
                                    value = value.charAt(0).toUpperCase() + value.substring(1);
                                    updateItemField('name', value);
                                }}
                            />

                            <Text
                                as='label'
                                htmlFor='itemDescription'
                                style={{ cursor: 'pointer' }}
                            >
                                Item's description
                            </Text>

                            <TextArea
                                radius="none"
                                placeholder="Item's description"
                                size="3"
                                name="itemDescription"
                                id="itemDescription"
                                mt="2"
                                mb="3"
                                value={itemData.description}
                                required
                                resize='vertical'
                                onChange={(e) => {
                                    let value = e.target.value;
                                    value = value.charAt(0).toUpperCase() + value.slice(1);
                                    updateItemField('description', value);
                                }}
                                style={{
                                    maxHeight: '500px'
                                }}
                            />

                            <Box>
                                <Flex
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'

                                    }}
                                >
                                    <Text>
                                        Item's metadata
                                    </Text>
                                    <IconButton
                                        style={{ cursor: 'pointer' }}
                                        onClick={addMetadata}
                                    >
                                        <PlusIcon />
                                    </IconButton>
                                </Flex>

                                {
                                    itemData.stats.metadata.map((data, idx) => (
                                        <Flex
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}
                                            key={idx}
                                        >
                                            <TextField.Root
                                                radius="none"
                                                size="3"
                                                mb="1"
                                                value={data}
                                                required
                                                onChange={ (e) => updateMetadata(idx, e.target.value.trim() ) }
                                                    
                                                placeholder='Matedata'
                                                style={{
                                                    width: '100%',
                                                    marginRight: '5px'
                                                }}
                                            />

                                            <IconButton
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => removeMetadata(idx)}
                                            >
                                                <MinusIcon />
                                            </IconButton>
                                        </Flex>
                                    ))
                                }
                            </Box>

                            <Text
                                as='label'
                                htmlFor='itemImage'
                                style={{ cursor: 'pointer', marginBottom: '10px' }}
                            >
                                Item's image
                            </Text>

                            <Box
                                {...getRootProps({ className: 'dropzone' })}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '10px',
                                    padding: '10px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    marginBottom: '10px'
                                }}
                            >
                                <input {...getInputProps()} name='itemImage' id='itemImage' />
                                <Text>Drag and drop image file here, or click to select file</Text>
                            </Box>

                            {
                                itemData.imageUrl?.length > 0 &&
                                <Flex
                                    style={{
                                        width: "100%",
                                        height: "200px",
                                        marginBottom: "10px",
                                        backgroundImage: `url(${itemData.imageUrl})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        justifyContent: "end"
                                    }}
                                >
                                    <IconButton
                                        radius='none'
                                        color="red"
                                        style={{
                                            margin: "5px",
                                            cursor: "pointer",
                                            borderBottom: "4px rgba(0, 0, 0, 0.1) solid"
                                        }}
                                        onClick={() => deleteImage()}
                                    >
                                        <MdDelete />
                                    </IconButton>
                                </Flex>
                            }
                        </Box>

                        <Box
                            style={{
                                textAlign: 'left',
                                minWidth: '200px',
                                width: '45%',
                                maxWidth: '600px'
                            }}
                        >
                            <AdminTextField
                                title="Knockback"
                                placeholder="Knockback"
                                name="knockback"
                                id="knockback"
                                value={itemData.knockback}
                                onChange={(e) => {updateNumberField('root', 'knockback', e.target.value, 0, 1000)}}
                            />

                            <AdminTextField
                                title="Circle damage"
                                placeholder="Circle damage"
                                name="circleDamage"
                                id="circleDamage"
                                value={itemData.stats.circleDamage}
                                onChange={(e) => {updateNumberField('stats', 'circleDamage', e.target.value, 0, 1000)}}
                            />

                            <AdminTextField
                                title="Square damage"
                                placeholder="Square damage"
                                name="squareDamage"
                                id="squareDamage"
                                value={itemData.stats.squareDamage}
                                onChange={(e) => {updateNumberField('stats', 'squareDamage', e.target.value, 0, 1000)}}
                            />

                            <AdminTextField
                                title="Triangle damage"
                                placeholder="Triangle damage"
                                name="triangleDamage"
                                id="triangleDamage"
                                value={itemData.stats.triangleDamage}
                                onChange={(e) => {updateNumberField('stats', 'triangleDamage', e.target.value, 0, 1000)}}
                            />

                            <AdminTextField
                                title="Crit chance"
                                placeholder="Crit chance"
                                name="critChance"
                                id="critChance"
                                value={itemData.stats.critChance}
                                onChange={(e) => {updateNumberField('stats', 'critChance', e.target.value, 0, 100)}}
                            />

                            <AdminTextField
                                title="Crit damage"
                                placeholder="Crit damage"
                                name="critDamage"
                                id="critDamage"
                                value={itemData.stats.critDamage}
                                onChange={(e) => {updateNumberField('stats', 'critDamage', e.target.value, 1, 10.99)}}
                            />
                        </Box>

                    </Flex>

                    <Button
                        disabled={!isValid}
                        radius='none'
                        size='3'
                        style={{
                            width: "95%",
                            cursor: isValid ? 'pointer' : 'not-allowed',
                            backgroundColor: "darkgray",
                            margin: "0 auto",
                            borderBottom: "8px rgba(0, 0, 0, 0.1) solid",
                            opacity: isValid ? 1 : 0.6
                        }}
                        onClick={handleNewItem}
                    >
                        Submit
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    )
}