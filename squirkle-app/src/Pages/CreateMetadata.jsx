import { useState } from "react";
import { Flex, Box, SegmentedControl, Text, Button } from '@radix-ui/themes';
import AdminTextField from "../components/AdminTextField";
import AdminTextArea from "../components/AdminTextArea";
import Sketch from '@uiw/react-color-sketch';
import MetadataBlock from "../components/MetadataBlock";

export default function CreateMetadata({ user }) {

    const [metadata, setMetadata] = useState({
        title: '',
        description: '',
        backgroundColor: '#FFFFFF',
        textColor: '#000000'
    });

    const isValid =
        metadata.title.trim().length > 0 &&
        metadata.description.trim().length > 0;

    const [segmentedControlValue, setSegmentedControlValue] = useState('newMetadata');

    function updateMetadata(field, value) {
        setMetadata(prev => ({
            ...prev,
            [field]: value
        }));
    }

    function handleNewMetadata() {

        if (user?.user.uid) {
            const userId = user.user.uid;
            const metadataID = metadata.title.toUpperCase().replace(' ', '_');
            const reqBody = {
                userId: userId,
                id: metadataID,
                ...metadata,
                title: metadata.title.trim(),
                description: metadata.description.trim()
            };

            fetch('https://squirkle-backend.vercel.app/api/create-metadata', {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(reqBody)
            })
                .then(async (resJSON) => {
                    const res = await resJSON.json();
                    console.log(res);
                })
                .catch(console.warn);
        }

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
                            <SegmentedControl.Item value="newMetadata">New metadata</SegmentedControl.Item>
                            <SegmentedControl.Item value="modifyMetadata">Modify metadata</SegmentedControl.Item>
                        </SegmentedControl.Root>

                        <Text
                            size="8"
                            style={{
                                fontWeight: 'bold',
                                marginBottom: "20px"
                            }}
                        >
                            {
                                segmentedControlValue === 'newMetadata' ? 'Create new metadata' : 'Modify metadata'
                            }
                        </Text>

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
                                    minWidth: '300px',
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

                            <Box
                                style={{
                                    width: '80%',
                                    minWidth: '300px',
                                    maxWidth: '600px',
                                }}
                            >
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
                            </Box>
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
                                    minWidth: '300px',
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
                                    minWidth: '300px',
                                    maxWidth: '600px',
                                }}
                            >
                                <Text size="4">Test</Text>
                                <MetadataBlock meta={metadata} />
                            </Box>
                        </Flex>
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
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}