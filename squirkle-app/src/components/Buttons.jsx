import { Spinner, Button } from "@radix-ui/themes";
import { EnterIcon, PersonIcon } from "@radix-ui/react-icons";
import { FaGoogle } from 'react-icons/fa'

export function DisabledLoadingButton( { text } ) {
    return (
        <Button
            variant="outline"
            mt="4"
            mb="3"
            size="3"
            radius="full"
            disabled
            style={{
                width: '100%'
            }}
        >
            <Spinner loading />
            <EnterIcon width='20px' height='20px' /> {text}
        </Button>
    )
}

export function EnterButton( { text, onClick } ) {
    return (
        <Button
            variant="outline"
            mt="4"
            mb="3"
            size="3"
            radius="full"
            style={{
                cursor: 'pointer',
                width: '100%'
            }}
            onClick={onClick}
        >
            <EnterIcon width='20px' height='20px' /> {text}
        </Button>
    )
}

export function DisabledButton( { text } ) {
    return (
        <Button
            variant="outline"
            mt="4"
            mb="3"
            size="3"
            radius="full"
            disabled
            style={{
                width: '100%'
            }}
        >
            <EnterIcon width='20px' height='20px' /> {text}
        </Button>
    )
}

export function OrButton( { text, onClick } ) {
    return (
        <Button
            variant="outline"
            mt="4"
            mb="3"
            size="3"
            radius="full"
            style={{
                width: '100%',
                cursor: 'pointer'
            }}
            onClick={onClick}
        >
            {text}
        </Button>
    )
}

export function GoogleLoginButton( { text, onClick } ) {
    return (
        <Button
            variant="outline"
            mt="4"
            mb="3"
            size="3"
            radius="full"
            className="loginButton"
            style={{
                width: '100%',
                cursor: 'pointer'
            }}
            onClick={onClick}
        >
            <FaGoogle/> {text}
        </Button>
    )
}

export function UsernameDisabledLoadingButton ( { text } ) {
    return (
        <Button
            variant="outline"
            mt="4"
            mb="3"
            size="3"
            radius="full"
            disabled
            style={{
                width: '100%'
            }}
        >
            <Spinner loading />
            <PersonIcon width='20px' height='20px' /> {text}
        </Button>
    )
}

export function UsernameDisabledButton ( { text } ) {
    return (
        <Button
            variant="outline"
            mt="4"
            mb="3"
            size="3"
            radius="full"
            disabled
            style={{
                width: '100%'
            }}
        >
            <PersonIcon width='20px' height='20px' /> {text}
        </Button>
    )
}

export function UsernameConfirmButton ( { text, onClick } ) {
    return (
        <Button
            variant="outline"
            mt="4"
            mb="3"
            size="3"
            radius="full"
            style={{
                width: '100%',
                cursor: 'pointer'
            }}
            onClick={onClick}
        >
            <PersonIcon width='20px' height='20px' /> {text}
        </Button>
    )
}