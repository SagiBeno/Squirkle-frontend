import { useState } from "react"
import { TextField, IconButton } from "@radix-ui/themes";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

export default function PasswordInput( { inputName, value, onChange } ) {
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    return (
        <TextField.Root
            radius="full"
            placeholder="Password"
            size="3"
            name={inputName}
            id={inputName}
            mb="3"
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={onChange}
            required
        >
            <TextField.Slot side="right">
                <IconButton
                    style={{
                        cursor: "pointer",
                    }}
                    variant="ghost"
                    size="2"
                    aria-label={showPassword ? "Show password" : "Hide password"}
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