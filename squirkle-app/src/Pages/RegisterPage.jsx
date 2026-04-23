import { Card, Flex, Box, Text, TextField, Button } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import PasswordInput from "../components/Inputs/PasswordInput";
import { DisabledLoadingButton, EnterButton, DisabledButton, OrButton, GoogleLoginButton } from "../components/Buttons";
import Separator from '../components/Separator';
import { useNavigate } from "react-router-dom";
import { InfoCircledIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function RegisterPage({ loading, handleRegistration, handleLoginWithGoogle, setShowAppLoader, user }) {

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

    useEffect(() => {
        if (user !== null) {
            setShowAppLoader(true);
            navigate("/game");
        }
    }, [user]);

    useEffect( () => {
        setShowAppLoader(false);
    }, []);

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
                        padding: '20px',
                        borderRadius: '20px',
                        textAlign: 'center',
                        color: 'white',
                    }}
                >
                    <Text
                        size='8'
                        style={{
                            fontWeight: 'bold'
                        }}
                    >
                        Registration
                    </Text>

                    <Flex
                        style={{
                            flexDirection: 'column',
                            textAlign: 'left'
                        }}
                    >
                        <Text as='label' htmlFor="username" size='4' style={{ cursor: 'pointer', marginBottom: '5px' }}>Username</Text>
                        <TextField.Root
                            className="textField"
                            radius="none"
                            placeholder="Username"
                            size="3"
                            name="username"
                            id="username"
                            value={formData.username}
                            required
                            onChange={(e) => {
                                if (e.target.value.includes(' ')) return;
                                else setFormData(prev => ({ ...prev, username: e.target.value }));
                            }}
                            style={{
                                marginBottom: '12px'
                            }}
                        />

                        <Text as='label' htmlFor="email" style={{ marginTop: '10px', cursor: 'pointer', marginBottom: '5px' }} size='4'>Email</Text>
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
                                else {
                                    setFormData(prev => ({ ...prev, email: e.target.value }));
                                    setValidEmailFormat(isValidEmailFormat(e.target.value));
                                }
                            }}
                            style={{
                                marginBottom: '12px'
                            }}
                        />

                        {
                            !validEmailFormat &&
                            <Flex
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: '5px',
                                    padding: '10px',
                                    color: 'gold',
                                    flexWrap: 'wrap'
                                }}
                            >
                                <ExclamationTriangleIcon 
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        marginRight: '5px',
                                    }}
                                />
                                <Text
                                    as="p"
                                    size='3'
                                    align='center'
                                >
                                    Invalid email format!
                                </Text>
                            </Flex>

                        }

                        <Text as='label' htmlFor="password" style={{ marginTop: '10px', cursor: "pointer", marginBottom: '5px' }} size='4'>Password</Text>
                        <PasswordInput
                            inputName="password"
                            value={formData.password}
                            onChange={(e) => {
                                if (e.target.value.includes(' ')) return;
                                else setFormData(prev => ({ ...prev, password: e.target.value }));
                            }}
                            
                        />

                        <Text as='label' htmlFor="confirmPassword" style={{ marginTop: '22px', cursor: 'pointer', marginBottom: '5px' }} size='4'>Confirm password</Text>
                        <PasswordInput
                            inputName="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => {
                                if (e.target.value.includes(' ')) return;
                                else setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
                            }}

                        />

                        {
                            (formData.password.length < 8 || formData.password !== formData.confirmPassword) &&
                            <Flex
                                style={{
                                    flexDirection: 'row',
                                    marginTop: '10px',
                                    marginBottom: '10px',
                                    padding: '10px',
                                    justifyContent: "space-around",
                                    alignItems: 'center',
                                    color: '#64c8c8'
                                }}
                            >
                                <Flex>
                                    <InfoCircledIcon
                                        style={{
                                            width: '25px',
                                            height: '25px',
                                            marginRight: '5px'
                                        }}
                                    />
                                </Flex>

                                <Flex
                                    style={{
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}
                                >
                                    {
                                        formData.password.length < 8 &&
                                        <Text
                                            as="p"
                                            size='3'
                                            align="center"
                                        >
                                            The password must be at least eight characherts long!
                                        </Text>
                                    }

                                    {
                                        formData.password !== formData.confirmPassword &&
                                        <Text
                                            as="p"
                                            size='3'
                                            align="center"
                                        >
                                            Password do not match!
                                        </Text>
                                    }
                                </Flex>
                            </Flex>
                        }
                    </Flex>

                    <Box
                        style={{
                            marginTop: '10px'
                        }}
                    >
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

                        <GoogleLoginButton text={'Login with Google'} onClick={handleLoginWithGoogle} />
                        <Separator text={'or'} />
                        <Box style={{ textAlign: 'center' }}>
                            <Text size="3">Do you have an account?</Text>
                        </Box>

                        <OrButton text={'Login'} onClick={() => navigate('/login')} />

                    </Box>

                </Flex>
            </Flex>
            <Box style={{minHeight: '10px'}}/>
        </Flex>
    )
}