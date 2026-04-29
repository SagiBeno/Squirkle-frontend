import { TextArea, Text } from "@radix-ui/themes";

/**
 * Reusable textarea input component for admin pages.
 *
 * Wraps a labeled Radix UI TextArea with consistent styling.
 *
 * @component
 *
 * @param { Object } props - Component props
 * @param { string } props.placeholder - Placeholder text
 * @param { string } props.name - Input name attribute
 * @param { string } props.id - Input id attribute
 * @param { string } props.value - Current textarea value
 * @param { Function } props.onChange - Change handler
 * @param { string } props.title - Label text displayed above the textarea
 *
 * @returns { JSX.Element }
 */

export default function AdminTextArea({ placeholder, name, id, value, onChange, title }) {

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

            <TextArea
                className='textArea'
                radius="none"
                placeholder={placeholder}
                size="3"
                name={name}
                id={id}
                mt="2"
                mb="3"
                value={value}
                required
                resize='vertical'
                onChange={onChange}
                style={{
                    maxHeight: '500px',
                }}
            />
        </>
    )
}