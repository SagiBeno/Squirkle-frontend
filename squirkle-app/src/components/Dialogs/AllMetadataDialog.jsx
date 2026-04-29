import { Flex, Box, Text, Dialog, IconButton, TextField } from "@radix-ui/themes"
import { useState, useEffect } from "react";
import { HiXMark } from "react-icons/hi2";
import DialogSpinner from '../Spinners/DialogSpinner';
import MetadataTable from "../AdminComponents/MetadataTable";

/**
 * @typedef { import('../Cards/MetadataBlock').Metadata } Metadata
 */

/**
 * Dialog for displaying and selecting metadata entries.
 * 
 * Fetches all metadata from the backend, allows searching,
 * and lets the user select one for modification.
 * 
 * @param { Object } props
 * @param { boolean } props.open - Controls whether the dialog is visible
 * @param { Function } props.setOpen - Function to update dialog visibility
 * @param { Function } props.handleSelectedModify - Function called when a metadata entry is selected
 * 
 * @returns { JSX.Element } Metadata selection dialog
 */

export default function AllMetadataDialog({ open, setOpen, handleSelectedModify }) {

    const [metadata, setMetadata] = useState([]);
    const [filteredMetadata, setFilteredMetadata] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMetadata();
    }, []);

    /**
     * Fetches all metadata entries from the backend.
     * 
     * Initializes both full and filtered metadata lists. 
     * 
     * @returns { void }
     */
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

    /**
     * Filteres metadata based on search input.
     * 
     * Matches by id, title, or description (case-insensitive).
     * 
     * @param { string } value - Search text
     * @returns { void }
     */
    function searchForMetadata(value) {
        if (value.trim().length === 0) {
            setFilteredMetadata(metadata);
            return;
        }

        setFilteredMetadata(metadata.filter((data) => (data?.id?.toLowerCase() ?? "").includes(value) || data.title.toLowerCase().includes(value) || data.description.toLowerCase().includes(value)));
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Content
                minWidth="80vw"
                style={{
                    padding: '20px',
                    borderRadius: '10px',
                    overflow: "auto",
                    fontFamily: `"Fredoka", sans-serif`,
                    color: 'white',
                    boxShadow: '0px 0px 6px 0px rgb(186, 186, 206)',
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
                                    searchForMetadata(value.toLowerCase());
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