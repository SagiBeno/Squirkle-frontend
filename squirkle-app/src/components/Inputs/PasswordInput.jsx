import { useState } from "react"
import { TextField, IconButton } from "@radix-ui/themes";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

/**
 * Password input field with visibility toggle.
 *
 * Wraps a Radix UI TextField and provides a button to show/hide
 * the password value.
 *
 * @component
 *
 * @param { Object } props - Component props
 * @param { string } props.inputName - Name and id of the input field
 * @param { string } props.value - Current password value
 * @param { Function } props.onChange - Change handler
 *
 * @returns { JSX.Element }
 */
export default function PasswordInput( { inputName, value, onChange } ) {
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => {
        setShowPassword(prev => !prev);
    }

    return (
        <TextField.Root
            className="textField"
            radius="none"
            placeholder="Password"
            size="3"
            name={inputName}
            id={inputName}
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={onChange}
            required
        >
            <TextField.Slot side="right">
                <IconButton
                    style={{
                        cursor: "pointer",
                        color: 'black'
                    }}
                    variant="ghost"
                    size="2"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={handleShowPassword}
                >

                    {
                        showPassword ?
                            <EyeClosedIcon height="25" width="25" />
                            :
                            <EyeOpenIcon height="25" width="25" />
                    }
                </IconButton>
            </TextField.Slot>
        </TextField.Root>
    )
}