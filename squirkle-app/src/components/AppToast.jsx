import * as Toast from "@radix-ui/react-toast";
import { Card, Text, Button, Flex, IconButton, Portal } from "@radix-ui/themes";
import { Cross2Icon } from "@radix-ui/react-icons";


export default function AppToast( { toastData, setToastData } ) {

    return (
        <Toast.Provider swipeDirection="up" style={{zIndex: 9999, padding: 0}}>
            <Toast.Root open={toastData.open} onOpenChange={() => setToastData({ ...toastData, open: false })} className="toastStyle">
                <Flex
                    style={{
                        position: "fixed",
                        borderRadius: '12px',
                        top: 16,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: "300px",
                        padding: '10px',
                        maxWidth: 'calc(100% - 32px)',
                        background: toastData.isError ? '#f03c3c' : '#0bc74a',
                        borderBottom: `8px ${toastData.isError ? "#c30b27" : '#01813f'} solid`,
                        fontFamily: `"Fredoka", sans-serif`
                    }}
                >
                    <Flex direction="column" style={{ width: '100%', gap: 10, flexWrap: 'wrap' }}>
                        <Flex direction="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text size="5" style={{ fontWeight: 'bold', letterSpacing: '1px', color: 'white' }}>{toastData.title}</Text>

                            <Flex>
                                <Toast.Close style={{ background: 'transparent', border: 'none' }} >
                                    <IconButton variant="ghost" style={{ background: 'transparent', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer'  }} >
                                        <Cross2Icon width="22" height="22" />
                                    </IconButton>
                                </Toast.Close>
                            </Flex>
                        </Flex>


                        {toastData.description && (
                            <Text size="2" style={{ color: 'white' }}>
                                {toastData.description}
                            </Text>
                        )}
                    </Flex>
                </Flex>
            </Toast.Root>
            <Portal>
                <Toast.Viewport style={{ zIndex: 99999, position: 'fixed', inset: 'auto 20px 20px auto' }}/>
            </Portal>
            
        </Toast.Provider>
    );
}