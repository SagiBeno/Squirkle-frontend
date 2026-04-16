import { Flex, Text } from '@radix-ui/themes';

export default function HomePageCard({ data }) {
    return (
        <Flex
            style={{
                minWidth: '250px',
                maxWidth: '300px',
                minHeight: '250px',
                maxHeight: '350px',
                boxShadow: '0px 0px 20px 5px black',
                backdropFilter: 'blur(10px)',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '15px',
                gap: 20,
                borderRadius: '12px'
            }}
        >
            <img 
                src={data?.image}
                alt={`${data.title} icon`} 
                title={`${data.title} icon`} 
                style={{
                    width: '150px',
                    margin: '0 auto'
                }}
            />

            <Flex
                style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: 'auto 0',
                    color: 'white',
                    gap: 6
                }}
            >
                <Text style={{ fontWeight: 'bold' }} size="6">{data.title}</Text>
                <Text size="4" style={{ opacity: '0.6' }}>{data.description}</Text>
            </Flex>
        </Flex>
    )
}