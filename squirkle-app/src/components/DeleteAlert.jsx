import { AlertDialog, Button, Flex, DataList, Code } from "@radix-ui/themes"

export default function DeleteAlert({ open, setOpen, data, itemID, handleDelete }) {

    return (
        <AlertDialog.Root open={open} setOpen={setOpen}>
            <AlertDialog.Content maxWidth="450px">
                <AlertDialog.Title>Delete item</AlertDialog.Title>
                <AlertDialog.Description size="2">
                    Are you sure you want to delete the following item?
                </AlertDialog.Description>

                <Flex
                    style={{
                        justifyContent: 'center',
                        padding: '10px'
                    }}
                >
                    <DataList.Root>
                        <DataList.Item>
                            <DataList.Label minWidth="88px">ID</DataList.Label>
                            <DataList.Value>
                                <Code>{itemID}</Code>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.Label minWidth="88px">Name</DataList.Label>
                            <DataList.Value>{data.name}</DataList.Value>
                        </DataList.Item>
                    </DataList.Root>
                </Flex>

                <Flex
                        style={{
                            justifyContent: 'space-between',
                            width: '100%'
                        }}
                    >
                        <AlertDialog.Cancel onClick={() => setOpen(false)}>
                            <Button variant="soft" color="gray" style={{ cursor: "pointer" }}>
                                Cancel
                            </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action>
                            <Button variant="solid" color="red" style={{ cursor: "pointer" }} onClick={handleDelete}>
                                Delete
                            </Button>
                        </AlertDialog.Action>
                    </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}