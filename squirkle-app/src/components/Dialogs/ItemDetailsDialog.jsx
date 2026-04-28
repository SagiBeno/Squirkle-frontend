import { Blockquote, Button, Dialog, Flex, Heading, Spinner, Text, IconButton, ScrollArea } from '@radix-ui/themes'
import ItemStatBlock from '../GameComponents/ItemStatBlock'
import { CgPushChevronRight } from "react-icons/cg";
import { FaCircle, FaShoppingCart, FaSquare } from "react-icons/fa";
import { RiTriangleFill } from "react-icons/ri";
import { TbSquarePercentage } from "react-icons/tb";
import { GiPunch } from "react-icons/gi";
import MetadataBlock from '../Cards/MetadataBlock';
import { useEffect, useState } from 'react';
import { EquipWeapon, Unequip } from '../../GameHandler';
import { HiXMark } from "react-icons/hi2";

/**
 * @typedef { Object } ItemStats
 * @property { number } circleDamage
 * @property { number } squareDamage
 * @property { number } triangleDamage
 * @property { number } critChance
 * @property { number } critDamage
 * @property { string[] } metadata - Metadata IDs assigned to the item
 */

/**
 * @typedef { Object } ItemDetailsData
 * @property { string } [name]
 * @property { string } [description]
 * @property { string } [imageUrl]
 * @property { string } [type]
 * @property { number } [knockback]
 * @property { ItemStats } [stats]
 * @property { "equipped" | "listed" | "" } [state]
 */

/**
 * @typedef { Object } ListingData
 * @property { string } id
 * @property { string } username
 * @property { number } price
 */

/**
 * Dialog for displaying detailed information about an item.
 *
 * Shows item image, description, stats, metadata blocks, and context-specific
 * actions such as equipping, unequipping, inspecting, or buying an item.
 *
 * The rendered action panel depends on the `parentDialog` value.
 *
 * @component
 *
 * @param { Object } props - Component props
 * @param { ItemDetailsData null } props.itemData - Item data to display
 * @param { JSX.Element | null } [props.rightPanelExtra=null] - Optional custom right panel content
 * @param { "Inventory" | "BuyListing" | "CreateInspection" } props.parentDialog - Source dialog context
 * @param { Object | null } [props.createListingForm=null] - Create listing form data
 * @param { ListingData | null } [props.selectedListing=null] - Selected auction listing
 * @param { boolean } [props.selectedListingBuyable=false] - Whether the selected listing can be bought
 * @param { Function | null } [props.handleBuySelectedListing=null] - Function called when buying the selected listing
 * @param { boolean } [props.buyLoading=false] - Indicates whether purchase is loading
 * @param { boolean } [props.selectedListingLoading=false] - Indicates whether listing item details are loading
 * @param { Function } props.setOpen - Controls dialog visibility
 * @param { Function | null } props.GetPlayerInventory - Refreshes player inventory after equip/unequip
 *
 * @returns {JSX.Element} Item details dialog UI
 */
export default function ItemDetailsDialog({
    itemData,
    rightPanelExtra = null,
    parentDialog,
    createListingForm = null,
    selectedListing = null,
    selectedListingBuyable = false,
    handleBuySelectedListing = null,
    buyLoading = false,
    selectedListingLoading = false,
    setOpen,
    GetPlayerInventory
}) {

    const [metadatas, setMetadatas] = useState(null)
    const itemStats = itemData?.stats || null;

    /**
     * Fetches metadata details assigned to the current item.
     *
     * Uses metadata IDs from `itemData.stats.metadata` and stores
     * the loaded metadata results locally.
     */
    async function GetMetadatas() {
        if (itemData == null || itemStats == null || itemStats.metadata == null) {
            setMetadatas(null)
            return
        }
        let result = []

        for (let i = 0; i < itemStats.metadata.length; i++) {
            let json = await (await fetch("https://squirkle-backend.vercel.app/api/get-metadata/" + itemStats.metadata[i])).json()
            result.push(json)
        }

        setMetadatas(result)
    }

    /**
     * Equips the current item and refreshes the player inventory.
     */
    function TryEquipItem() {
        EquipWeapon(itemData);
        setOpen(false);
        GetPlayerInventory?.();
    }

    /**
     * Unequips the current item and refreshes the player inventory.
     */
    function TryUnequipItem() {
        Unequip(itemData.type);
        setOpen(false);
        GetPlayerInventory?.();
    }

    useEffect(() => {
        GetMetadatas()
        console.log("parentDialog: ", parentDialog)
    }, [itemData]);

    return (
        <Dialog.Content width="90vw" maxWidth="920px" height="80vh" style={{ padding: 0, borderRadius: 0, boxShadow: "none", backgroundColor: "transparent", overflow: 'hidden' }}>
            <Dialog.Title>
                <Flex
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%'
                    }}
                >
                    <Flex style={{ marginTop: 5, marginBottom: -15, backgroundColor: "white", width: "fit-content", padding: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                        ITEM DETAILS - {itemData == null ? "ITEM_NAME" : itemData.name}
                    </Flex>
                    <Flex style={{ marginTop: 5, marginBottom: -15, backgroundColor: "whitesmoke", width: "fit-content", padding: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                        <IconButton
                            className="button activeButton"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <HiXMark />
                        </IconButton>
                    </Flex>
                </Flex>
            </Dialog.Title>
            <ScrollArea type='auto' style={{ maxHeight: '80%' }}>
                <Flex style={{ backgroundColor: "white", flexWrap: 'wrap', justifyContent: 'center', flexDirection: 'row-reverse' }}>
                    <Flex align="center" style={{ backgroundColor: "whitesmoke", padding: 20, flexDirection: 'column', justifyContent: 'center', gap: 10 }} className='statsContainer'>
                        <img width={128} height={128} src={itemData?.imageUrl} />

                        <Flex
                            style={{
                                flexDirection: 'column',
                                gap: 2
                            }}
                        >
                            <Dialog.Description style={{ textAlign: 'center' }}>
                                {itemData == null ? "ITEM_NAME" : itemData.name}
                            </Dialog.Description>


                            <Flex justify="center" style={{ borderRadius: 10, overflow: "hidden" }}>
                                <ItemStatBlock
                                    icon={<FaCircle />}
                                    color="#7243ff"
                                    textColor="white"
                                    title=""
                                    value={itemStats?.circleDamage ?? 10}
                                    rounded={false}
                                    grow
                                />

                                <ItemStatBlock
                                    icon={<FaSquare />}
                                    color="#ff6243"
                                    textColor="white"
                                    title=""
                                    value={itemStats?.squareDamage ?? 10}
                                    rounded={false}
                                    grow
                                />

                                <ItemStatBlock
                                    icon={<RiTriangleFill />}
                                    color="#ffef43"
                                    textColor="black"
                                    title=""
                                    value={itemStats?.triangleDamage ?? 10}
                                    rounded={false}
                                    grow
                                />
                            </Flex>

                            <ItemStatBlock
                                icon={<TbSquarePercentage />}
                                color="#fff243"
                                textColor="black"
                                title="Crit Chance"
                                value={(itemStats?.critChance ?? 10) + "%"}
                            />

                            <ItemStatBlock
                                icon={<GiPunch />}
                                color="#ff5415"
                                textColor="white"
                                title="Crit Damage"
                                value={(itemStats?.critDamage ?? 1.5) + "x"}
                            />

                            <ItemStatBlock
                                icon={<CgPushChevronRight />}
                                color="#60225e"
                                textColor="white"
                                title="Knockback"
                                value={itemData != null ? itemData.knockback : 10}
                            />
                        </Flex>

                    </Flex>

                    <Flex direction="column" gap="3" flexGrow="1" style={{ padding: 20, width: '50%' }}>

                        <Blockquote style={{ marginTop: 10 }}>
                            {itemData == null ? "Lorem ipsum, dolor sit amet consectetur adipisicing elit as da sda. Lorem ipsum, dolor sit amet consectetur adipisicing elit as da sda." : itemData.description}
                        </Blockquote>

                        {
                            metadatas?.map((x, i) => <MetadataBlock meta={x.metadata} key={i} />)
                        }

                        <Flex gap="1" align="center" justify="start" style={{ marginTop: "auto" }}>
                            {
                                parentDialog === "Inventory" ?
                                    itemData?.state === 'equipped' ?
                                        <Button
                                            className="button activeButton"
                                            radius='none'
                                            size='3'
                                            onClick={TryUnequipItem}
                                        >
                                            Unequip Item
                                        </Button>
                                        :
                                        itemData?.state === 'listed' ?
                                            <Text size="2" color="gray">This item is currently listed and cannot be equipped.</Text>
                                            :
                                            <Button
                                                className="button activeButton"
                                                radius='none'
                                                size='3'
                                                onClick={TryEquipItem}
                                            >
                                                Equip Item
                                            </Button>
                                    : null
                            }


                        </Flex>

                        <Flex style={{ marginTop: '30px' }}>
                            {
                                parentDialog === "BuyListing" ?
                                    (selectedListing ? (
                                        <Flex direction="column" gap="2" mt="2" style={{ width: '100%' }}>
                                            <Text size="2" color="gray">Seller: {selectedListing.username}</Text>
                                            <Heading size="4">Price: {selectedListing.price}</Heading>
                                            {selectedListingBuyable ? (
                                                <Button
                                                    onClick={handleBuySelectedListing}
                                                    disabled={buyLoading || selectedListingLoading || !selectedListing}
                                                    style={{ width: '100%' }}
                                                    className={`button ${buyLoading || selectedListingLoading || !selectedListing ? 'inactiveButton' : 'activeButton'}`}
                                                >
                                                    {
                                                        buyLoading
                                                            ?
                                                            <Flex style={{ alignItems: 'center', gap: 2 }}><Spinner /> <Text>Buying...</Text></Flex>
                                                            :
                                                            <Flex style={{ alignItems: 'center', gap: 2 }}><FaShoppingCart /> <Text>Buy Item</Text></Flex>
                                                    }
                                                </Button>
                                            ) : (
                                                <Text size="2" color="gray">This listing is inactive and can only be inspected.</Text>
                                            )}
                                        </Flex>
                                    ) : null)
                                    : parentDialog === "CreateInspection" ?
                                        (itemData ? (
                                            <Flex direction="column" gap="2" mt="2" style={{ width: '100%' }}>
                                                <Text size="2" color="gray">Selected for listing</Text>
                                                <Text size="2" color="gray">Type: {itemData.type}</Text>
                                                <Heading size="4">Set Price: {createListingForm?.price || '-'}</Heading>
                                            </Flex>
                                        ) : null)
                                        : rightPanelExtra
                            }
                        </Flex>
                    </Flex>
                </Flex>
            </ScrollArea>
        </Dialog.Content>
    )
}
