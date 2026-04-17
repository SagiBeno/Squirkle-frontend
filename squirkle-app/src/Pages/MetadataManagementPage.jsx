import { useState, useEffect } from "react";
import { Flex, Box, SegmentedControl, Text, Button } from '@radix-ui/themes';
import AdminTextField from "../components/Inputs/AdminTextField";
import AdminTextArea from "../components/Inputs/AdminTextArea";
import Sketch from '@uiw/react-color-sketch';
import MetadataBlock from "../components/Cards/MetadataBlock";
import AdminSpinner from '../components/Spinners/AdminSpinner';
import AllMetadataDialog from "../components/Dialogs/AllMetadataDialog";
import DeleteAlert from "../components/DeleteAlert";
import NavbarForAdmin from "../components/Navbars/NavbarForAdmin";

export default function MetadataManagementPage({ user, setShowAppLoader, toastData, setToastData, signOut }) {

    const [metadata, setMetadata] = useState({
        id: '',
        title: '',
        description: '',
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
    });

    const [loading, setLoading] = useState(false);
    const [showMetadataDialog, setShowMetadataDialog] = useState(false);
    const [segmentedControlValue, setSegmentedControlValue] = useState('newMetadata');
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const isValid =
        metadata.title.trim().length > 0 &&
        metadata.description.trim().length > 0;

    useEffect(() => {
        setShowAppLoader(false);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 400) setIsMobile(true);
            else setIsMobile(false);
        }

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {

        if (segmentedControlValue === 'modifyMetadata') {
            setShowMetadataDialog(true);
        }

        else {
            setMetadata({
                id: '',
                title: '',
                description: '',
                backgroundColor: '#FFFFFF',
                textColor: '#000000'
            });
        }

    }, [segmentedControlValue]);

    function updateMetadata(field, value) {
        setMetadata(prev => ({
            ...prev,
            [field]: value
        }));
    }

    function handleNewMetadata() {

        if (user?.user.uid) {
            setLoading(true);
            const userId = user.user.uid;
            const reqBody = {
                userId: userId,
                ...metadata,
                title: metadata.title.trim(),
                description: metadata.description.trim()
            };

            fetch('https://squirkle-backend.vercel.app/api/create-metadata', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reqBody)
            })
                .then(async (resJSON) => {
                    const res = await resJSON.json();
                    if (res?.error) {
                        setToastData({ open: true, title: 'Status of the submission of new metadata', description: res.error, isError: true });
                    }

                    if (res?.message) {
                        setToastData({ open: true, title: 'Status of the submission of new metadata', description: res.message, isError: false });
                    }

                    if (resJSON.status === 201) {
                        setMetadata({
                            id: '',
                            title: '',
                            description: '',
                            backgroundColor: '#FFFFFF',
                            textColor: '#000000'
                        });
                    }
                })
                .catch((error) => {
                    console.warn(error);
                    setToastData({ open: true, title: 'Status of the submission of new metadata', description: 'An error occurred during the request. Please try again.', isError: true });
                })
                .finally(() => setLoading(false));
        }
    }

    function handleSelectedModify(data) {

        setLoading(true);

        fetch(`https://squirkle-backend.vercel.app/api/get-metadata/${data.id}`)
            .then(async (resJSON) => {
                const res = await resJSON.json();

                if (res?.metadata) {
                    setMetadata(res.metadata);
                    setShowMetadataDialog(false);
                }

                if (res?.error) {
                    setToastData({ open: true, title: 'Metadata query status', description: res.error, isError: true });
                }
            })
            .catch((error) => {
                console.warn(error);
                setToastData({ open: true, title: 'Metadata query status', description: 'An error occurred during the request. Please try again.', isError: true });
            })
            .finally(() => setLoading(false));
    }

    function handleDeleteMetadata() {

        if (user?.user?.uid) {
            setShowDeleteAlert(false);
            setLoading(true);
            const reqBody = { userId: user.user.uid };
            fetch(`https://squirkle-backend.vercel.app/api/delete-metadata/${metadata.id}`, {
                method: 'DELETE',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reqBody)
            })
                .then(async (resJSON) => {
                    const res = await resJSON.json();

                    if (resJSON.status === 200) {
                        setMetadata({
                            id: '',
                            title: '',
                            description: '',
                            backgroundColor: '#FFFFFF',
                            textColor: '#000000'
                        });

                        if (resJSON.status === 200) setSegmentedControlValue('newMetadata');
                    }

                    if (res?.error) {
                        setToastData({ open: true, title: 'Deletion status', description: res.error, isError: true });
                    }

                    if (res?.message) {
                        setToastData({ open: true, title: 'Deletion status', description: res.message, isError: false });
                    }
                })
                .catch((error) => {
                    console.warn(error);
                    setToastData({ open: true, title: 'Deletion status', description: 'An error occurred during the request. Please try again.', isError: true });
                })
                .finally(() => setLoading(false));
        }
    }

    function handleModifyMetadata() {
        setLoading(true);
        const reqBody = {
            userId: user.user.uid,
            ...metadata
        };

        fetch(`https://squirkle-backend.vercel.app/api/update-metadata/${metadata.id}`, {
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

                if (resJSON.status === 200) setSegmentedControlValue('newMetadata');
            })
            .catch((error) => {
                console.warn(error);
                setToastData({ open: true, title: 'Status of the amendment', description: 'An error occurred during the request. Please try again.', isError: true });
            })
            .finally(() => setLoading(false));
    }


    return (
        <>
            <Flex className='mainContainer'>

                <NavbarForAdmin user={user} signOut={signOut} />
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
                            size={isMobile ? "1" : "2"}
                            onValueChange={(value) => { setSegmentedControlValue(value) }}
                            value={segmentedControlValue}
                            style={{
                                backgroundColor: '#bababa',
                                padding: 0,
                                marginBottom: '10px',
                            }}
                        >
                            <SegmentedControl.Item value="newMetadata">New metadata</SegmentedControl.Item>
                            <SegmentedControl.Item value="modifyMetadata">Modify metadata</SegmentedControl.Item>
                        </SegmentedControl.Root>


                        {
                            segmentedControlValue === 'newMetadata'
                                ?
                                <Text size="8" style={{ fontWeight: 'bold', marginBottom: "20px" }}>Create new metadata</Text>
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
                                    <Text size="8" className='text' style={{ fontWeight: 'bold', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>Modify metadata</Text>
                                    {segmentedControlValue === 'modifyMetadata' && <Button className='button activeButton' onClick={() => setShowMetadataDialog(true)} >Select another metadata</Button>}
                                </Flex>
                        }

                        <Flex
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                flexWrap: 'wrap'
                            }}
                        >
                            <Box
                                style={{
                                    width: '20%',
                                    minWidth: '220px',
                                    maxWidth: '600px',
                                }}
                            >
                                <Text size="4" style={{ marginBottom: '20px' }}>Text color</Text>
                                <Sketch
                                    color={metadata.textColor}
                                    onChange={(e) => {
                                        let value = e.hex;
                                        updateMetadata('textColor', value);
                                    }}
                                    style={{ margin: '0 auto 10px auto' }}
                                />
                            </Box>

                            <Flex
                                style={{
                                    width: '80%',
                                    minWidth: '200px',
                                    maxWidth: '600px',
                                    flexDirection: 'column',
                                    justifyContent: 'center'
                                }}
                            >
                                <AdminTextField
                                    title="Metadata ID"
                                    placeholder="META_DATA"
                                    name="metadataID"
                                    id="metadataID"
                                    value={metadata.id}
                                    onChange={(e) => {
                                        console.log(metadata.id);
                                        let value = e.target.value;
                                        value = value.toUpperCase();
                                        if (value.includes(' ')) value = value.replace(' ', '_');
                                        updateMetadata('id', value);
                                    }}
                                />

                                <AdminTextField
                                    title="Metadata's title"
                                    placeholder="Metadata's title"
                                    name="metadataName"
                                    id="metadataName"
                                    value={metadata.title}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        value = value.charAt(0).toUpperCase() + value.substring(1);
                                        updateMetadata('title', value);
                                    }}
                                />

                                <AdminTextArea
                                    title="Metadata's description"
                                    placeholder="Metadata's description"
                                    name='metadataDescription'
                                    id='metadataDescription'
                                    value={metadata.description}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        value = value.charAt(0).toUpperCase() + value.slice(1);
                                        updateMetadata('description', value);
                                    }}
                                />
                            </Flex>
                        </Flex>

                        <Flex
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                flexWrap: 'wrap'
                            }}
                        >
                            <Box
                                style={{
                                    width: '20%',
                                    minWidth: '220px',
                                    maxWidth: '600px',
                                }}
                            >
                                <Text size="4" style={{ marginBottom: '20px' }}>Backgorund color</Text>
                                <Sketch
                                    color={metadata.backgroundColor}
                                    onChange={(e) => {
                                        let value = e.hex;
                                        updateMetadata('backgroundColor', value);
                                    }}
                                    style={{ margin: '0 auto 10px auto' }}
                                />
                            </Box>
                            <Box
                                style={{
                                    width: '80%',
                                    minWidth: '200px',
                                    maxWidth: '600px',
                                }}
                            >
                                <Text size="4">Preview</Text>
                                <MetadataBlock meta={metadata} />
                            </Box>
                        </Flex>
                        {
                            segmentedControlValue === 'newMetadata'
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
                                    onClick={handleNewMetadata}
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
                                        onClick={handleModifyMetadata}
                                    >
                                        Submit
                                    </Button>

                                    <Button
                                        className={`button ${isValid ? 'activeButton' : 'inactiveButton'}`}
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
            </Flex>

            {
                loading && <AdminSpinner />
            }

            {
                showMetadataDialog === true &&
                <AllMetadataDialog
                    open={showMetadataDialog}
                    setOpen={setShowMetadataDialog}
                    handleSelectedModify={handleSelectedModify}
                />
            }

            {
                showDeleteAlert === true &&
                <DeleteAlert
                    open={showDeleteAlert}
                    setOpen={setShowDeleteAlert}
                    data={metadata}
                    itemID={metadata.id}
                    handleDelete={handleDeleteMetadata}
                    title='Delete metadata'
                    description='Are you sure you want to delete the following metadata?'
                />
            }
        </>
    )
}