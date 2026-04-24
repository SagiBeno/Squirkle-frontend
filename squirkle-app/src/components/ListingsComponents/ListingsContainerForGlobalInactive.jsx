import { ScrollArea, Flex, Text } from "@radix-ui/themes";
import InactiveGlobalListingCard from "./InactiveGlobalListingCard";

/**
 * Container component for displaying inactive (previous) marketplace listings.
 *
 * Renders a list of previous listings with a header.
 * Uses ScrollArea on larger screens and a stacked layout on smaller screens.
 * Displays an empty state if no listings are available.
 *
 * @component
 *
 * @param { Object } props - Component props
 * @param { Array<Object> } props.inactiveListings - List of inactive listings
 * @param { Function } props.handleOpenListing - Callback when a listing is clicked
 * @param { boolean } props.isLow - Determines layout (scrollable vs stacked)
 *
 * @returns { JSX.Element }
 */
export default function ListingsContainerForGlobalInactive({ inactiveListings, handleOpenListing, isLow }) {
    const Header = (
        <Flex
            direction="row"
            style={{
                backgroundColor: '#646465',
                color: 'white',
                borderRadius: '10px',
                justifyContent: 'start',
                padding: '10px',
                fontFamily: `"Fredoka", sans-serif`,
                borderBottom: '8px solid #494949',
                marginBottom: '5px'
            }}
        >
            <Text size='4' style={{ fontWeight: '550', letterSpacing: '1px' }}>Previous listing(s)</Text>
        </Flex>
    );

    return (
        <>
            {
                !inactiveListings || inactiveListings.length === 0
                    ?
                    <Flex>
                        <Text size="5" style={{ color: 'white', margin: '10px auto 20px auto', textAlign: 'center' }}>No previous listing yet.</Text>
                    </Flex>
                    :
                    <>
                        {Header}
                        {
                            !isLow ?
                                <ScrollArea type="auto" style={{ padding: '0px 15px 5px 15px' }}>
                                    <Flex style={{ flexDirection: 'column', gap: 4 }}>
                                        {
                                            inactiveListings.map((listing, index) => <InactiveGlobalListingCard key={listing.id || index} listing={listing} idx={index} handleOpenListing={handleOpenListing} />)
                                        }
                                    </Flex>
                                </ScrollArea>
                                :
                                    
                                <Flex style={{ flexDirection: 'column', gap: 4, padding: '0px 10px' }}>
                                    {
                                        inactiveListings.map((listing, index) => <InactiveGlobalListingCard key={listing.id || index} listing={listing} idx={index} handleOpenListing={handleOpenListing} />)
                                    }
                                </Flex>
                            }
                    </>
            }
        </>

    )
}