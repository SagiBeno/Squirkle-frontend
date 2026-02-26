import { Card, Flex, Box, Text, TextField, Button } from "@radix-ui/themes";
import { useState } from "react";
import PasswordInput from "../components/PasswordInput";
import { DisabledLoadingButton, EnterButton, DisabledButton, OrButton, GoogleLoginButton } from "../components/Buttons";
import Separator from '../components/Separator';
import { useNavigate } from "react-router-dom";

export default function RegisterPage({ loading, handleRegistration, handleLoginWithGoogle }) {

    let navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        type: "user"
    });
    const [validEmailFormat, setValidEmailFormat] = useState(true);

    function isValidEmailFormat(email) {
        if (!email) return false;
        if (email.includes(' ') || !email.includes('@')) return false;

        const emailparts = email.split('@');

        if (emailparts.length != 2 || emailparts[1].split('.')[1]?.length < 2) return false;

        if (!emailparts[0] || !emailparts[1] || !emailparts[1].includes('.')) return false;

        const dotIdx = emailparts[1].lastIndexOf('.');
        if (dotIdx === 0 || dotIdx === (emailparts[1].length - 1)) return false;

        return true;
    }

    return (
        <Flex className="mainContainer">
        <Flex className="contentContainer">
            <Card
                style={{
                    margin: '20px',
                    width: '80%',
                    maxWidth: '720px'
                }}
            >
                <Flex
                    justify='center'
                    style={{
                        textAlign: 'center'
                    }}
                >
                    <Text size='5'>
                        Registration
                    </Text>
                </Flex>

                <Flex direction='column'>
                    <Text as='label' htmlFor="username">Username</Text>
                    <TextField.Root
                        radius="full"
                        placeholder="Username"
                        size="3"
                        name="username"
                        id="username"
                        mt="2"
                        mb="3"
                        value={formData.username}
                        required
                        onChange={(e) => {
                            if (e.target.value.includes(' ')) return;
                            else setFormData({ ...formData, username: e.target.value })
                        }}
                    />

                    <Text as='label' htmlFor="email">Email</Text>
                    <TextField.Root
                        radius="full"
                        placeholder="example@gmail.com"
                        size="3"
                        name="email"
                        id="email"
                        mt="2"
                        mb="3"
                        value={formData.email}
                        required
                        onChange={(e) => {
                            if (e.target.value.includes(' ')) return;
                            else {
                                setFormData({ ...formData, email: e.target.value })
                                setValidEmailFormat(isValidEmailFormat(e.target.value));
                            }
                        }}
                    />

                    {
                        !validEmailFormat &&
                        <Text
                            as="p"
                            size='2'
                            mx='1'
                            style={{
                                userSelect: 'none',
                                cursor: 'default'
                            }}
                            align="center"
                            color="tomato"
                        >
                            Invalid email format!
                        </Text>
                    }

                    <Text as='label' htmlFor="password">Password</Text>
                    <PasswordInput
                        inputName="password"
                        value={formData.password}
                        onChange={(e) => {
                            if (e.target.value.includes(' ')) return;
                            else setFormData({ ...formData, password: e.target.value })
                        }}
                    />

                    <Text as='label' htmlFor="confirmPassword">Confirm password</Text>
                    <PasswordInput
                        inputName="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={(e) => {
                            if (e.target.value.includes(' ')) return;
                            else setFormData({ ...formData, confirmPassword: e.target.value })
                        }}
                    />

                    {
                        formData.password.length < 8 &&
                        <Text
                            as="p"
                            size='2'
                            mx='1'
                            align="center"
                        >
                            The password must be at least eight characherts long!
                        </Text>
                    }

                    {
                        formData.password !== formData.confirmPassword &&
                        <Text
                            as="p"
                            size='2'
                            mx='1'
                            align="center"
                        >
                            Password do not match
                        </Text>
                    }

                </Flex>

                {
                    validEmailFormat && formData.email && formData.password.length >= 8 && formData.password === formData.confirmPassword
                        ?
                        loading
                            ?
                            <DisabledLoadingButton text={'Registration'} />
                            :
                            <EnterButton text={'Registration'} onClick={() => handleRegistration(formData)} />
                        :
                        <DisabledButton text={'Registration'} />
                }

                <GoogleLoginButton text={'Login with Google account'} onClick={handleLoginWithGoogle} />
                <Separator text={'or'} />
                <Box style={{ textAlign: 'center' }}>
                    <Text>Do you have an account?</Text>
                </Box>

                <OrButton text={'Login'} onClick={() => navigate('/login')} />

            </Card>
        </Flex>
        </Flex>
    )
}