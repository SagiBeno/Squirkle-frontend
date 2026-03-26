import { TextArea, Text } from "@radix-ui/themes";

export default function AdminTextArea({ placeholder, name, id, value, onChange, title }) {

    return (
        <>
            <Text
                size="4"
                as='label'
                htmlFor={name}
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