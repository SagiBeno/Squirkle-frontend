import { Box, Flex, Card, Text, TextField, TextArea, Table, IconButton, Button, Select } from '@radix-ui/themes';
import Navbar from '../components/Navbar';
import { useCallback, useState } from 'react';
import Dropzone, { useDropzone } from "react-dropzone";
import { PlusIcon, MinusIcon } from '@radix-ui/react-icons';
import AdminTextField from '../components/AdminTextField';
import { MdDelete } from "react-icons/md";
import { RiContactsBookLine } from 'react-icons/ri';

export default function NewItemPage({ user }) {

    const [itemData, setItemData] = useState({
        name: "",
        typeOfItem: "",
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

    const [file, setFile] = useState();

    function uploadImage(file) {

        if (user.user?.uid) {

            let formData = new FormData();
            formData.append("file", file);
            formData.append("userId", user.user.uid)

            fetch('https://squirkle-backend.vercel.app/api/upload-image', {
                method: 'POST',
                body: formData
            })
                .then(async (resJSON) => {
                    const res = await resJSON.json();
                    setItemData({ ...itemData, imageUrl: res.url });
                })
                .catch(console.warn);
        }
    }

    function deleteImage () {
        
        fetch('https://squirkle-backend.vercel.app/api/delete-image', {
            method: 'DELETE',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ userId: user.user.uid, filename: file.name })
        })
            .then(res => {
                if (res.status === 200) setItemData( { ...itemData, imageUrl: "" } );
            })
            .catch(console.warn)
    }

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles?.[0];
        if (!file) return;
        else {
            setFile(file);
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
                                    onValueChange={(value) => setItemData({ ...itemData, typeOfItem: value })}
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
                                    setItemData({ ...itemData, description: value })
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
                                        onClick={() => {
                                            setItemData({ ...itemData, stats: { ...itemData.stats, metadata: [...itemData.stats.metadata, ''] } });
                                        }}
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
                                                value={itemData.stats.metadata[idx]}
                                                required
                                                onChange={(e) => {
                                                    let array = itemData.stats.metadata;
                                                    array[idx] = e.target.value.trim();
                                                    setItemData({ ...itemData, stats: { ...itemData.stats, metadata: array } });
                                                }}
                                                placeholder='Matedata'
                                                style={{
                                                    width: '100%',
                                                    marginRight: '5px'
                                                }}
                                            />

                                            <IconButton
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    let array = itemData.stats.metadata
                                                    array.splice(idx, 1);
                                                    setItemData({ ...itemData, stats: { ...itemData.stats, metadata: [...array] } });
                                                }}
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
                                onChange={(e) => {
                                    let value = Number(e.target.value);
                                    if (isNaN(value)) return;
                                    else {
                                        if (value < 0 || value > 1000) return;
                                        else setItemData({ ...itemData, knockback: value });
                                    }
                                }}
                            />

                            <AdminTextField
                                title="Circle damage"
                                placeholder="Circle damage"
                                name="circleDamage"
                                id="circleDamage"
                                value={itemData.stats.circleDamage}
                                onChange={(e) => {
                                    let value = Number(e.target.value);
                                    if (isNaN(value)) return;
                                    else {
                                        if (value < 0 || value > 1000) return;
                                        else setItemData({ ...itemData, stats: { ...itemData.stats, circleDamage: value } });
                                    }
                                }}
                            />

                            <AdminTextField
                                title="Square damage"
                                placeholder="Square damage"
                                name="squareDamage"
                                id="squareDamage"
                                value={itemData.stats.circleDamage}
                                onChange={(e) => {
                                    let value = Number(e.target.value);
                                    if (isNaN(value)) return;
                                    else {
                                        if (value < 0 || value > 1000) return;
                                        else setItemData({ ...itemData, stats: { ...itemData.stats, squareDamage: value } });
                                    }
                                }}
                            />

                            <AdminTextField
                                title="Triangle damage"
                                placeholder="Triangle damage"
                                name="triangleDamage"
                                id="triangleDamage"
                                value={itemData.stats.triangleDamage}
                                onChange={(e) => {
                                    let value = Number(e.target.value);
                                    if (isNaN(value)) return;
                                    else {
                                        if (value < 0 || value > 1000) return;
                                        else setItemData({ ...itemData, stats: { ...itemData.stats, triangleDamage: value } });
                                    }
                                }}
                            />

                            <AdminTextField
                                title="Crit chance"
                                placeholder="Crit chance"
                                name="critChance"
                                id="critChance"
                                value={itemData.stats.critChance}
                                onChange={(e) => {
                                    let value = Number(e.target.value);
                                    if (isNaN(value)) return;
                                    else {
                                        if (value < 0 || value > 100) return;
                                        else setItemData({ ...itemData, stats: { ...itemData.stats, critChance: value } });
                                    }
                                }}
                            />

                            <AdminTextField
                                title="Crit damage"
                                placeholder="Crit damage"
                                name="critDamage"
                                id="critDamage"
                                value={itemData.stats.critDamage}
                                onChange={(e) => {
                                    let value = e.target.value;

                                    if (value.includes(' ')) return;
                                    if (value.charAt(0) === '.') return;

                                    if (value.includes(".")) {
                                        const valuesParts = value.split(".");

                                        if (valuesParts.length !== 2) return;
                                        else {
                                            const firstPart = valuesParts[0];
                                            const secondPart = valuesParts[1];

                                            if (!isNaN(firstPart) || firstPart <= 10) value = firstPart;
                                            else return;

                                            if (!isNaN(secondPart) && secondPart.length < 3) value += "." + secondPart;
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

                    <Button
                        radius='none'
                        size='3'
                        style={{
                            width: "95%",
                            cursor: 'pointer',
                            backgroundColor: "darkgray",
                            margin: "0 auto",
                            borderBottom: "8px rgba(0, 0, 0, 0.1) solid"
                        }}
                    >
                        Submit
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    )
}