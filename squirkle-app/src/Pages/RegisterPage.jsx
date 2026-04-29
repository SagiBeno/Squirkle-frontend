import { Flex, Box, Text, TextField, ScrollArea } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import PasswordInput from "../components/Inputs/PasswordInput";
import { DisabledLoadingButton, EnterButton, DisabledButton, OrButton, GoogleLoginButton } from "../components/Buttons";
import Separator from '../components/Separator';
import { useNavigate } from "react-router-dom";
import { InfoCircledIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import GameLogo from "../components/GameLogo";

/**
 * Registration page component.
 * 
 * Displays the registration form, handles local from state,
 * validates email and password fields, and redirects authenticated users
 * to the game page.
 * 
 * The component allows users to register with eamil and password
 * or continue with Google login.
 * 
 * @component
 * 
 * @param { Object } props - Component props
 * @param { boolean } props.loading - Indicates wether the registration process is currently loading
 * @param { Function } props.handleRegistration - Function called when the user submits the registration form
 * @param { Function } props.handleLoginWithGoogle - Function called when the user chooses Google login
 * @param { Function } props.setShowAppLoader - Function used to contol the global app loader visibility
 * @param { Object | null } props.user - Currently authenticated user object, or null if no user is logged in
 *  
 * @returns { JSX.Element } Registration page UI
 */

export default function RegisterPage({ loading, handleRegistration, handleLoginWithGoogle, setShowAppLoader, user }) {

    let navigate = useNavigate();

    /**
     * @typedef { Object } RegistrationFormData
     * @property { string } email - User email address
     * @property { string } username - User chosen username
     * @property { string } password - User password
     * @property { string } confirmPassword - Password confirmation value
     * @property { string } type - User role/type, defaults to "user"
     */
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        type: "user"
    });
    const [validEmailFormat, setValidEmailFormat] = useState(true);

    useEffect(() => {
        if (user !== null) {
            setShowAppLoader(true);
            navigate("/game");
        }
    }, [user]);

    useEffect(() => {
        setShowAppLoader(false);
    }, []);

    /**
     * Validates the format of an email address.
     * 
     * Checks wether the email contains no spaces, includes exactly one "@",
     * has a domain part, and contains a valid dot-separated domain suffix.
     * 
     * @param { string } email - Email address to validate
     * @returns { boolean } True if the email format is valid, otherwise false
     */
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
                        <Flex
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexWrap: 'wrap'
                            }}
                        >
                            <GameLogo width="300px" />
                        </Flex>

                        <Text
                            size='7'
                            style={{
                                fontWeight: 'bold',
                                marginTop: '10px',
                                letterSpacing: '2px'
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
                <Box style={{ minHeight: '10px' }} />
            </ScrollArea>
        </Flex>
    )
}
