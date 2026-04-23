import { Flex, Text } from '@radix-ui/themes';

export default function HomePageCard({ data }) {
    return (
        <Flex className='homePageCard'>
            {data?.image}

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