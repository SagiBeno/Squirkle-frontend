import { Box, Flex, Card, Text, TextField, TextArea, Table, IconButton, Button, Select, SegmentedControl } from '@radix-ui/themes';
import Navbar from '../components/Navbar';
import { useCallback, useState, useEffect } from 'react';
import Dropzone, { useDropzone } from "react-dropzone";
import { PlusIcon, MinusIcon } from '@radix-ui/react-icons';
import AdminTextField from '../components/AdminTextField';
import { MdDelete } from "react-icons/md";
import AllItemsDialog from '../components/Dialogs/AllItemsDialog';
import DeleteAlert from '../components/DeleteAlert';
import AdminTextArea from '../components/AdminTextArea';
import AdminSpinner from '../components/AdminSpinner';

export default function ItemManagementPage({ user, toastData, setToastData, setShowAppLoader }) {

    const [itemData, setItemData] = useState({
        name: "",
        type: "",
        description: "",
        imageUrl: "",
        knockback: "0",
        stats: {
            circleDamage: 0,
            squareDamage: 0,
            triangleDamage: 0,
            critChance: 0,
            critDamage: "1.0",
            metadata: []
        }
    });

    const [segmentedControlValue, setSegmentedControlValue] = useState('newItem');
    const [file, setFile] = useState();
    const [showItemsDialog, setShowItemsDialog] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [loading, setLoading] = useState(false);

    const isValid =
        itemData.name.trim().length > 0 &&
        itemData.type.trim().length > 0 &&
        itemData.description.trim().length > 0 &&
        itemData.imageUrl.length > 0 &&
        itemData.stats?.metadata?.every(data => data.trim().length > 0) &&
        itemData.knockback.length > 0 &&
        itemData.stats.critDamage.length > 0;

    useEffect(() => {
        setShowAppLoader(false);
    }, []);

    useEffect(() => {

        if (segmentedControlValue === 'modifyItem') {
            setShowItemsDialog(true);
        }

        else {
            setItemData({
                name: "",
                type: "",
                description: "",
                imageUrl: "",
                knockback: "0",
                stats: {
                    circleDamage: 0,
                    squareDamage: 0,
                    triangleDamage: 0,
                    critChance: 0,
                    critDamage: "1.0",
                    metadata: []
                }
            })
        }

    }, [segmentedControlValue]);

    function uploadImage(file) {

        if (user.user?.uid) {
            setLoading(true);
            let formData = new FormData();
            formData.append("file", file);
            formData.append("userId", user.user.uid)

            fetch('https://squirkle-backend.vercel.app/api/upload-image', {
                method: 'POST',
                body: formData
            })
                .then(async (resJSON) => {
                    const res = await resJSON.json();
                    if (res?.url) {
                        setItemData(prev => ({ ...prev, imageUrl: res.url, imageName: file.name }));
                        setToastData({ open: true, title: 'Image upload status', description: 'The image has been successfully uploaded.', isError: false });
                    }

                    if (res?.error) {
                        setToastData({ open: true, title: 'Image upload status', description: res.error, isError: true });
                    }
                })
                .catch((error) => {
                    console.warn(errorJSON);
                    setToastData({ open: true, title: 'Item query status', description: 'An error occurred during the request. Please try again.', isError: true });
                })
                .finally(() => setLoading(false));
        }
    }

    function deleteImage() {

        setLoading(true)
        fetch('https://squirkle-backend.vercel.app/api/delete-image', {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.user.uid, filename: file.name })
        })
            .then(async (resJSON) => {
                const res = await resJSON.json();
                if (resJSON.status === 200) setItemData(prev => ({ ...prev, imageUrl: "" }));

                if (res?.error) {
                    setToastData({ open: true, title: 'Image deletion status', description: res.error, isError: true });
                }

                if (res?.message) {
                    setToastData({ open: true, title: 'Image deletion status', description: res.message, isError: false });
                }
            })
            .catch((error) => {
                console.warn(errorJSON);
                setToastData({ open: true, title: 'Item query status', description: 'An error occurred during the request. Please try again.', isError: true });
            })
            .finally(() => setLoading(false));
    }

    function handleNewItem() {

        setLoading(true);
        const itemId = itemData.name.toUpperCase().replace(' ', '_');
        const reqBody = {
            userId: user.user.uid,
            id: itemId,
            ...itemData,
            knockback: Number(itemData.knockback),
            stats: {
                ...itemData.stats,
                critDamage: Number(itemData.stats.critDamage)
            }
        };

        fetch('https://squirkle-backend.vercel.app/api/create-item', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reqBody)
        })
            .then(async resJSON => {
                const res = await resJSON.json();
                if (res?.error) {
                    setToastData({ open: true, title: 'Status of the new item submission', description: res.error, isError: true });
                }

                if (res?.message) {
                    setToastData({ open: true, title: 'Status of the new item submission', description: res.message, isError: false });
                }

                if (resJSON.status === 201) {
                    setItemData({
                        name: "",
                        type: "",
                        description: "",
                        imageUrl: "",
                        knockback: "0",
                        stats: {
                            circleDamage: 0,
                            squareDamage: 0,
                            triangleDamage: 0,
                            critChance: 0,
                            critDamage: "1.0",
                            metadata: []
                        }
                    })
                }
            })
            .catch((error) => {
                console.warn(errorJSON);
                setToastData({ open: true, title: 'Item query status', description: 'An error occurred during the request. Please try again.', isError: true });
            })
            .finally(() => setLoading(false));
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

    function updateItemField(field, value) {
        setItemData(prev => ({
            ...prev,
            [field]: value
        }));
    }

    function handleSelectedModify(item) {

        setLoading(true);

        fetch(`https://squirkle-backend.vercel.app/api/get-item/${item.id}`)
            .then(async (resJSON) => {
                const res = await resJSON.json();

                if (res?.item) {
                    const modifyItemData = {
                        itemID: item.id,
                        ...res.item,
                        knockback: res.item.knockback.toString(),
                        stats: {
                            ...res.item.stats,
                            critDamage: res.item.stats.critDamage.toString()
                        }
                    }

                    setFile({ name: modifyItemData.imageName });
                    setItemData(modifyItemData);
                    setShowItemsDialog(false);
                }

                if (res?.error) {
                    setToastData({ open: true, title: 'Item query status', description: res.error, isError: true });
                }
            })
            .catch((error) => {
                console.warn(errorJSON);
                setToastData({ open: true, title: 'Item query status', description: 'An error occurred during the request. Please try again.', isError: true });
            })
            .finally(() => setLoading(false));
    }

    function updateNumberField(section, field, rawValue, min, max) {

        const value = Number(rawValue);

        if (isNaN(value)) return;
        if (value < min || value > max) return;

        if (section === 'root') {
            updateItemField(field, value);
            return;
        }
        else {
            updateStatsField(field, value);
            return;
        }
    }

    function updateStatsField(field, value) {

        setItemData(prev => ({
            ...prev,
            stats: {
                ...prev.stats,
                [field]: value
            }
        }));
    }

    function handleDecimalChange(field, value, min, max) {

        if (value === '' && field === 'critDamage') {
            updateStatsField(field, "");
            return;
        }

        if (value === '' && field === 'knockback') {
            updateItemField(field, '');
            return;
        }

        const regex = /^\d+(\.\d{0,2})?$/;

        if (!regex.test(value)) return;

        const numberValue = Number(value);

        if (isNaN(numberValue)) return;
        if (numberValue < min || numberValue > max) return;

        if (field === 'critDamage') {
            updateStatsField(field, value);
            return;
        }

        if (field === 'knockback') {
            updateItemField(field, value);
            return;
        }
    }

    function addMetadata() {
        setItemData(prev => ({
            ...prev,
            stats: {
                ...prev.stats,
                metadata: [...prev.stats.metadata, '']
            }
        }));
    }

    function updateMetadata(index, value) {
        setItemData(prev => {
            const newMetadata = [...prev.stats.metadata];
            newMetadata[index] = value;

            return {
                ...prev,
                stats: {
                    ...prev.stats,
                    metadata: newMetadata
                }
            }
        });
    }

    function removeMetadata(index) {

        setItemData(prev => {
            const newMetadata = [...prev.stats.metadata];
            newMetadata.splice(index, 1);

            return {
                ...prev,
                stats: {
                    ...prev.stats,
                    metadata: newMetadata
                }
            }
        });
    }

    function handleDeleteItem() {

        if (user?.user?.uid) {
            setShowDeleteAlert(false);
            setLoading(true);
            const reqBody = { userId: user.user.uid };
            fetch(`https://squirkle-backend.vercel.app/api/delete-item/${itemData.itemID}`, {
                method: 'DELETE',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reqBody)
            })
                .then(async (resJSON) => {
                    const res = await resJSON.json();

                    if (resJSON.status === 200) {
                        setItemData({
                            name: "",
                            type: "",
                            description: "",
                            imageUrl: "",
                            knockback: "0",
                            stats: {
                                circleDamage: 0,
                                squareDamage: 0,
                                triangleDamage: 0,
                                critChance: 0,
                                critDamage: "1.0",
                                metadata: []
                            }
                        });

                        if (resJSON.status === 200) setSegmentedControlValue('newItem');
                    }

                    if (res?.error) {
                        setToastData({ open: true, title: 'Deletion status', description: res.error, isError: true });
                    }

                    if (res?.message) {
                        setToastData({ open: true, title: 'Deletion status', description: res.message, isError: false });
                    }
                })
                .catch((error) => {
                    console.warn(errorJSON);
                    setToastData({ open: true, title: 'Item query status', description: 'An error occurred during the request. Please try again.', isError: true });
                })
                .finally(() => setLoading(false));
        }
    }

    function handleModifyItem() {
        setLoading(true);
        const reqBody = {
            userId: user.user.uid,
            ...itemData,
            knockback: Number(itemData.knockback),
            stats: {
                ...itemData.stats,
                critDamage: Number(itemData.stats.critDamage)
            }
        };

        fetch(`https://squirkle-backend.vercel.app/api/update-item/${reqBody.itemID}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reqBody)
        })
            .then(async (resJSON) => {
                const res = await resJSON.json();
                if (res?.error) {
                    setToastData({ open: true, title: 'Status of the amendment', description: res.error, isError: true });
                }

                if (res?.message) {
                    setToastData({ open: true, title: 'Status of the amendment', description: res.message, isError: false });
                }

                if (resJSON.status === 200) setSegmentedControlValue('newItem');
            })
            .catch((error) => {
                console.warn(errorJSON);
                setToastData({ open: true, title: 'Item query status', description: 'An error occurred during the request. Please try again.', isError: true });
            })
            .finally(() => setLoading(false));
    }

    return (
        <>
            <Flex className='mainContainer'>

                <Box className='navbarSpacer' />

                <Flex className='contentContainer'>
                    <Flex
                        style={{
                            margin: '20px',
                            width: '95%',
                            textAlign: 'center',
                            flexDirection: 'column',
                            background: 'linear-gradient(180deg, #1e1e28, #21212c)',
                            boxShadow: '0px 0px 10px 2px #bababa',
                            padding: '20px',
                            borderRadius: '20px',
                            color: 'white',
                        }}
                    >

                        <SegmentedControl.Root
                            radius="none"
                            size="2"
                            onValueChange={(value) => { setSegmentedControlValue(value) }}
                            value={segmentedControlValue}
                            style={{
                                backgroundColor: '#bababa',
                                padding: 0,
                                marginBottom: '10px'
                            }}
                        >
                            <SegmentedControl.Item value="newItem">New item</SegmentedControl.Item>
                            <SegmentedControl.Item value="modifyItem">Modify item</SegmentedControl.Item>
                        </SegmentedControl.Root>

                        {
                            segmentedControlValue === 'newItem'
                                ?
                                <Text size="8" style={{ fontWeight: 'bold', marginBottom: "20px" }}>Create new item</Text>
                                :
                                <Flex
                                    className='modifyWrapper'
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'end',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        marginBottom: '20px',
                                        position: 'relative'
                                    }}
                                >
                                    <Text size="8" className='text' style={{ fontWeight: 'bold', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>Modify item</Text>
                                    {segmentedControlValue === 'modifyItem' && <Button className='button activeButton' onClick={() => setShowItemsDialog(true)}>Select another item</Button>}
                                </Flex>
                        }

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
                                        alignItems: "center",
                                        marginBottom: '12px'
                                    }}
                                >
                                    <Text
                                        size='4'
                                        style={{
                                            marginRight: "5px"
                                        }}
                                    >
                                        Type of item
                                    </Text>

                                    <Select.Root
                                        onValueChange={(value) => updateItemField('type', value)}
                                        value={itemData.type}
                                    >
                                        <Select.Trigger />
                                        <Select.Content
                                            color='gold'
                                            style={{
                                                borderRadius: 0,
                                                background: '#bababa',
                                                border: '3px solid #d5d5d5',
                                            }}
                                        >
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

                                <AdminTextArea
                                    title="Item's description"
                                    placeholder="Item's description"
                                    name='itemDescription'
                                    id='itemDescription'
                                    value={itemData.description}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        value = value.charAt(0).toUpperCase() + value.slice(1);
                                        updateItemField('description', value);
                                    }}
                                />

                                <Box>
                                    <Flex
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginTop: '10px',
                                            marginBottom: '12px'

                                        }}
                                    >
                                        <Text size='4'>
                                            Item's metadata
                                        </Text>
                                        <IconButton
                                            className="button activeButton"
                                            onClick={addMetadata}
                                        >
                                            <PlusIcon />
                                        </IconButton>
                                    </Flex>

                                    {
                                        itemData.stats.metadata?.map((data, idx) => (
                                            <Flex
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    marginBottom: '15px'
                                                }}
                                                key={idx}
                                            >
                                                <TextField.Root
                                                    className='textField'
                                                    radius="none"
                                                    size="3"
                                                    mb="1"
                                                    value={data}
                                                    required
                                                    onChange={(e) => updateMetadata(idx, e.target.value.trim())}

                                                    placeholder='Matedata'
                                                    style={{
                                                        width: '100%',
                                                        marginRight: '5px',
                                                    }}
                                                />

                                                <IconButton
                                                    className="button activeButton"
                                                    onClick={() => removeMetadata(idx)}
                                                >
                                                    <MinusIcon />
                                                </IconButton>
                                            </Flex>
                                        ))
                                    }
                                </Box>

                                <Text
                                    size='4'
                                    as='label'
                                    htmlFor='itemImage'
                                    style={{ cursor: 'pointer', marginBottom: '10px' }}
                                >
                                    Item's image
                                </Text>

                                <Box
                                    {...getRootProps({ className: 'dropzone' })}
                                    style={{
                                        backgroundColor: '#bababa',
                                        borderBottom: '6px solid #626262',
                                        padding: '10px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        margin: '10px 0px',
                                        color: 'black'
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
                                    onChange={(e) => { handleDecimalChange('knockback', e.target.value, 0, 10.99) }}
                                />

                                <AdminTextField
                                    title="Circle damage"
                                    placeholder="Circle damage"
                                    name="circleDamage"
                                    id="circleDamage"
                                    value={itemData.stats.circleDamage}
                                    onChange={(e) => { updateNumberField('stats', 'circleDamage', e.target.value, 0, 1000) }}
                                />

                                <AdminTextField
                                    title="Square damage"
                                    placeholder="Square damage"
                                    name="squareDamage"
                                    id="squareDamage"
                                    value={itemData.stats.squareDamage}
                                    onChange={(e) => { updateNumberField('stats', 'squareDamage', e.target.value, 0, 1000) }}
                                />

                                <AdminTextField
                                    title="Triangle damage"
                                    placeholder="Triangle damage"
                                    name="triangleDamage"
                                    id="triangleDamage"
                                    value={itemData.stats.triangleDamage}
                                    onChange={(e) => { updateNumberField('stats', 'triangleDamage', e.target.value, 0, 1000) }}
                                />

                                <AdminTextField
                                    title="Crit chance"
                                    placeholder="Crit chance"
                                    name="critChance"
                                    id="critChance"
                                    value={itemData.stats.critChance}
                                    onChange={(e) => { updateNumberField('stats', 'critChance', e.target.value, 0, 100) }}
                                />

                                <AdminTextField
                                    title="Crit damage"
                                    placeholder="Crit damage"
                                    name="critDamage"
                                    id="critDamage"
                                    value={itemData.stats.critDamage}
                                    onChange={(e) => { handleDecimalChange('critDamage', e.target.value, 1, 10.99) }}
                                />
                            </Box>

                        </Flex>

                        {
                            segmentedControlValue === 'newItem'
                                ?
                                <Button
                                    className={`button ${isValid ? 'activeButton' : 'inactiveButton'}`}
                                    disabled={!isValid}
                                    radius='none'
                                    size='3'
                                    style={{
                                        width: "100%",
                                        margin: "10px auto",
                                    }}
                                    onClick={handleNewItem}
                                >
                                    Submit
                                </Button>
                                :
                                <Flex
                                    style={{
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Button
                                        className={`button ${isValid ? 'activeButton' : 'inactiveButton'}`}
                                        disabled={!isValid}
                                        radius='none'
                                        size='3'
                                        style={{
                                            width: "45%",
                                            margin: "10px auto",
                                        }}
                                        onClick={handleModifyItem}
                                    >
                                        Submit
                                    </Button>

                                    <Button
                                        className='button activeButton'
                                        radius='none'
                                        size='3'
                                        style={{
                                            width: "45%",
                                            margin: "10px auto",
                                        }}
                                        onClick={() => setShowDeleteAlert(true)}
                                    >
                                        Delete
                                    </Button>
                                </Flex>
                        }

                    </Flex>
                </Flex>
                <Box style={{ minHeight: "10px" }} />
            </Flex>
            {
                showItemsDialog === true &&
                <AllItemsDialog
                    open={showItemsDialog}
                    setOpen={setShowItemsDialog}
                    handleSelectedModify={handleSelectedModify}
                />
            }

            {
                showDeleteAlert === true &&
                <DeleteAlert
                    open={showDeleteAlert}
                    setOpen={setShowDeleteAlert}
                    data={itemData}
                    itemID={itemData.itemID}
                    handleDelete={handleDeleteItem}
                    title='Delete item'
                    description='Are you sure you want to delete the following item?'
                />
            }

            {
                loading && <AdminSpinner />
            }
        </>
    )
}