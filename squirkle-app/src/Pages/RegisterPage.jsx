import { Card, Flex, Box, Text, TextField, Button } from "@radix-ui/themes";
import { useState } from "react";
import PasswordInput from "../components/PasswordInput";
import { DisabledLoadingButton, EnterButton, DisabledButton, OrButton, GoogleLoginButton } from "../components/Buttons";
import Separator from '../components/Separator';
import { useNavigate } from "react-router-dom";

export default function RegisterPage( { loading, handleRegistration, handleLoginWithGoogle } ) {

    let navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        type: "user"
    });

    return (
        <Flex
            style={{
                margin: '0 auto',
                width: '300px',
                height: '100%'
            }}

            align='center'
        >
            <Card
                style={{
                    margin: '0 auto'
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
                            else setFormData({ ...formData, email: e.target.value })
                        }}
                    />

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
                </Flex>

                {
                    formData.email.length > 0 && formData.password.length >= 8
                        ?
                        loading
                            ?
                            <DisabledLoadingButton text={'Registration'}/>
                            :
                            <EnterButton text={'Registration'} onClick={() => handleRegistration(formData)} />
                        :
                        <DisabledButton text={'Registration'} />
                }
                
                <GoogleLoginButton text={'Login with Google account'} onClick={handleLoginWithGoogle}/>
                <Separator text={'or'} />
                <Box style={{textAlign: 'center'}}>
                    <Text>Do you have an account?</Text>
                </Box>
                
                <OrButton text={'Login'} onClick={() => navigate('/login')} />
                    
            </Card>
        </Flex>

    )
}