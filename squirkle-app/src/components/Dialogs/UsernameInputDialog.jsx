import { Dialog } from "@radix-ui/themes"

export default function UsernameInputDialog ( { open, setOpen } ) {
    return (
         <Dialog.Root open={open} onOpenChange={setOpen} style={{ userSelect: 'none' }} >
            <Dialog.Content maxWidth="450px">
                <Dialog.Title>Felhasználó törlése</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    Következő felhasználó törlése:
                </Dialog.Description>

                <MyDataList user={user} />

                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray">
                            <Cross2Icon width='15px' height='15px' /> Mégse
                        </Button>
                    </Dialog.Close>
                    <Dialog.Close onClick={() => handleDeleteUser(user)}>
                        <Button color='tomato'><TrashIcon width='15px' height='15px' /> Törlés</Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root >
    )
}