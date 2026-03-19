import { Blockquote, Box, Dialog, Flex } from '@radix-ui/themes'
import React from 'react'
import ItemStatBlock from '../ItemStatBlock'
import { CgPushChevronRight } from "react-icons/cg";
import { FaCircle, FaSquare } from "react-icons/fa";
import { RiTriangleFill } from "react-icons/ri";
import { TbSquarePercentage } from "react-icons/tb";
import { GiPunch } from "react-icons/gi";
import MetadataBlock from '../MetaDataBlock';
import { useEffect } from 'react';

export default function ItemDetailsDialog({ itemData }) {

    return (
        <Dialog.Content width="90vw" maxWidth="920px" height="80vh" style={{ padding: 0, borderRadius: 0, boxShadow: "none", backgroundColor: "transparent", overflow: "auto" }}>
            <Dialog.Title style={{marginTop: 5, marginBottom: -10, backgroundColor: "white", width: "fit-content", padding: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>ITEM DETAILS - { itemData == null ? "ITEM_NAME" : itemData.name }</Dialog.Title>

            <Flex style={{backgroundColor: "white", height: "calc(100% - 40px)"}}>
                <Flex direction="column" flexGrow="1" style={{padding: 10}}>

                    <Blockquote style={{marginTop: 10}}>
                        {itemData == null ? "Lorem ipsum, dolor sit amet consectetur adipisicing elit as da sda. Lorem ipsum, dolor sit amet consectetur adipisicing elit as da sda." : itemData.description}
                    </Blockquote>

                    {
                        itemData?.stats.metadata?.map((x, i) => <MetadataBlock key={i} metaID={x}/>)
                    }

                </Flex>

                <Flex align="center" direction="column" gap="1" style={{backgroundColor: "whitesmoke", padding: 20}}>
                    <img width={128} height={128} src={itemData?.imageUrl}/>

                    <Dialog.Description>
                        { itemData == null ? "ITEM_NAME" : itemData.name }
                    </Dialog.Description>

                    <Flex justify="center" style={{borderRadius: 10, overflow: "hidden"}}>
                        <ItemStatBlock 
                            icon={<FaCircle/>} 
                            color="#7243ff" 
                            textColor="white" 
                            title="" 
                            value={itemData != null ? itemData.stats.circleDamage : 10}
                            rounded={false}
                            grow
                        />

                        <ItemStatBlock 
                            icon={<FaSquare/>} 
                            color="#ff6243" 
                            textColor="white" 
                            title="" 
                            value={itemData != null ? itemData.stats.squareDamage : 10}
                            rounded={false}
                            grow
                        />

                        <ItemStatBlock 
                            icon={<RiTriangleFill/>} 
                            color="#ffef43" 
                            textColor="black"
                            title="" 
                            value={itemData != null ? itemData.stats.triangleDamage : 10}
                            rounded={false}
                            grow
                        />
                    </Flex>

                    <ItemStatBlock 
                        icon={<TbSquarePercentage/>} 
                        color="#fff243" 
                        textColor="black" 
                        title="Crit Chance" 
                        value={(itemData != null ? itemData.stats.critChance : 10) + "%"}
                    />

                    <ItemStatBlock 
                        icon={<GiPunch/>} 
                        color="#ff5415" 
                        textColor="white" 
                        title="Crit Damage" 
                        value={(itemData != null ? itemData.stats.critDamage : 1.5) + "x"}
                    />

                    <ItemStatBlock 
                        icon={<CgPushChevronRight/>} 
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
