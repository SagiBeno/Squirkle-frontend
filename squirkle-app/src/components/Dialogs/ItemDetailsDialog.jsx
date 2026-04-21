import { Blockquote, Button, Dialog, Flex, Heading, Spinner, Text } from '@radix-ui/themes'
import ItemStatBlock from '../GameComponents/ItemStatBlock'
import { CgPushChevronRight } from "react-icons/cg";
import { FaCircle, FaShoppingCart, FaSquare } from "react-icons/fa";
import { RiTriangleFill } from "react-icons/ri";
import { TbSquarePercentage } from "react-icons/tb";
import { GiPunch } from "react-icons/gi";
import MetadataBlock from '../Cards/MetadataBlock';
import { useEffect } from 'react';
import { useState } from 'react';
import { EquipWeapon, Unequip } from '../../GameHandler';

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
}) {

    const [metadatas, setMetadatas] = useState(null)
    const itemStats = itemData?.stats || null;

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

    function TryEquipItem() {
        EquipWeapon(itemData);
    }

    function TryUnequipItem() {
        Unequip(itemData.type);
    }

    useEffect(() => {
        GetMetadatas()
        console.log("parentDialog: ", parentDialog)
    }, [itemData])

    return (
        <Dialog.Content width="90vw" maxWidth="920px" height="80vh" style={{ padding: 0, borderRadius: 0, boxShadow: "none", backgroundColor: "transparent", overflow: "auto" }}>
            <Dialog.Title style={{ marginTop: 5, marginBottom: -10, backgroundColor: "white", width: "fit-content", padding: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>ITEM DETAILS - {itemData == null ? "ITEM_NAME" : itemData.name}</Dialog.Title>

            <Flex style={{ backgroundColor: "white", height: "calc(100% - 40px)" }}>
                <Flex direction="column" gap="3" flexGrow="1" style={{ padding: 20 }}>

                    <Blockquote style={{ marginTop: 10 }}>
                        {itemData == null ? "Lorem ipsum, dolor sit amet consectetur adipisicing elit as da sda. Lorem ipsum, dolor sit amet consectetur adipisicing elit as da sda." : itemData.description}
                    </Blockquote>

                    {
                        metadatas?.map((x, i) => <MetadataBlock meta={x.metadata} key={i} />)
                    }

                    <Flex gap="1" align="center" justify="start" style={{ marginTop: "auto" }}>
                        {
                            parentDialog == "Inventory" ?
                                itemData?.state === 'equipped' ?
                                    <Button
                                        className={`button ${true ? 'activeButton' : 'inactiveButton'}`}
                                        disabled={!true}
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
                                            className={`button ${true ? 'activeButton' : 'inactiveButton'}`}
                                            disabled={!true}
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
                            parentDialog == "BuyListing" ?
                                (selectedListing ? (
                                    <Flex direction="column" gap="2" mt="2" style={{ width: '100%' }}>
                                        <Text size="2" color="gray">Seller: {selectedListing.username}</Text>
                                        <Heading size="4">Price: {selectedListing.price}</Heading>
                                        {selectedListingBuyable ? (
                                            <Button
                                                onClick={handleBuySelectedListing}
                                                disabled={buyLoading || selectedListingLoading || !selectedListing}
                                                style={{ width: '100%' }}
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
                                : parentDialog == "CreateInspection" ?
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

                <Flex align="center" direction="column" gap="1" style={{ backgroundColor: "whitesmoke", padding: 20 }}>
                    <img width={128} height={128} src={itemData?.imageUrl} />

                    <Dialog.Description>
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


        </Dialog.Content>
    )
}
