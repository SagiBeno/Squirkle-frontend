import { Box, Flex, Card, Text, TextField, TextArea } from '@radix-ui/themes';
import Navbar from '../components/Navbar';
import { useCallback, useState } from 'react';
import Dropzone, { useDropzone } from "react-dropzone";

export default function NewItemPage() {
    const [itemData, setItemData] = useState({
        name: "",
        description: "",
        imageUrl: "",
        knockback: 0,
        stats: {
            circleDamage: 0,
            squareDamage: 0,
            triangleDamage: 0,
            critChance: 0,
            critDamage: 1.0,
            metadata: []
        }
    });

    function uploadImage(file) {

        /*fetch('https://squirkle-backend.vercel.app/api/upload-image', {
            method: 'POST'
        })
            .then()
            .catch();*/
        console.log(file)
    }

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles?.[0];
        if (!file) return;
        else {
            uploadImage(file);
        }
    }, []);

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        },
        maxFiles: 1,
    });

    return (
        <Flex className='contentContainer'>
            <Card
                style={{
                    margin: '20px',
                    width: '95%',
                    textAlign: 'center'
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
                        <Text
                            as='label'
                            htmlFor='itemName'
                            style={{ cursor: 'pointer' }}
                        >
                            Item's name
                        </Text>

                        <TextField.Root
                            radius="full"
                            placeholder="Item's name"
                            size="3"
                            name="itemName"
                            id="itemName"
                            mt="2"
                            mb="3"
                            value={itemData.name}
                            required
                            onChange={(e) => {
                                let value = e.target.value;
                                value = value.charAt(0).toUpperCase() + value.substring(1);
                                setItemData({ ...itemData, name: value })
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
                            radius="full"
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
                                setItemData({ ...itemData, description: value })
                            }}
                        />

                        <Box
                            {...getRootProps({ className: 'dropzone' })}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                padding: '10px',
                                textAlign: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <input {...getInputProps()} />
                            <Text>Drag and drop image file here, or click to select file</Text>
                        </Box>

                    </Box>

                    <Box
                        style={{
                            textAlign: 'left',
                            minWidth: '200px',
                            width: '45%',
                            maxWidth: '600px'
                        }}
                    >
                        <Text
                            as='label'
                            htmlFor='knockback'
                            style={{ cursor: 'pointer' }}
                        >
                            Knockback
                        </Text>

                        <TextField.Root
                            radius="full"
                            size="3"
                            name="knockback"
                            id="knockback"
                            mt="2"
                            mb="3"
                            value={itemData.knockback}
                            required
                            onChange={(e) => {
                                let value = Number(e.target.value);
                                if (isNaN(value)) return;
                                else {
                                    if (value < 0 || value > 1000) return;
                                    else setItemData({ ...itemData, knockback: value });
                                }
                            }}
                        />

                        <Text
                            as='label'
                            htmlFor='circleDamage'
                            style={{ cursor: 'pointer' }}
                        >
                            Circle damage
                        </Text>

                        <TextField.Root
                            radius="full"
                            size="3"
                            name="circleDamage"
                            id="circleDamage"
                            mt="2"
                            mb="3"
                            value={itemData.stats.circleDamage}
                            required
                            onChange={(e) => {
                                let value = Number(e.target.value);
                                if (isNaN(value)) return;
                                else {
                                    if (value < 0 || value > 1000) return;
                                    else setItemData({ ...itemData, stats: { ...itemData.stats, circleDamage: value } });
                                }
                            }}
                        />

                        <Text
                            as='label'
                            htmlFor='squareDamage'
                            style={{ cursor: 'pointer' }}
                        >
                            Square damage
                        </Text>

                        <TextField.Root
                            radius="full"
                            size="3"
                            name="squareDamage"
                            id="squareDamage"
                            mt="2"
                            mb="3"
                            value={itemData.stats.squareDamage}
                            required
                            onChange={(e) => {
                                let value = Number(e.target.value);
                                if (isNaN(value)) return;
                                else {
                                    if (value < 0 || value > 1000) return;
                                    else setItemData({ ...itemData, stats: { ...itemData.stats, squareDamage: value } });
                                }
                            }}
                        />

                        <Text
                            as='label'
                            htmlFor='triangleDamage'
                            style={{ cursor: 'pointer' }}
                        >
                            Triangle damage
                        </Text>

                        <TextField.Root
                            radius="full"
                            size="3"
                            name="triangleDamage"
                            id="triangleDamage"
                            mt="2"
                            mb="3"
                            value={itemData.stats.triangleDamage}
                            required
                            onChange={(e) => {
                                let value = Number(e.target.value);
                                if (isNaN(value)) return;
                                else {
                                    if (value < 0 || value > 1000) return;
                                    else setItemData({ ...itemData, stats: { ...itemData.stats, triangleDamage: value } });
                                }
                            }}
                        />

                        <Text
                            as='label'
                            htmlFor='critChance'
                            style={{ cursor: 'pointer' }}
                        >
                            Crit chance
                        </Text>

                        <TextField.Root
                            radius="full"
                            size="3"
                            name="critChance"
                            id="critChance"
                            mt="2"
                            mb="3"
                            value={itemData.stats.critChance}
                            required
                            onChange={(e) => {
                                let value = Number(e.target.value);
                                if (isNaN(value)) return;
                                else {
                                    if (value < 0 || value > 100) return;
                                    else setItemData({ ...itemData, stats: { ...itemData.stats, critChance: value } });
                                }
                            }}
                        />

                        <Text
                            as='label'
                            htmlFor='critDamage'
                            style={{ cursor: 'pointer' }}
                        >
                            Crit damage
                        </Text>
                        <TextField.Root
                            radius="full"
                            size="3"
                            name="critDamage"
                            id="critDamage"
                            mt="2"
                            mb="3"
                            value={itemData.stats.critDamage}
                            required
                            onChange={(e) => {
                                let value = e.target.value;

                                if (value.includes(' ')) return;
                                if (value.charAt(0) === '.') return;

                                if (value.includes(".")) {
                                    const valuesParts = value.split(".");

                                    if (valuesParts.length > 2) return;
                                    else {
                                        const firstPart = valuesParts[0];
                                        const secondPart = valuesParts[1];

                                        if (!isNaN(firstPart) || firstPart <= 10) value = firstPart;
                                        else return;

                                        if (!isNaN(secondPart)) value += "." + secondPart;
                                        else return;

                                        if (value > 10) return;
                                        else setItemData({ ...itemData, stats: { ...itemData.stats, critDamage: value } });
                                    }
                                } else {
                                    if (!isNaN(value) && (value <= 10 && value >= 1) || value === '') setItemData({ ...itemData, stats: { ...itemData.stats, critDamage: value } });
                                    else return;
                                }
                            }}
                        />
                    </Box>
                </Flex>
            </Card>
        </Flex>
    )
}