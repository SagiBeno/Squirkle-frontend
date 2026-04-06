import { Card, Flex, Box, Text, TextField, Button } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import PasswordInput from "../components/PasswordInput";
import { DisabledLoadingButton, EnterButton, DisabledButton, OrButton, GoogleLoginButton } from "../components/Buttons";
import Separator from '../components/Separator';
import { useNavigate } from "react-router-dom";

export default function LoginPage({ handleLoginWithEmailAndPW, handleLoginWithGoogle, loading, setShowAppLoader }) {

    let navigate = useNavigate();

    useEffect( () => {
        setShowAppLoader(false);
    }, []);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    return (
        <Flex className="mainContainer">
            <Box style={{minHeight: '10px'}}/>

            <Flex className="contentContainer">

                <Flex
                    style={{
                        margin: 'auto',
                        width: '80%',
                        maxWidth: '720px',
                        flexDirection: 'column',
                        background: 'linear-gradient(180deg, #1e1e28, #21212c)',
                        boxShadow: '0px 0px 10px 2px #bababa',
                        padding: '20px 10% 20px 10%',
                        borderRadius: '20px',
                        textAlign: 'center',
                        color: 'white'
                    }}
                >
                    <Text size='8' style={{ fontWeight: 'bold' }}>Login</Text>

                    <Flex style={{ flexDirection: 'column', justifyContent: "center", textAlign: 'left' }}>
                        <div>
                            <Text as='label' size='4' htmlFor="email" style={{ cursor: 'pointer', marginBottom: '5px' }}>Email</Text>
                            <TextField.Root
                                className="textField"
                                radius="none"
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
                                    marginBottom: '12px',
                                }}
                            />
                        </div>

                        <div>
                            <Text as='label' size='4' htmlFor="password" style={{ cursor: 'pointer', marginTop: '10px', marginBottom: '5px' }}>Password</Text>
                            <PasswordInput
                                inputName="password"
                                value={formData.password}
                                onChange={(e) => {
                                    if (e.target.value.includes(' ')) return;
                                    else setFormData({ ...formData, password: e.target.value })
                                }}
                            />
                        </div>
                    </Flex>

                    <Box style={{ marginTop: '50px' }}>
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
                    </Box>


                    <GoogleLoginButton text={'Login with Google account'} onClick={handleLoginWithGoogle} />
                    <Separator text={'or'} />
                    <Box style={{ textAlign: 'center' }}>
                        <Text size="3">Do not have an account?</Text>
                    </Box>

                    <OrButton text={'Registration'} onClick={() => navigate('/register')} />

                </Flex>
            </Flex>
            <Box style={{minHeight: '10px'}}/>
        </Flex>
    )
}