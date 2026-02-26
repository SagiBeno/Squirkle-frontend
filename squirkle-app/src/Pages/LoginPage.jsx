import { Card, Flex, Box, Text, TextField, Button } from "@radix-ui/themes";
import { useState } from "react";
import PasswordInput from "../components/PasswordInput";
import { DisabledLoadingButton, EnterButton, DisabledButton, OrButton, GoogleLoginButton } from "../components/Buttons";
import Separator from '../components/Separator';
import { useNavigate } from "react-router-dom";

export default function LoginPage({ handleLoginWithEmailAndPW, handleLoginWithGoogle, loading }) {

    let navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    return (
        <Flex className="mainContainer">
            <Flex className="contentContainer">
                <Flex
                    style={{
                        margin: 'auto',
                        width: '80%',
                        maxWidth: '720px',
                        flexDirection: 'column',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        padding: '10px',
                        borderRadius: '20px',
                        textAlign: 'center',
                        fontFamily: `"Fredoka", sans-serif`,
                    }}
                >
                    
                    <Text
                        size='8'
                        style={{
                            fontWeight: 'bold'
                        }}
                    >
                        Login
                    </Text>

                    <Flex
                        style={{
                            flexDirection: 'column',
                            textAlign: 'left'
                        }}
                    >
                        <Text as='label' size='4' htmlFor="email" style={{ cursor: 'pointer' }}>Email</Text>
                        <TextField.Root
                            radius="full"
                            placeholder="example@gmail.com"
                            size="3"
                            name="email"
                            id="email"
                            value={formData.email}
                            required
                            onChange={(e) => {
                                if (e.target.value.includes(' ')) return;
                                else setFormData({ ...formData, email: e.target.value })
                            }}
                            style={{ 
                                fontFamily: `"Fredoka", sans-serif`,
                            }}
                        />

                        <Text as='label' size='4' htmlFor="password" style={{ cursor: 'pointer', marginTop: '10px' }}>Password</Text>
                        <PasswordInput
                            inputName="password"
                            value={formData.password}
                            onChange={(e) => {
                                if (e.target.value.includes(' ')) return;
                                else setFormData({ ...formData, password: e.target.value })
                            }}
                            style={{ 
                                fontFamily: `"Fredoka", sans-serif`,
                            }}
                        />
                    </Flex>

                    {
                        formData.email.length > 0 && formData.password.length >= 8
                            ?
                            loading
                                ?
                                <DisabledLoadingButton text={'Login'} />
                                :
                                <EnterButton text={'Login'} onClick={() => handleLoginWithEmailAndPW(formData)} />
                            :
                            <DisabledButton text={'Login'} />
                    }

                    <GoogleLoginButton text={'Login with Google account'} onClick={handleLoginWithGoogle} />
                    <Separator text={'or'} />
                    <Box style={{ textAlign: 'center' }}>
                        <Text size="3">Do not have an account?</Text>
                    </Box>

                    <OrButton text={'Registration'} onClick={() => navigate('/register')} />

                </Flex>
            </Flex>

        </Flex>


    )
}