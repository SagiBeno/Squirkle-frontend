import * as Toast from "@radix-ui/react-toast";
import { Card, Text, Button, Flex, IconButton } from "@radix-ui/themes";
import { Cross2Icon } from "@radix-ui/react-icons";


export default function AppToast( { toastData, setToastData } ) {

    return (
        <Toast.Provider swipeDirection="up" duration={5000} style={{zIndex: 9999}}>
            <Toast.Root open={toastData.open} onOpenChange={() => setToastData({ ...toastData, open: false })} asChild className="toastStyle">
                <Card
                    style={{
                        position: "fixed",
                        top: 16,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: "320px",
                        maxWidth: 'calc(100% - 32px)',
                        borderLeft: toastData.isError ? "4px solid var(--red-9)" : "4px solid var(--green-9)",
                    }}
                >
                    <Flex direction="column" gap="2">
                        <Flex direction="row" gap="2">
                            <Text weight="bold" color={toastData.isError ? "red" : "green"}>{toastData.title}</Text>

                            <Flex justify="end" style={{ flex: 1 }}>
                                <Toast.Close asChild>
                                    <IconButton variant="ghost" color={toastData.isError ? "red" : "green"}>
                                        <Cross2Icon width="20" height="20" />
                                    </IconButton>
                                </Toast.Close>
                            </Flex>
                        </Flex>


                        {toastData.description && (
                            <Text size="2" color="gray">
                                {toastData.description}
                            </Text>
                        )}


                    </Flex>
                </Card>
            </Toast.Root>

            <Toast.Viewport />
        </Toast.Provider>
    );
}