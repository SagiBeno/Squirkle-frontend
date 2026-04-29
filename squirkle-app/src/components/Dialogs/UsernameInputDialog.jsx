import { Dialog, TextField, Text, Flex } from "@radix-ui/themes";
import { useState } from "react";
import { UsernameDisabledLoadingButton, UsernameDisabledButton, UsernameConfirmButton } from "../Buttons";
import { useNavigate } from "react-router-dom";
import { BiErrorAlt } from "react-icons/bi";

/**
 * Dialog for entering a username after Google login.
 *
 * Shown when a Google-authenticated user does not yet have
 * an application username. Checks username availability,
 * saves the username, loads current user data, and redirects
 * the user to the game page after success.
 *
 * @component
 *
 * @param { Object } props - Component props
 * @param { boolean } props.open - Controls whether the dialog is visible
 * @param { Function } props.setOpen - Controls dialog visibility
 * @param { Function } props.setToastData - Updates global toast notification state
 * @param { Function } props.existingUsername - Checks whether a username already exists
 * @param { Object } props.userData - Firebase Google login result/user data
 * @param { Function } props.loadCurrentUserData - Loads current user data after saving username
 *
 * @returns {JSX.Element} Username input dialog UI
 */

export default function UsernameInputDialog({ open, setOpen, setToastData, existingUsername, userData, loadCurrentUserData }) {

    let navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ content: '', error: false });

    /**
     * Validates and saves the selected username.
     *
     * Checks whether the username already exists, creates the username
     * for the authenticated user, reloads user data, and redirects
     * to the game page after successful creation.
     */
    async function handleUsername() {
        setLoading(true);
        const existsUsername = await existingUsername(username);

        if (existsUsername) {
            setMessage({ content: 'The username already exists!', error: true });
            setLoading(false);
        } else {
            const userId = userData?.user?.uid;
            fetch('https://squirkle-backend.vercel.app/api/create-username', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: userId, username: username })
            })
                .then(async (res) => {
                    if (res.status === 201) {
                        setToastData({ open: true, title: 'Username successfully saved', description: '', isError: false });
                        setLoading(false);
                        setOpen(false);
                        await loadCurrentUserData(userData, { username });
                        navigate('/game');
                    } else setMessage({ content: 'The username could not be saved. Please try again or enter a different one.', error: true });
                })
                .catch(error => {
                    setMessage({ content: 'The username could not be saved. Please try again or enter a different one.', error: true });
                    console.warn(error);
                })
                .finally(() => { setLoading(false) });
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={() => {}}>
            <Dialog.Content 
                style={{
                    color: 'white',
                    minWidth: "40vw",
                    maxWidth: "400px",
                    fontFamily: `"Fredoka", sans-serif`,
                }}
            >
                <Dialog.Title size="6">Username</Dialog.Title>
                <Dialog.Description size="4" mb="4">
                    You don't have a username. Please enter one.
                </Dialog.Description>

                <TextField.Root
                    className="textField"
                    placeholder="Username"
                    size="3"
                    radius="none"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.trim())}
                    style={{
                        marginBottom: '15px'
                    }}
                />

                {
                    username?.length > 0
                        ?
                        loading
                            ?
                            <UsernameDisabledLoadingButton text={'Confirm'} />
                            :
                            <UsernameConfirmButton text={'Confirm'} onClick={() => handleUsername()} />
                        :
                        <UsernameDisabledButton text={'Confirm'} />
                }

                {
                    message?.content?.length > 0 &&
                    <Flex
                        style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}
                    >
                        {
                            message?.error &&
                            <BiErrorAlt 
                                style={{ 
                                    color: 'tomato',
                                    width: '25px',
                                    height: '25px',
                                    marginRight: '5px'
                                }} 
                            /> 
                        }
                        
                        <Text
                            size='5'
                            style={{
                                color: message?.error ? 'tomato' : 'lightgreen',
                                textAlign: 'center'
                            }}
                        >
                            {message?.content}
                        </Text>
                    </Flex>

                }

            </Dialog.Content>
        </Dialog.Root >
    )
}
