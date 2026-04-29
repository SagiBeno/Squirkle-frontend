import { ScrollArea, Flex, Text } from "@radix-ui/themes";
import ActiveGlobalListingCard from "./ActiveGlobalListingCard";

/**
 * Container component for displaying active global marketplace listings.
 *
 * Renders a list of active listings with a header.
 * Uses ScrollArea on larger screens and a simple flex layout on smaller screens.
 *
 * @component
 *
 * @param { Object } props - Component props
 * @param { Array<Object> } props.activeListings - List of active listings
 * @param { Function } props.handleOpenListing - Callback when a listing is clicked
 * @param { boolean } props.isLow - Determines layout (scrollable vs stacked for small height screens)
 *
 * @returns { JSX.Element }
 */
export default function ListingsContainerForGlobalActive({ activeListings, handleOpenListing, isLow }) {

    const Header = (
        <Flex
            direction="row"
            style={{
                backgroundColor: 'rgb(100, 100, 121)',
                color: 'white',
                borderRadius: '10px',
                justifyContent: 'start',
                padding: '10px',
                fontFamily: `"Fredoka", sans-serif`,
                borderBottom: '8px rgba(0, 0, 0, 0.2) solid',
                marginBottom: '5px',
            }}
        >
            <Text size='4' style={{ fontWeight: '550', letterSpacing: '1px' }}>
                Active listing(s)
            </Text>
        </Flex>
    );

    return (
        <>
            {
                !activeListings || activeListings.length === 0
                    ?
                    <Flex>
                        <Text size="5" style={{ color: 'white', margin: '10px auto 20px auto', textAlign: 'center' }}>No active listing yet.</Text>
                    </Flex>
                    :
                    <>
                        {Header}
                        {
                            !isLow ?
                            <ScrollArea type="auto" style={{ padding: '0px 15px 5px 15px' }}>
                                <Flex style={{ flexDirection: 'column', gap: 4 }}>
                                    {
                                        activeListings.map((listing, index) => <ActiveGlobalListingCard key={listing.id || index} listing={listing} idx={index} handleOpenListing={handleOpenListing} />)
                                    }
                                </Flex>
                            </ScrollArea>
                            :
                            <Flex style={{ flexDirection: 'column', gap: 4, padding: '0px 10px' }}>
                                {
                                    activeListings.map((listing, index) => <ActiveGlobalListingCard key={listing.id || index} listing={listing} idx={index} handleOpenListing={handleOpenListing} />)
                                }
                            </Flex>
                        }
                    </>
            }
        </>

    )
}