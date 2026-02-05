import { Card, Flex, Box, Text, TextField, Button } from "@radix-ui/themes";
import { useState } from "react";
import PasswordInput from "../Components/PasswordInput";
import { DisabledLoadingButton, EnterButton, DisabledButton, OrButton, GoogleLoginButton } from "../Components/Buttons";
import Separator from '../Components/Separator';
import { useNavigate } from "react-router-dom";

export default function LoginPage( { handleLoginWithEmailAndPW, handleLoginWithGoogle, loading } ) {

    let navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    return (
        <Flex
            style={{
                margin: '0 auto',
                width: '300px',
                height: '90vh'
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
                        Login
                    </Text>
                </Flex>

                <Flex direction='column'>
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
                </Flex>

                {
                    formData.email.length > 0 && formData.password.length >= 8
                        ?
                        loading
                            ?
                            <DisabledLoadingButton text={'Login'}/>
                            :
                            <EnterButton text={'Login'} onClick={() => handleLoginWithEmailAndPW(formData)} />
                        :
                        <DisabledButton text={'Login'} />
                }
                
                <GoogleLoginButton text={'Login with Google account'} onClick={handleLoginWithGoogle}/>
                <Separator text={'or'} />
                <Box style={{textAlign: 'center'}}>
                    <Text>Do not have an account?</Text>
                </Box>
                
                <OrButton text={'Registration'} onClick={() => navigate('/register')} />
                    
            </Card>
        </Flex>

    )
}