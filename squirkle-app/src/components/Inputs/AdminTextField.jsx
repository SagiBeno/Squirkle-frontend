import { Text, TextField } from "@radix-ui/themes"

/**
 * Reusable text input component for admin pages.
 *
 * Wraps a labeled Radix UI TextField with consistent styling.
 *
 * @component
 *
 * @param { Object } props - Component props
 * @param { string } props.placeholder - Placeholder text
 * @param { string } props.name - Input name attribute
 * @param { string } props.id - Input id attribute
 * @param { string | number } props.value - Current input value
 * @param { Function } props.onChange - Change handler
 * @param { string } props.title - Label text displayed above the input
 *
 * @returns { JSX.Element }
 */
export default function AdminTextField( { placeholder, name, id, value, onChange, title } ) {
    return (
        <>
            <Text
                size="4"
                as='label'
                htmlFor={id}
                style={{ cursor: 'pointer', marginBottom: '5px', marginTop: '10px' }}
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
                onChange={onChange}
                style={{  marginBottom: '12px' }}
            />
        </>
    )
}