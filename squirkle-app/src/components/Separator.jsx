import { Box, Text } from '@radix-ui/themes';

/**
 * Separator component with centered text.
 * 
 * Displays a horizontal line with a label in the middle,
 * commonly used separate sections (e.g., "or").
 * 
 * @component
 * 
 * @param { Object } props
 * @param { string } props.text - Text displayed in the center of the separator
 *  
 * @returns { JSX.Element }
 */
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
                    backgroundColor: "darkgray",
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
                    background: "#21212c",
                    padding: "0 8px",
                    color: "white",
                    fontFamily: `"Fredoka", sans-serif`,
                }}
            >
                {text}
            </Text>
        </Box>
    )
}