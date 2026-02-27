import { Box, Text } from '@radix-ui/themes';

export default function Separator( { text } ) {
    return (
        <Box 
            my="5" 
            style={{ 
                position: "relative", 
                textAlign: "center", 
                opacity: 0.8,
            }}>
            <Box
                style={{
                    height: 1,
                    backgroundColor: "gray",
                }}
            />

            <Text
                size="2"
                color="gray"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "white",
                    padding: "0 8px",
                    color: "gray",
                    fontFamily: `"Fredoka", sans-serif`,
                }}
            >
                {text}
            </Text>
        </Box>
    )
}