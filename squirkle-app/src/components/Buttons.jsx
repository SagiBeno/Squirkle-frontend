import { Spinner, Button, DropdownMenu } from "@radix-ui/themes";
import { EnterIcon, PersonIcon } from "@radix-ui/react-icons";
import { FaGoogle } from 'react-icons/fa'

/**
 * Collection of ceusable button components.
 * 
 * Provides styled button variants used across the application,
 * including login, registration, navbar, and admin actions.
 * 
 * These components wrap Radix UI Button with predefined styles
 * and icons for consistent UI behavior.
 */

export function DisabledLoadingButton({ text }) {
    return (
        <Button
            radius="none"
            className="button inactiveButton"
            mb="3"
            size="3"
            disabled
            style={{
                width: '100%',
                fontSize: '1.1rem',
            }}
        >
            <Spinner />
            <EnterIcon width='20px' height='20px' /> {text}
        </Button>
    )
}

/**
 * Primary action button with enter icon
 * 
 * Used for actions like login and registration.
 * 
 * @param { Object } props 
 * @param { string } props.text - Button label
 * @param { Function } props.onClick - Click handler
 */
export function EnterButton({ text, onClick }) {
    return (
        <Button
            className="button activeButton"
            mb="3"
            size="3"
            radius="none"
            style={{
                width: '100%',
                fontSize: '1.1rem',
            }}
            onClick={onClick}
        >
            <EnterIcon width='20px' height='20px' /> {text}
        </Button>
    )
}

export function DisabledButton({ text }) {
    return (
        <Button
            className="button inactiveButton"
            mb="3"
            size="3"
            radius="none"
            disabled
            style={{
                width: '100%',
                fontSize: '1.1rem'
            }}
        >
            <EnterIcon width='20px' height='20px' /> {text}
        </Button>
    )
}

export function OrButton({ text, onClick }) {
    return (
        <Button
            className="button activeButton"
            mb="3"
            mt="2"
            size="3"
            radius="none"
            style={{
                width: '100%',
                fontSize: '1.1rem',
            }}
            onClick={onClick}
        >
            {text}
        </Button>
    )
}

/**
 * Google login button
 * 
 * Triggers authentication via google provider.
 * 
 * @param { Object } props
 * @param { string } props.text - Button label
 * @param { Function } props.onClick - Click handler 
 */
export function GoogleLoginButton({ text, onClick }) {
    return (
        <Button
            className="googleLoginButton button activeButton"
            mb="3"
            size="3"
            radius="none"
            style={{
                width: '100%',
                fontSize: '1.1rem',
            }}
            onClick={onClick}
        >
            <FaGoogle /> {text}
        </Button>
    )
}

export function UsernameDisabledLoadingButton({ text }) {
    return (
        <Button
            className="button inactiveButton"
            mb="3"
            size="3"
            radius="none"
            disabled
            style={{
                width: '100%',
                fontSize: '1.1rem'
            }}
        >
            <Spinner />
            <PersonIcon width='20px' height='20px' /> {text}
        </Button>
    )
}

export function UsernameDisabledButton({ text }) {
    return (
        <Button
            className="button inactiveButton"
            mb="3"
            size="3"
            radius="none"
            disabled
            style={{
                width: '100%',
                fontSize: '1.1rem'
            }}
        >
            <PersonIcon width='20px' height='20px' /> {text}
        </Button>
    )
}

export function UsernameConfirmButton({ text, onClick }) {
    return (
        <Button
            className="button activeButton"
            mb="3"
            size="3"
            radius="none"
            style={{
                width: '100%',
                fontSize: '1.1rem'
            }}
            onClick={onClick}
        >
            <PersonIcon width='20px' height='20px' /> {text}
        </Button>
    )
}

/**
 * Button used in the navigation bar.
 * 
 * Displays an icon and triggers navigation or actions.
 * 
 * @param { Object } props
 * @param { JSX.ELement } props.icon - Icon element
 * @param { Function } [props.onClick] - Click handler 
 */
export function NavbarButton( { icon, onClick = null } ) {
    return (
        <Button
            variant="solid"
            mb="3"
            size="3"
            radius="none"
            style={{
                cursor: 'pointer',
                height: "100%",
                aspectRatio: 1.3,
                backgroundColor: "darkgray",
                margin: 0,
                borderBottom: "8px rgba(0, 0, 0, 0.1) solid"
            }}
            onClick={onClick}
        >
            {icon}
        </Button>
    )
}

export function DropdownNavbarButton({icon}) {
    return (
        <DropdownMenu.Trigger>
            <Button
                variant="solid"
                mb="3"
                size="3"
                radius="none"
                style={{
                    cursor: 'pointer',
                    height: "100%",
                    aspectRatio: 1.3,
                    backgroundColor: "darkgray",
                    margin: 0,
                    borderBottom: "8px rgba(0, 0, 0, 0.1) solid"
                }}
            >
                {icon}
            </Button>
        </DropdownMenu.Trigger>
    )
}

/**
 * Logout button displayed in the navigation UI.
 * 
 * @param { Object } props
 * @param { string } props.text - Button label
 * @param { Function } props.onClick - Logout handler 
 */
export function LogoutButton({ text, onClick }) {
    return (
        <Button
            variant="solid"
            mb="3"
            size="3"
            radius="none"
            style={{
                cursor: 'pointer',
                height: "50%",
                aspectRatio: 1.5,
                backgroundColor: "darkgray",
                borderBottom: "8px rgba(0, 0, 0, 0.1) solid",
                textAlign: "center",
                margin: 10
            }}
            onClick={onClick}
        >
            {text}
        </Button>
    )
}