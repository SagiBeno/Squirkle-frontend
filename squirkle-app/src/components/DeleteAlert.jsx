import { AlertDialog, Button, Flex, DataList, Code } from "@radix-ui/themes";
import { FaTrash } from "react-icons/fa";
import { TbCancel } from "react-icons/tb";

export default function DeleteAlert({ open, setOpen, data, itemID, handleDelete, description, title }) {

    return (
        <AlertDialog.Root open={open} setOpen={setOpen}>
            <AlertDialog.Content
                maxWidth="450px"
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
                <AlertDialog.Title>{title}</AlertDialog.Title>
                <AlertDialog.Description size="3">
                    Are you sure you want to delete the following item?
                </AlertDialog.Description>

                <Flex
                    style={{
                        justifyContent: 'center',
                        padding: '10px'
                    }}
                >
                    <DataList.Root
                        
                    >
                        <DataList.Item>
                            <DataList.Label minWidth="88px" style={{color: 'white'}}>ID</DataList.Label>
                            <DataList.Value>
                                <Code color="amber" variant="solid" highContrast >{itemID}</Code>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.Label minWidth="88px" style={{color: 'white'}}>Name</DataList.Label>
                            <DataList.Value>{data.name || data.title}</DataList.Value>
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
                            <Button variant="soft" color="amber" style={{ cursor: "pointer", color: 'white' }}>
                                <TbCancel /> Cancel
                            </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action>
                            <Button variant="solid" color="red" style={{ cursor: "pointer" }} onClick={handleDelete}>
                                <FaTrash /> Delete
                            </Button>
                        </AlertDialog.Action>
                    </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}