import { Card, Flex, Box, Text, TextField, Button, ScrollArea } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import PasswordInput from "../components/Inputs/PasswordInput";
import { DisabledLoadingButton, EnterButton, DisabledButton, OrButton, GoogleLoginButton } from "../components/Buttons";
import Separator from '../components/Separator';
import { useNavigate } from "react-router-dom";

/**
 * Login page component.
 * 
 * Displays a login form that allows users to authenticate
 * using email and password via Google login.
 * 
 * Handles local form state, input validation, and redirects
 * authenticated users to the game page.
 * 
 * @component
 * 
 * @param { Object } props - Component props
 * @param { Function } props.handleLoginWithEmailAndPW - Function called when the login form is submitted
 * @param { Function } props.handleLoginWithGoogle - Function called when the Google login button is clicked
 * @param { boolean } props.loading - Indicates whether the login process is currently loading
 * @param { Function } props.setShowAppLoader - Function used to contol the global app loader visibility
 * @param { Object | null } props.user - Currently authenticated user object, or null if no user is logged in
 *  
 * @returns { JSX.Element } Login page UI
 */

export default function LoginPage({ handleLoginWithEmailAndPW, handleLoginWithGoogle, loading, setShowAppLoader, user }) {

    let navigate = useNavigate();

    useEffect(() => {
        setShowAppLoader(false);
    }, []);

    useEffect(() => {
        if (user !== null) {
            setShowAppLoader(true);
            navigate("/game");
        }
    }, [user]);

    /**
     * @typedef { Object } LoginFormData
     * @property { string } email - User email address
     * @property { string } password - User password
     */
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    return (
        <Flex className="mainContainer">
            
            <ScrollArea scrollbars="vertical" className='contentContainer' type='auto'>
                <Box style={{ minHeight: '10px' }} />
                <Flex
                    style={{
                        height: '100%',
                    }}
                >
                    <Flex
                        style={{
                            margin: 'auto',
                            width: '80%',
                            maxWidth: '720px',
                            flexDirection: 'column',
                            background: 'transparent',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0px 0px 6px 0px rgb(186, 186, 206)',
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
                                        else setFormData(prev => ({ ...prev, email: e.target.value }));
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
                                        else setFormData(prev => ({ ...prev, password: e.target.value }))
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


                        <GoogleLoginButton text={'Login with Google'} onClick={handleLoginWithGoogle} />
                        <Separator text={'or'} />
                        <Box style={{ textAlign: 'center' }}>
                            <Text size="3">Do not have an account?</Text>
                        </Box>

                        <OrButton text={'Registration'} onClick={() => navigate('/register')} />

                    </Flex>
                </Flex>
                <Box style={{ minHeight: '10px' }} />
            </ScrollArea>
        </Flex>
    )
}