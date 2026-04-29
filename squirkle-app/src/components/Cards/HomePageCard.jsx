import { Flex, Text } from '@radix-ui/themes';

/**
 * Home page card component.
 * 
 * Displays a feature card with icon, title, and description.
 * 
 * @component
 * 
 * @param { Object } props - Component props
 * @param { HomePageCardData } props.data - Card data to display
 * 
 * @returns { JSX.Element } Home page card UI
 */
export default function HomePageCard({ data }) {
    return (
        <Flex className='homePageCard'>
            {data?.image ?? null}

            <Flex
                style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: 'auto 0',
                    color: 'white',
                    gap: 6
                }}
            >
                <Text style={{ fontWeight: 'bold' }} className='gradientTitle1' size="6">{data.title}</Text>
                <Text size="4" style={{ opacity: '0.6' }}>{data.description}</Text>
            </Flex>
        </Flex>
    )
}