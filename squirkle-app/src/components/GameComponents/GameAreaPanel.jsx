import { Dialog, Flex, Text } from '@radix-ui/themes'
import "../../Game.css";
import { LoadArea } from '../../GameHandler.js'
import { FaLock } from "react-icons/fa6";
import { FaUnlock } from "react-icons/fa6";
import { GiTwoCoins } from 'react-icons/gi';
import { useState, useContext } from 'react';
import { GameContext } from "./GameContext.jsx"

/**
 * @typedef { Object } GameArea
 * @property { string } id - Unique identifier of the game area
 * @property { string } name - Display name of the area
 * @property { string } imageUrl - Background image URL of the area
 * @property { number } price - Purchase price of the area
 */

/**
 * Game area selection panel.
 *
 * Displays a game area card with lock/unlock state, price,
 * and purchase availability. If the area is already purchased,
 * clicking the panel loads the area. Otherwise, it attempts
 * to purchase the area if the user has enough coins.
 *
 * @component
 *
 * @param { Object } props - Component props
 * @param { GameArea } props.areaData - Area data to display
 * @param { string[] } props.purchasedAreas - IDs of areas already purchased by the user
 * @param { Object } props.user - Current authenticated user data
 * @param { Function } props.refresh - Refreshes user data after purchasing an area
 *
 * @returns { JSX.Element } Game area panel UI
 */

export default function GameAreaPanel({ areaData, purchasedAreas, user, refresh, toastData, setToastData }) {

    const gameContext = useContext(GameContext)
    const [hover, setHover] = useState(false)
    const canBuy = user.coinCount >= areaData?.price
    const purchased = purchasedAreas.includes(areaData?.id)

    /**
     * Attempts to purchase the selected area.
     *
     * If the purchase succeeds, refreshes user data and loads the area.
     */
    async function TryPurchase() {
        if (purchased) return;

        if (!canBuy) {
            setToastData({ open: true, title: 'Failed to purchase area', description: "You don't have enough coins!", isError: true });
            return;
        }

        let res = await fetch(`https://squirkle-backend.vercel.app/api/purchase-area/${areaData.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.user.uid })
        })

        if (res.status === 200) {
            setToastData({ open: true, title: 'Area purchased successfully', description: '', isError: false });
            refresh()
            LoadArea(areaData.id)
        } else setToastData({ open: true, title: 'Failed to purchase area', description: res?.error ?? '', isError: true });
    }

    /**
     * Handles area panel click.
     *
     * Loads the area if already purchased, otherwise attempts to purchase it.
     */
    function OnClick() {
        if (purchased) {
            LoadArea(areaData.id);
            setToastData({ open: true, title: 'Area selected', description: '', isError: false });
        }
        else TryPurchase()
    }

    return (
        <Dialog.Close onClick={OnClick}>
            <Flex direction="column" style={{ backgroundImage: `url(${areaData.imageUrl})`, position: "relative", }} className={purchased ? 'gameAreaPanel purchased' : "gameAreaPanel"}
                onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                <div style={{ flexGrow: 1 }} />
                <Flex className='gameAreaPanelTitle'>
                    <Text style={{ color: "white", fontWeight: "bold", textShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)" }} size="7">{areaData.name}</Text>
                </Flex>

                {
                    purchased ? null :
                        <Flex direction="column" align="center" justify="center" style={{ position: "absolute", width: "100%", height: "90%" }} className='gameAreaLock'>
                            {
                                canBuy && hover ?
                                    <FaUnlock color='white' size={32} style={{ filter: "drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.5))" }} />
                                    : <FaLock color='white' size={32} style={{ filter: "drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.5))" }} />
                            }
                            <Flex align="center" gap="1">
                                <GiTwoCoins size={24} color="#f2c94c" />
                                <Text style={{ color: "#f2c94c", fontWeight: "bold", textShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)" }} size="7">{areaData.price}</Text>
                            </Flex>
                        </Flex>
                }
            </Flex>
        </Dialog.Close>
    )
}
