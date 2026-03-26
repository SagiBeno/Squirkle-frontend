import { useState } from "react";
import { Flex, Box, SegmentedControl, Text } from '@radix-ui/themes';
import AdminTextField from "../components/AdminTextField";
import AdminTextArea from "../components/AdminTextArea";
import Sketch from '@uiw/react-color-sketch';

export default function CreateMetadata({ user }) {

    const [metadata, setMetadata] = useState({
        title: '',
        description: '',
        backgroundColor: '',
        textColor: ''
    });

    const [segmentedControlValue, setSegmentedControlValue] = useState('newMetadata');

    function updateMetadata(field, value) {
        setMetadata(prev => ({
            ...prev,
            [field]: value
        }));
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
                                justifyContent: 'space-around',
                                textAlign: 'left',
                                flexDirection: 'column',
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

                            <Flex
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    flexWrap: 'wrap'
                                }}
                            >
                                <Flex
                                    style={{
                                        minWidth: '300px',
                                        maxWidth: '700px',
                                        width: '50%',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        marginTop: '10px'
                                    }}
                                >
                                    <Text size="4" style={{ marginBottom: '10px' }}>Background color</Text>
                                    <Sketch
                                        onChange={(e) => {
                                            let value = e.hex;
                                            updateMetadata('backgoundColor', value);
                                        }}
                                    />
                                </Flex>

                                <Flex
                                    style={{
                                        minWidth: '300px',
                                        maxWidth: '700px',
                                        width: '50%',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        marginTop: '10px'
                                    }}    
                                >
                                    <Text size="4" style={{ marginBottom: '10px' }}>Text color</Text>
                                    <Sketch
                                        onChange={(e) => {
                                            let value = e.hex;
                                            updateMetadata('textColor', value);
                                        }}
                                    />
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}