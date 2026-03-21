import { Text, TextField } from "@radix-ui/themes"

export default function AdminTextField( { placeholder, name, id, value, onChange, title } ) {
    return (
        <>
            <Text
                size="4"
                as='label'
                htmlFor={name}
                style={{ cursor: 'pointer' }}
            >
                {title}
            </Text>

            <TextField.Root
                className="textField"
                radius="none"
                placeholder={placeholder}
                size="3"
                name={name}
                id={id}
                mt="2"
                mb="3"
                value={value}
                required
                onChange={(e) => {onChange(e)}}
            />
        </>
    )
}