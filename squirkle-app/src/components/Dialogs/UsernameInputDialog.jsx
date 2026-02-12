import { Dialog, TextField, Button, Text, Box } from "@radix-ui/themes";
import { useState } from "react";
import { UsernameDisabledLoadingButton, UsernameDisabledButton, UsernameConfirmButton } from "../Buttons";
import { useNavigate } from "react-router-dom";

export default function UsernameInputDialog({ open, setOpen, setToastData, toastData, existingUsername, userData, setUser }) {

    let navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ content: '', error: false });

    async function handleUsername() {
        setLoading(true);
        const existsUsername = await existingUsername(username);

        if (existsUsername) {
            setMessage({ content: 'The username already exist!', error: true });
            setLoading(false);
        } else {
            const userId = userData?.user?.uid;
            fetch('https://squirkle-backend.vercel.app/api/create-username', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: userId, username: username })
            })
                .then(res => {
                    if (res.status === 201) {
                        setToastData({ open: true, title: 'Username successfully saved', description: '', isError: false });
                        setLoading(false);
                        setOpen(false);
                        setUser({ user: userData, username: username });
                        navigate('/');
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
        <Dialog.Root open={open} >
            <Dialog.Content maxWidth="80vw">
                <Dialog.Title>Username</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    Please enter a username
                </Dialog.Description>

                <TextField.Root
                    placeholder="Username"
                    size="3"
                    radius="full"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.trim())}
                />

                {
                    username.length > 0
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
                    message.content.length > 0 &&
                    <Box
                        style={{
                            width: '100%',
                            textAlign: 'center'
                        }}
                    >
                        <Text
                            size='5'
                            style={{
                                color: message.error ? 'red' : 'green',
                            }}
                        >
                            {message.content}
                        </Text>
                    </Box>

                }

            </Dialog.Content>
        </Dialog.Root >
    )
}