import { Flex, Box, Text, Dialog, IconButton, TextField } from "@radix-ui/themes"
import { useState } from "react";
import { useEffect } from "react";
import ItemsTable from '../ItemsTable';
import { HiXMark } from "react-icons/hi2";
import DialogSpinner from "../DialogSpinner";
import MetadataTable from "../MetadataTable";

export default function AllMetadataDialog({ open, setOpen, handleSelectedModify }) {

    const [metadata, setMetadata] = useState([]);
    const [filteredMetadata, setFilteredMetadata] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMetadata();
    }, []);

    function getMetadata() {
        setLoading(true);
        fetch('https://squirkle-backend.vercel.app/api/get-all-metadatas')
            .then(async (resJSON) => {
                const res = await resJSON.json();
                if (res?.metadatas) {
                    setMetadata(res.metadatas);
                    setFilteredMetadata(res.metadatas);
                }
            })
            .catch(console.warn)
            .finally(() => setLoading(false));
    }

    function searchForItem(value) {
        if (value.trim().length === 0) {
            setFilteredMetadata(metadata);
            return;
        }

        setFilteredMetadata(metadata.filter((data) => data.id.toLowerCase().includes(value) || data.title.toLowerCase().includes(value) || data.description.toLowerCase().includes(value)));
        return;
    }

    return (
        <Dialog.Root open={open} setOpen={setOpen}>
            <Dialog.Content
                minWidth="80vw"
                style={{
                    padding: '20px',
                    borderRadius: '10px',
                    overflow: "auto",
                    background: '#21212c',
                    fontFamily: `"Fredoka", sans-serif`,
                    color: 'white',
                    boxShadow: '0px 0px 5px 2px gray'
                }}
            >

                <Dialog.Title>
                    <Flex
                        style={{
                            justifyContent: "space-between"
                        }}
                    >
                        <Text size='6' style={{ margin: '0 auto' }}>All metadata</Text>
                        <IconButton
                            className="button activeButton"
                            onClick={() => setOpen(false)}

                        >
                            <HiXMark />
                        </IconButton>
                    </Flex>

                </Dialog.Title>

                <Dialog.Description>
                    Search for a metadata or select one
                </Dialog.Description>

                {
                    loading
                        ?
                        <DialogSpinner />
                        :
                        <>
                            <TextField.Root
                                className="textField"
                                radius="none"
                                placeholder="Search for metadata"
                                size="3"
                                mt="2"
                                mb="3"
                                value={filterValue}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFilterValue(value);
                                    searchForItem(value.toLowerCase());
                                }}
                                style={{ marginBottom: '12px' }}
                            />

                            {
                                filteredMetadata.length > 0
                                    ?
                                    <MetadataTable metadata={filteredMetadata} handleSelectedModify={handleSelectedModify} />
                                    :
                                    <Flex style={{ width: '100%', justifyContent: 'center' }}>
                                        <Text size="5">No results found</Text>
                                    </Flex>
                            }
                        </>
                }

            </Dialog.Content>

        </Dialog.Root>
    )
}