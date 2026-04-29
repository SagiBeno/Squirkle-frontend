import * as Toast from "@radix-ui/react-toast";
import { Text, Flex, Portal } from "@radix-ui/themes";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useCallback, useEffect } from "react";

const RESTORE_GAME_TOUCH_INPUT_EVENT = 'squirkle:restore-game-touch-input';

/**
 * Global toast notification component.
 * 
 * Displays temporary success or error messages at the top of the screen.
 * Controlled via 'toastData' state object.
 * 
 * @component
 * 
 * @param { Object } props - Component props
 * @param { ToastData } props.toastData - Current toast state
 * @param { Function } props.setToastData - Function to update toast state
 *  
 * @returns { JSX.Element } Toast notification UI
 */

/**
 * @typedef { Object } ToastData
 * @property { boolean } open - Controls whether the toast is visible
 * @property { string } title - Title of the toast message
 * @property { string } [description] - Optional detailed message
 * @property { boolean } isError - Determines if the toast is an error (red) or success (green)
 */
export default function AppToast({ toastData, setToastData }) {
    const restoreGameplayTouchInput = useCallback(() => {
        window.setTimeout(() => {
            window.dispatchEvent(new Event(RESTORE_GAME_TOUCH_INPUT_EVENT));
        }, 0);
        window.setTimeout(() => {
            window.dispatchEvent(new Event(RESTORE_GAME_TOUCH_INPUT_EVENT));
        }, 180);
    }, []);

    function handleOpenChange(open) {
        setToastData({ ...toastData, open });
        restoreGameplayTouchInput();
    }

    useEffect(() => {
        if (toastData.open) restoreGameplayTouchInput();
    }, [toastData.open, restoreGameplayTouchInput]);

    return (
        <Toast.Provider swipeDirection="up" duration={5000} style={{ zIndex: 9999, padding: 0 }}>
            <Toast.Root
                open={toastData.open}
                onOpenChange={handleOpenChange}
                onPointerUp={restoreGameplayTouchInput}
                onPointerCancel={restoreGameplayTouchInput}
                onTouchEnd={restoreGameplayTouchInput}
                onTouchCancel={restoreGameplayTouchInput}
                onSwipeEnd={restoreGameplayTouchInput}
                onSwipeCancel={restoreGameplayTouchInput}
                className="toastStyle"
            >
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

                            <Toast.Close style={{ background: 'transparent', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }} >
                                <Cross2Icon width="22" height="22" />
                            </Toast.Close>
                        </Flex>


                        {toastData?.description?.length > 0 && (
                            <Text size="2" style={{ color: 'white' }}>
                                {toastData.description}
                            </Text>
                        )}
                    </Flex>
                </Flex>
            </Toast.Root>
            <Portal>
                <Toast.Viewport style={{ zIndex: 99999, position: 'fixed', inset: 'auto 20px 20px auto' }} />
            </Portal>

        </Toast.Provider>
    );
}
